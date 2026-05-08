export type NormalizedFood = {
  source: "open_food_facts" | "usda";
  sourceId?: string;
  barcode?: string;
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  sugarG?: number;
  sodiumMg?: number;
  isComplete: boolean;
};

type OpenFoodFactsProduct = {
  code?: string;
  product_name?: string;
  brands?: string;
  serving_quantity?: string | number;
  serving_size?: string;
  nutriments?: Record<string, number | string | undefined>;
};

function numberFrom(value: unknown, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeOpenFoodFactsProduct(product: OpenFoodFactsProduct): NormalizedFood | null {
  const nutriments = product.nutriments ?? {};
  const name = product.product_name?.trim();

  if (!name) {
    return null;
  }

  const calories = Math.round(numberFrom(nutriments["energy-kcal_serving"], numberFrom(nutriments["energy-kcal_100g"])));
  const proteinG = numberFrom(nutriments.proteins_serving, numberFrom(nutriments.proteins_100g));
  const carbsG = numberFrom(nutriments.carbohydrates_serving, numberFrom(nutriments.carbohydrates_100g));
  const fatG = numberFrom(nutriments.fat_serving, numberFrom(nutriments.fat_100g));

  return {
    source: "open_food_facts",
    sourceId: product.code,
    barcode: product.code,
    name,
    brand: product.brands,
    servingSize: numberFrom(product.serving_quantity, 100),
    servingUnit: product.serving_size ?? "serving",
    calories,
    proteinG,
    carbsG,
    fatG,
    fiberG: numberFrom(nutriments.fiber_serving, numberFrom(nutriments.fiber_100g)),
    sugarG: numberFrom(nutriments.sugars_serving, numberFrom(nutriments.sugars_100g)),
    sodiumMg: numberFrom(nutriments.sodium_serving, numberFrom(nutriments.sodium_100g)) * 1000,
    isComplete: calories > 0 && proteinG >= 0 && carbsG >= 0 && fatG >= 0
  };
}

type UsdaFood = {
  fdcId?: number;
  description?: string;
  brandName?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  foodNutrients?: Array<{ nutrientName?: string; nutrientNumber?: string; value?: number; unitName?: string }>;
};

function nutrient(food: UsdaFood, names: string[], numbers: string[]) {
  const hit = food.foodNutrients?.find((item) => {
    const nutrientName = item.nutrientName?.toLowerCase() ?? "";
    const nutrientNumber = item.nutrientNumber ?? "";
    return names.some((name) => nutrientName.includes(name)) || numbers.includes(nutrientNumber);
  });

  return numberFrom(hit?.value);
}

export function normalizeUsdaFood(food: UsdaFood): NormalizedFood | null {
  const name = food.description?.trim();
  if (!name) {
    return null;
  }

  const calories = Math.round(nutrient(food, ["energy"], ["208"]));
  const proteinG = nutrient(food, ["protein"], ["203"]);
  const carbsG = nutrient(food, ["carbohydrate"], ["205"]);
  const fatG = nutrient(food, ["total lipid", "fat"], ["204"]);

  return {
    source: "usda",
    sourceId: food.fdcId ? String(food.fdcId) : undefined,
    name,
    brand: food.brandName,
    servingSize: food.servingSize ?? 100,
    servingUnit: food.servingSizeUnit ?? "g",
    calories,
    proteinG,
    carbsG,
    fatG,
    fiberG: nutrient(food, ["fiber"], ["291"]),
    sugarG: nutrient(food, ["sugars"], ["269"]),
    sodiumMg: nutrient(food, ["sodium"], ["307"]),
    isComplete: calories > 0 && proteinG >= 0 && carbsG >= 0 && fatG >= 0
  };
}
