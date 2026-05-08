import { NextResponse } from "next/server";
import type { FoodSource, Prisma } from "@prisma/client";
import { normalizeOpenFoodFactsProduct, normalizeUsdaFood } from "@/lib/food-sources";
import type { NormalizedFood } from "@/lib/food-sources";
import { prisma } from "@/lib/prisma";

const cacheTtlMs = 1000 * 60 * 60 * 24 * 90;
const notFoundCacheTtlMs = 1000 * 60 * 60 * 24 * 7;
const sourceOrder = ["open_food_facts", "usda"];
const openFoodFactsContactEmail = process.env.OPEN_FOOD_FACTS_CONTACT_EMAIL ?? "my-email@example.com";
const openFoodFactsUserAgent = `BlinkAway/1.0 (contact: ${openFoodFactsContactEmail})`;

function foodSourceFor(food: NormalizedFood | null): FoodSource {
  if (food?.source === "usda") {
    return "USDA";
  }

  return "OPEN_FOOD_FACTS";
}

function isFresh(date: Date, ttlMs: number) {
  return Date.now() - date.getTime() < ttlMs;
}

async function getCachedBarcode(barcode: string) {
  try {
    const cached = await prisma.barcodeLookupCache.findUnique({ where: { barcode } });
    if (!cached) {
      return null;
    }

    const ttl = cached.isComplete ? cacheTtlMs : notFoundCacheTtlMs;
    if (!isFresh(cached.lastChecked, ttl)) {
      return null;
    }

    return cached;
  } catch (error) {
    console.warn("Barcode cache read failed", error);
    return null;
  }
}

async function saveBarcodeCache({
  barcode,
  food,
  payload
}: {
  barcode: string;
  food: NormalizedFood | null;
  payload: Prisma.InputJsonValue;
}) {
  try {
    await prisma.barcodeLookupCache.upsert({
      where: { barcode },
      update: {
        source: foodSourceFor(food),
        sourceId: food?.sourceId,
        payload,
        isComplete: food?.isComplete ?? false,
        lastChecked: new Date()
      },
      create: {
        barcode,
        source: foodSourceFor(food),
        sourceId: food?.sourceId,
        payload,
        isComplete: food?.isComplete ?? false
      }
    });
  } catch (error) {
    console.warn("Barcode cache write failed", error);
  }
}

export async function GET(_: Request, { params }: { params: Promise<{ barcode: string }> }) {
  const { barcode } = await params;

  if (!barcode) {
    return NextResponse.json({ error: "Barcode is required." }, { status: 400 });
  }

  const cached = await getCachedBarcode(barcode);
  if (cached) {
    const payload = cached.payload as { food?: NormalizedFood | null; alternatives?: NormalizedFood[]; nextAction?: string };
    return NextResponse.json({
      food: payload.food ?? null,
      alternatives: payload.alternatives ?? [],
      sourceOrder,
      cache: "hit",
      nextAction: payload.nextAction
    }, { status: cached.isComplete ? 200 : 404 });
  }

  let openFoodFactsMeta: Prisma.InputJsonValue = { status: "not_requested" };

  try {
    const offResponse = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`, {
      headers: {
        "User-Agent": openFoodFactsUserAgent
      },
      next: { revalidate: 60 * 60 * 24 * 30 }
    });

    if (offResponse.ok) {
      const offData = await offResponse.json();
      openFoodFactsMeta = { status: offData.status ?? null, code: offData.code ?? barcode };
      const food = offData.product ? normalizeOpenFoodFactsProduct(offData.product) : null;

      if (food?.isComplete) {
        const payload = { food, alternatives: [], sourceOrder, providerMeta: { openFoodFacts: openFoodFactsMeta } };
        await saveBarcodeCache({ barcode, food, payload });
        return NextResponse.json({ food, alternatives: [], sourceOrder, cache: "miss" });
      }

      if (food) {
        openFoodFactsMeta = { status: offData.status ?? null, code: offData.code ?? barcode, normalizedFoodName: food.name };
      }
    }
  } catch (error) {
    console.warn("Open Food Facts lookup failed", error);
  }

  const usdaKey = process.env.USDA_API_KEY;
  if (usdaKey) {
    const usdaUrl = new URL("https://api.nal.usda.gov/fdc/v1/foods/search");
    usdaUrl.searchParams.set("api_key", usdaKey);
    usdaUrl.searchParams.set("query", barcode);
    usdaUrl.searchParams.set("dataType", "Branded");
    usdaUrl.searchParams.set("pageSize", "5");

    try {
      const usdaResponse = await fetch(usdaUrl);
      if (usdaResponse.ok) {
        const usdaData = await usdaResponse.json();
        const foods = Array.isArray(usdaData.foods) ? (usdaData.foods.map(normalizeUsdaFood).filter(Boolean) as NormalizedFood[]) : [];

        if (foods.length > 0) {
          const payload = {
            food: foods[0],
            alternatives: foods.slice(1),
            sourceOrder,
            providerMeta: { openFoodFacts: openFoodFactsMeta, usdaResultCount: foods.length }
          };
          await saveBarcodeCache({ barcode, food: foods[0], payload });
          return NextResponse.json({ food: foods[0], alternatives: foods.slice(1), sourceOrder, cache: "miss" });
        }
      }
    } catch (error) {
      console.warn("USDA barcode fallback failed", error);
    }
  }

  const notFoundPayload = {
    food: null,
    alternatives: [],
    sourceOrder,
    nextAction: "create_custom_food",
    providerMeta: { openFoodFacts: openFoodFactsMeta }
  };
  await saveBarcodeCache({ barcode, food: null, payload: notFoundPayload });

  return NextResponse.json(
    {
      food: null,
      alternatives: [],
      sourceOrder,
      cache: "miss",
      nextAction: "create_custom_food"
    },
    { status: 404 }
  );
}
