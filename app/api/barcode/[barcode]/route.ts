import { NextResponse } from "next/server";
import { normalizeOpenFoodFactsProduct, normalizeUsdaFood } from "@/lib/food-sources";

export async function GET(_: Request, { params }: { params: Promise<{ barcode: string }> }) {
  const { barcode } = await params;

  if (!barcode) {
    return NextResponse.json({ error: "Barcode is required." }, { status: 400 });
  }

  const offResponse = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`, {
    next: { revalidate: 60 * 60 * 24 }
  });

  if (offResponse.ok) {
    const offData = await offResponse.json();
    const food = offData.product ? normalizeOpenFoodFactsProduct(offData.product) : null;

    if (food?.isComplete) {
      return NextResponse.json({ food, sourceOrder: ["open_food_facts"] });
    }
  }

  const usdaKey = process.env.USDA_API_KEY;
  if (usdaKey) {
    const usdaUrl = new URL("https://api.nal.usda.gov/fdc/v1/foods/search");
    usdaUrl.searchParams.set("api_key", usdaKey);
    usdaUrl.searchParams.set("query", barcode);
    usdaUrl.searchParams.set("dataType", "Branded");
    usdaUrl.searchParams.set("pageSize", "5");

    const usdaResponse = await fetch(usdaUrl);
    if (usdaResponse.ok) {
      const usdaData = await usdaResponse.json();
      const foods = Array.isArray(usdaData.foods) ? usdaData.foods.map(normalizeUsdaFood).filter(Boolean) : [];

      if (foods.length > 0) {
        return NextResponse.json({ food: foods[0], alternatives: foods.slice(1), sourceOrder: ["open_food_facts", "usda"] });
      }
    }
  }

  return NextResponse.json(
    {
      food: null,
      sourceOrder: ["open_food_facts", "usda"],
      nextAction: "create_custom_food"
    },
    { status: 404 }
  );
}
