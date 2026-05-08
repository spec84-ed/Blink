"use client";

import Link from "next/link";
import { CalendarDays, Scale, Sparkles, Utensils } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AssistantCard } from "@/components/assistant-card";
import { MacroCard } from "@/components/macro-card";
import { MealSection } from "@/components/meal-section";
import { PageHeader } from "@/components/page-header";
import { ProgressRing } from "@/components/progress-ring";
import { StatCard } from "@/components/stat-card";
import { weeklyCalories } from "@/lib/mock-data";
import { BarChart } from "@/components/simple-chart";
import { entriesForMeal, mealTypes, useNutrivueStore } from "@/lib/app-store";

export default function DashboardPage() {
  const { state, hydratedEntries, totals, setWaterMl } = useNutrivueStore();
  const caloriesRemaining = state.targets.calories - totals.calories;
  const caloriePct = Math.round((totals.calories / state.targets.calories) * 100);
  const latestWeight = state.weightEntries.at(-1)?.weightKg ?? state.profile.weightKg;
  const startWeight = state.weightEntries[0]?.weightKg ?? state.profile.weightKg;
  const goalWeight = state.profile.goalWeightKg;
  const weightPct = Math.round(((startWeight - latestWeight) / Math.max(0.1, startWeight - goalWeight)) * 100);
  const macroCards = [
    { label: "Protein", value: totals.protein, target: state.targets.protein, unit: "g", color: "#ff7c66", icon: Sparkles },
    { label: "Carbs", value: totals.carbs, target: state.targets.carbs, unit: "g", color: "#72b7d2", icon: CalendarDays },
    { label: "Fat", value: totals.fat, target: state.targets.fat, unit: "g", color: "#d9a55f", icon: Utensils },
    { label: "Water", value: state.waterMl / 1000, target: state.targets.waterMl / 1000, unit: "L", color: "#5cb7d7", icon: Scale }
  ];

  return (
    <AppShell>
      <PageHeader eyebrow="Today, May 7" title="Nutrivue" />

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] bg-ink p-5 text-white shadow-soft sm:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-lime">Daily energy</p>
              <h2 className="mt-3 max-w-md text-3xl font-black leading-tight sm:text-5xl">
                {Math.max(0, caloriesRemaining)} calories left for the day.
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/add-food" className="rounded-2xl bg-lime px-5 py-3 text-sm font-black text-ink">
                  Add food
                </Link>
                <Link href="/diary" className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-black text-white">
                  View diary
                </Link>
              </div>
            </div>
            <ProgressRing value={caloriePct} color="#d9f26f" size="h-56 w-56">
              <div>
                <p className="text-4xl font-black text-ink">{totals.calories}</p>
                <p className="mt-1 text-sm font-bold text-ink/45">of {state.targets.calories} cal</p>
              </div>
            </ProgressRing>
          </div>
        </section>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <StatCard label="Weight progress" value={`${Math.max(0, weightPct)}%`} detail={`${Math.round(latestWeight * 2.20462)} lb current | ${Math.round(goalWeight * 2.20462)} lb goal`} icon={Scale} tone="bg-oat" />
          <StatCard label="AI insight" value={totals.protein >= state.targets.protein * 0.7 ? "Protein is steady" : "Protein is low"} detail={`${Math.max(0, state.targets.protein - totals.protein)}g protein left for target.`} icon={Sparkles} />
        </div>
      </div>

      <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {macroCards.map((macro) => (
          <MacroCard key={macro.label} {...macro} />
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          {mealTypes.slice(0, 3).map((mealType) => (
            <MealSection
              key={mealType}
              type={mealType}
              calories={entriesForMeal(hydratedEntries, mealType).reduce((sum, item) => sum + item.calories, 0)}
              entries={entriesForMeal(hydratedEntries, mealType)}
            />
          ))}
        </div>
        <div className="space-y-5">
          <section className="rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-ink">Weekly calories</h2>
                <p className="text-sm font-semibold text-ink/45">Average weekday intake versus target</p>
              </div>
              <CalendarDays className="h-5 w-5 text-moss" />
            </div>
            <div className="mt-6">
              <BarChart data={weeklyCalories} valueKey="calories" target={state.targets.calories} />
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-card">
            <h2 className="text-xl font-black text-ink">Water</h2>
            <p className="mt-1 text-sm font-semibold text-ink/45">{state.waterMl} ml logged today</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={() => setWaterMl(state.waterMl + 250)} className="rounded-2xl bg-field px-4 py-3 text-sm font-black text-ink">+250 ml</button>
              <button onClick={() => setWaterMl(Math.max(0, state.waterMl - 250))} className="rounded-2xl bg-field px-4 py-3 text-sm font-black text-ink">-250 ml</button>
            </div>
          </section>

          <section className="rounded-[1.75rem] bg-lime p-5 text-ink shadow-card">
            <Utensils className="h-6 w-6" />
            <h2 className="mt-5 text-2xl font-black">Fast log is ready</h2>
            <p className="mt-2 max-w-lg text-sm font-semibold text-ink/65">
              Recent foods, saved meals, barcode lookup, and custom food creation are grouped in one add-food surface.
            </p>
          </section>
          <AssistantCard />
        </div>
      </section>
    </AppShell>
  );
}
