import Link from "next/link";
import { CalendarDays, Scale, Sparkles, Utensils } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AssistantCard } from "@/components/assistant-card";
import { MacroCard } from "@/components/macro-card";
import { MealSection } from "@/components/meal-section";
import { PageHeader } from "@/components/page-header";
import { ProgressRing } from "@/components/progress-ring";
import { StatCard } from "@/components/stat-card";
import { macroCards, meals, targets, today, weeklyCalories } from "@/lib/mock-data";
import { BarChart } from "@/components/simple-chart";

export default function DashboardPage() {
  const caloriesRemaining = targets.calories - today.calories;
  const caloriePct = Math.round((today.calories / targets.calories) * 100);
  const weightPct = Math.round(((today.weightStart - today.weightCurrent) / (today.weightStart - today.weightGoal)) * 100);

  return (
    <AppShell>
      <PageHeader eyebrow="Today, May 7" title="Nutrivue" />

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] bg-ink p-5 text-white shadow-soft sm:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-lime">Daily energy</p>
              <h2 className="mt-3 max-w-md text-3xl font-black leading-tight sm:text-5xl">
                {caloriesRemaining} calories left with dinner still open.
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
                <p className="text-4xl font-black text-ink">{today.calories}</p>
                <p className="mt-1 text-sm font-bold text-ink/45">of {targets.calories} cal</p>
              </div>
            </ProgressRing>
          </div>
        </section>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
          <StatCard label="Weight progress" value={`${weightPct}%`} detail={`${today.weightCurrent} lb current | ${today.weightGoal} lb goal`} icon={Scale} tone="bg-oat" />
          <StatCard label="AI insight" value="Protein is steady" detail="Dinner can close the last 46g without pushing calories high." icon={Sparkles} />
        </div>
      </div>

      <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {macroCards.map((macro) => (
          <MacroCard key={macro.label} {...macro} />
        ))}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          {meals.slice(0, 3).map((meal) => (
            <MealSection key={meal.type} {...meal} />
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
              <BarChart data={weeklyCalories} valueKey="calories" target={targets.calories} />
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
