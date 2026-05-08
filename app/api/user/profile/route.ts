import { NextResponse } from "next/server";
import { z } from "zod";
import { estimateTargets } from "@/lib/nutrition";

const profileSchema = z.object({
  sex: z.enum(["female", "male", "non_binary", "prefer_not_to_say"]),
  age: z.number().int().positive(),
  heightCm: z.number().positive(),
  weightKg: z.number().positive(),
  goalWeightKg: z.number().positive().optional(),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "very_active"]),
  goal: z.enum(["lose", "maintain", "gain"]),
  weeklyPaceKg: z.number().positive().optional(),
  dietaryPreferences: z.array(z.string()).default([])
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const result = profileSchema.safeParse(json);

  if (!result.success) {
    return NextResponse.json({ error: "Invalid profile payload.", details: result.error.flatten() }, { status: 400 });
  }

  const targets = estimateTargets(result.data);

  return NextResponse.json({
    profile: result.data,
    targets,
    status: "calculated"
  });
}
