import { NextResponse } from "next/server";
import { normalizeUsdaFood } from "@/lib/food-sources";

const packagedTerms = ["brand", "bar", "cereal", "chips", "mcdonald", "big mac", "shake", "protein"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ error: "Search query is required." }, { status: 400 });
  }

  const usdaKey = process.env.USDA_API_KEY;
  if (!usdaKey) {
    return NextResponse.json({
      foods: [],
      warning: "USDA_API_KEY is not configured.",
      sourceOrder: ["usda", "open_food_facts"]
    });
  }

  const isLikelyPackaged = packagedTerms.some((term) => query.toLowerCase().includes(term));
  const usdaUrl = new URL("https://api.nal.usda.gov/fdc/v1/foods/search");
  usdaUrl.searchParams.set("api_key", usdaKey);
  usdaUrl.searchParams.set("query", query);
  usdaUrl.searchParams.set("pageSize", "20");
  usdaUrl.searchParams.set("dataType", isLikelyPackaged ? "Branded,Foundation,SR Legacy" : "Foundation,SR Legacy,Branded");

  const response = await fetch(usdaUrl, { next: { revalidate: 60 * 60 * 24 } });
  if (!response.ok) {
    return NextResponse.json({ error: "USDA search failed." }, { status: response.status });
  }

  const data = await response.json();
  const foods = Array.isArray(data.foods) ? data.foods.map(normalizeUsdaFood).filter(Boolean) : [];

  return NextResponse.json({
    foods,
    sourceOrder: isLikelyPackaged ? ["open_food_facts", "usda_branded", "usda_generic"] : ["usda_generic", "usda_branded", "open_food_facts"]
  });
}
