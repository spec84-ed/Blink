export type Goal = "lose" | "maintain" | "gain";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9
};

export function estimateTargets(input: {
  sex: "female" | "male" | "non_binary" | "prefer_not_to_say";
  age: number;
  heightCm: number;
  weightKg: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  weeklyPaceKg?: number;
}) {
  const sexOffset = input.sex === "female" ? -161 : 5;
  const bmr = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age + sexOffset;
  const maintenance = bmr * activityMultipliers[input.activityLevel];
  const pace = input.weeklyPaceKg ?? 0.25;
  const calorieDelta = input.goal === "maintain" ? 0 : (pace * 7700) / 7;
  const calories =
    input.goal === "lose" ? maintenance - calorieDelta : input.goal === "gain" ? maintenance + calorieDelta : maintenance;

  const dailyCalories = Math.round(Math.max(1200, calories));
  const protein = Math.round(input.weightKg * 1.8);
  const fat = Math.round((dailyCalories * 0.28) / 9);
  const carbs = Math.round((dailyCalories - protein * 4 - fat * 9) / 4);

  return { dailyCalories, protein, carbs: Math.max(0, carbs), fat };
}
