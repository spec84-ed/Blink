"use client";

import { Activity, Flame, Scale, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { BarChart } from "@/components/simple-chart";
import { StatCard } from "@/components/stat-card";
import { weeklyCalories } from "@/lib/mock-data";
import { useNutrivueStore } from "@/lib/app-store";

export default function ProgressPage() {
  const { state, totals } = useNutrivueStore();
  const startWeight = state.weightEntries[0]?.weightKg ?? state.profile.weightKg;
  const latestWeight = state.weightEntries.at(-1)?.weightKg ?? state.profile.weightKg;
  const goalProgress = Math.round(((startWeight - latestWeight) / Math.max(0.1, startWeight - state.profile.goalWeightKg)) * 100);
  const proteinPct = Math.round((totals.protein / state.targets.protein) * 100);

  return (
    <AppShell>
      <PageHeader eyebrow="Trends" title="Progress" />
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Today calories" value={`${totals.calories} cal`} detail={`${Math.max(0, state.targets.calories - totals.calories)} remaining`} icon={Flame} />
        <StatCard label="Protein consistency" value={`${proteinPct}%`} detail={`${totals.protein}g of ${state.targets.protein}g today`} icon={Activity} />
        <StatCard label="Goal progress" value={`${Math.max(0, goalProgress)}%`} detail={`${Math.round((startWeight - latestWeight) * 2.20462 * 10) / 10} lb down`} icon={Trophy} tone="bg-lime" />
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-ink/10 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-ink">Calories over time</h2>
              <p className="text-sm font-semibold text-ink/45">Clean weekly intake view</p>
            </div>
            <Flame className="h-5 w-5 text-coral" />
          </div>
          <div className="mt-6">
            <BarChart data={[...weeklyCalories.slice(0, 4), { day: "Today", calories: totals.calories, protein: totals.protein }]} valueKey="calories" target={state.targets.calories} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-ink/10 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-ink">Weight trend</h2>
              <p className="text-sm font-semibold text-ink/45">Steady movement toward goal</p>
            </div>
            <Scale className="h-5 w-5 text-moss" />
          </div>
          <div className="mt-8 space-y-3">
            {state.weightEntries.map((point, index) => (
              <div key={point.id} className="flex items-center gap-3">
                <span className="w-20 text-xs font-black text-ink/45">{point.date.slice(5)}</span>
                <div className="h-3 flex-1 rounded-full bg-field">
                  <div className="h-3 rounded-full bg-moss" style={{ width: `${86 - index * 7}%` }} />
                </div>
                <span className="w-14 text-right text-sm font-black text-ink">{Math.round(point.weightKg * 2.20462)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
