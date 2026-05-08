"use client";

import { useEffect, useMemo, useState } from "react";
import { estimateTargets, type ActivityLevel, type Goal } from "@/lib/nutrition";

export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snacks";

export type Food = {
  id: string;
  name: string;
  brand?: string;
  source: "USDA" | "Open Food Facts" | "Custom" | "Recent";
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  barcode?: string;
  lastUsedAt?: string;
};

export type FoodEntry = {
  id: string;
  foodId: string;
  mealType: MealType;
  quantity: number;
  loggedAt: string;
};

export type UserProfile = {
  name: string;
  age: number;
  sex: "female" | "male" | "non_binary" | "prefer_not_to_say";
  heightCm: number;
  weightKg: number;
  goalWeightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  weeklyPaceKg: number;
  dietaryPreferences: string[];
};

export type Targets = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
};

export type AppState = {
  profile: UserProfile;
  targets: Targets;
  foods: Food[];
  entries: FoodEntry[];
  waterMl: number;
  weightEntries: Array<{ id: string; date: string; weightKg: number }>;
};

const storageKey = "nutrivue-state-v1";
export const mealTypes: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const starterFoods: Food[] = [
  food("chicken-breast", "Chicken breast", "USDA", 100, "g", 165, 31, 0, 3.6),
  food("eggs", "Eggs", "USDA", 100, "g", 143, 13, 1, 10),
  food("banana", "Banana", "USDA", 1, "medium", 105, 1, 27, 0),
  food("protein-shake", "Protein shake", "Recent", 1, "bottle", 240, 30, 10, 6),
  food("greek-yogurt-bowl", "Greek yogurt bowl", "Custom", 1, "bowl", 310, 32, 38, 5),
  food("burrito-bowl", "Chicken burrito bowl", "Custom", 1, "bowl", 540, 46, 61, 14),
  food("almonds", "Almonds", "USDA", 28, "g", 164, 6, 6, 14),
  food("rice", "White rice", "USDA", 1, "cup cooked", 205, 4, 45, 0),
  food("big-mac", "McDonald's Big Mac", "Recent", 1, "sandwich", 590, 25, 46, 34)
];

const defaultProfile: UserProfile = {
  name: "Maya",
  age: 32,
  sex: "female",
  heightCm: 173,
  weightKg: 81,
  goalWeightKg: 78,
  activityLevel: "moderate",
  goal: "lose",
  weeklyPaceKg: 0.25,
  dietaryPreferences: ["High protein"]
};

const estimatedDefaultTargets = estimateTargets(defaultProfile);
const defaultTargets = {
  calories: estimatedDefaultTargets.dailyCalories,
  protein: estimatedDefaultTargets.protein,
  carbs: estimatedDefaultTargets.carbs,
  fat: estimatedDefaultTargets.fat,
  waterMl: 3000
};

const defaultState: AppState = {
  profile: defaultProfile,
  targets: defaultTargets,
  foods: starterFoods,
  entries: [
    entry("greek-yogurt-bowl", "Breakfast"),
    entry("burrito-bowl", "Lunch"),
    entry("protein-shake", "Snacks"),
    entry("banana", "Snacks")
  ],
  waterMl: 1500,
  weightEntries: [
    { id: "w1", date: "2026-04-08", weightKg: 83.5 },
    { id: "w2", date: "2026-04-22", weightKg: 82.1 },
    { id: "w3", date: "2026-05-07", weightKg: 81 }
  ]
};

function food(
  id: string,
  name: string,
  source: Food["source"],
  servingSize: number,
  servingUnit: string,
  calories: number,
  protein: number,
  carbs: number,
  fat: number
): Food {
  return { id, name, source, servingSize, servingUnit, calories, protein, carbs, fat };
}

function entry(foodId: string, mealType: MealType): FoodEntry {
  return { id: cryptoId(), foodId, mealType, quantity: 1, loggedAt: new Date().toISOString() };
}

function cryptoId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2);
}

function readState(): AppState {
  if (typeof window === "undefined") {
    return defaultState;
  }

  const stored = window.localStorage.getItem(storageKey);
  if (!stored) {
    return defaultState;
  }

  try {
    return { ...defaultState, ...JSON.parse(stored) } as AppState;
  } catch {
    return defaultState;
  }
}

export function useNutrivueStore() {
  const [state, setState] = useState<AppState>(defaultState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(readState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [ready, state]);

  const foodById = useMemo(() => new Map(state.foods.map((item) => [item.id, item])), [state.foods]);

  const hydratedEntries = useMemo(
    () =>
      state.entries
        .map((item) => {
          const food = foodById.get(item.foodId);
          if (!food) {
            return null;
          }

          return { ...item, food };
        })
        .filter(Boolean) as Array<FoodEntry & { food: Food }>,
    [foodById, state.entries]
  );

  const totals = useMemo(() => {
    return hydratedEntries.reduce(
      (sum, item) => {
        sum.calories += Math.round(item.food.calories * item.quantity);
        sum.protein += Math.round(item.food.protein * item.quantity);
        sum.carbs += Math.round(item.food.carbs * item.quantity);
        sum.fat += Math.round(item.food.fat * item.quantity);
        return sum;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [hydratedEntries]);

  function addFood(foodInput: Omit<Food, "id" | "lastUsedAt">) {
    const newFood: Food = {
      ...foodInput,
      id: cryptoId(),
      lastUsedAt: new Date().toISOString()
    };
    setState((current) => ({ ...current, foods: [newFood, ...current.foods] }));
    return newFood;
  }

  function addEntry(foodId: string, mealType: MealType, quantity = 1) {
    const newEntry: FoodEntry = {
      id: cryptoId(),
      foodId,
      mealType,
      quantity,
      loggedAt: new Date().toISOString()
    };

    setState((current) => ({
      ...current,
      foods: current.foods.map((item) => (item.id === foodId ? { ...item, lastUsedAt: new Date().toISOString() } : item)),
      entries: [newEntry, ...current.entries]
    }));
  }

  function addFoodAndEntry(foodInput: Omit<Food, "id" | "lastUsedAt">, mealType: MealType, quantity = 1) {
    const newFood = {
      ...foodInput,
      id: cryptoId(),
      lastUsedAt: new Date().toISOString()
    };
    const newEntry = {
      id: cryptoId(),
      foodId: newFood.id,
      mealType,
      quantity,
      loggedAt: new Date().toISOString()
    };

    setState((current) => ({
      ...current,
      foods: [newFood, ...current.foods],
      entries: [newEntry, ...current.entries]
    }));
  }

  function removeEntry(entryId: string) {
    setState((current) => ({ ...current, entries: current.entries.filter((item) => item.id !== entryId) }));
  }

  function duplicateEntry(entryId: string) {
    const found = state.entries.find((item) => item.id === entryId);
    if (found) {
      addEntry(found.foodId, found.mealType, found.quantity);
    }
  }

  function moveEntry(entryId: string, mealType: MealType) {
    setState((current) => ({
      ...current,
      entries: current.entries.map((item) => (item.id === entryId ? { ...item, mealType } : item))
    }));
  }

  function setWaterMl(waterMl: number) {
    setState((current) => ({ ...current, waterMl: Math.max(0, waterMl) }));
  }

  function saveProfile(profile: UserProfile) {
    const nextTargets = estimateTargets(profile);
    setState((current) => ({
      ...current,
      profile,
      targets: {
        calories: nextTargets.dailyCalories,
        protein: nextTargets.protein,
        carbs: nextTargets.carbs,
        fat: nextTargets.fat,
        waterMl: current.targets.waterMl || 3000
      },
      weightEntries: [
        ...current.weightEntries,
        { id: cryptoId(), date: new Date().toISOString().slice(0, 10), weightKg: profile.weightKg }
      ]
    }));
  }

  function resetDemoData() {
    setState(defaultState);
  }

  return {
    state,
    ready,
    hydratedEntries,
    totals,
    addFood,
    addEntry,
    addFoodAndEntry,
    removeEntry,
    duplicateEntry,
    moveEntry,
    setWaterMl,
    saveProfile,
    resetDemoData
  };
}

export function entriesForMeal(entries: Array<FoodEntry & { food: Food }>, mealType: MealType) {
  return entries
    .filter((item) => item.mealType === mealType)
    .map((item) => ({
      id: item.id,
      name: item.food.name,
      serving: `${item.quantity} x ${item.food.servingSize} ${item.food.servingUnit}`,
      calories: Math.round(item.food.calories * item.quantity),
      protein: Math.round(item.food.protein * item.quantity),
      carbs: Math.round(item.food.carbs * item.quantity),
      fat: Math.round(item.food.fat * item.quantity),
      mealType: item.mealType
    }));
}
