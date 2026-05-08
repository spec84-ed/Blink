import { Activity, Apple, Beef, Coffee, Droplets, Egg, Flame, Wheat } from "lucide-react";

export const targets = {
  calories: 2240,
  protein: 150,
  carbs: 245,
  fat: 72,
  waterMl: 3000
};

export const today = {
  calories: 1540,
  protein: 104,
  carbs: 168,
  fat: 46,
  waterMl: 1900,
  weightStart: 184,
  weightCurrent: 178.6,
  weightGoal: 172
};

export const meals = [
  {
    type: "Breakfast",
    calories: 460,
    entries: [
      { name: "Greek yogurt bowl", serving: "1 bowl", calories: 310, protein: 32, carbs: 38, fat: 5 },
      { name: "Cold brew with oat milk", serving: "12 oz", calories: 150, protein: 3, carbs: 18, fat: 7 }
    ]
  },
  {
    type: "Lunch",
    calories: 620,
    entries: [
      { name: "Chicken burrito bowl", serving: "1 bowl", calories: 540, protein: 46, carbs: 61, fat: 14 },
      { name: "Salsa verde", serving: "2 tbsp", calories: 80, protein: 1, carbs: 9, fat: 3 }
    ]
  },
  {
    type: "Dinner",
    calories: 0,
    entries: []
  },
  {
    type: "Snacks",
    calories: 460,
    entries: [
      { name: "Protein shake", serving: "1 bottle", calories: 240, protein: 30, carbs: 10, fat: 6 },
      { name: "Banana", serving: "1 medium", calories: 105, protein: 1, carbs: 27, fat: 0 },
      { name: "Almonds", serving: "0.7 oz", calories: 115, protein: 4, carbs: 5, fat: 10 }
    ]
  }
];

export const recentFoods = [
  { name: "Chicken breast", source: "USDA", calories: 165, protein: 31, icon: Beef },
  { name: "Eggs", source: "USDA", calories: 143, protein: 13, icon: Egg },
  { name: "Banana", source: "USDA", calories: 105, protein: 1, icon: Apple },
  { name: "Protein oats", source: "Custom", calories: 390, protein: 34, icon: Wheat },
  { name: "Cold brew oat latte", source: "Recent", calories: 150, protein: 3, icon: Coffee }
];

export const macroCards = [
  { label: "Protein", value: today.protein, target: targets.protein, unit: "g", color: "#ff7c66", icon: Activity },
  { label: "Carbs", value: today.carbs, target: targets.carbs, unit: "g", color: "#72b7d2", icon: Wheat },
  { label: "Fat", value: today.fat, target: targets.fat, unit: "g", color: "#d9a55f", icon: Flame },
  { label: "Water", value: today.waterMl / 1000, target: targets.waterMl / 1000, unit: "L", color: "#5cb7d7", icon: Droplets }
];

export const weeklyCalories = [
  { day: "Mon", calories: 2180, protein: 146 },
  { day: "Tue", calories: 2290, protein: 151 },
  { day: "Wed", calories: 2040, protein: 135 },
  { day: "Thu", calories: 2380, protein: 158 },
  { day: "Fri", calories: 1540, protein: 104 },
  { day: "Sat", calories: 0, protein: 0 },
  { day: "Sun", calories: 0, protein: 0 }
];

export const weightTrend = [
  { label: "Apr 8", weight: 184 },
  { label: "Apr 15", weight: 182.8 },
  { label: "Apr 22", weight: 181.4 },
  { label: "Apr 29", weight: 179.6 },
  { label: "May 6", weight: 178.6 }
];
