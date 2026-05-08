import { Activity, Flame, Scale, Trophy } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { BarChart } from "@/components/simple-chart";
import { StatCard } from "@/components/stat-card";
import { targets, weeklyCalories, weightTrend } from "@/lib/mock-data";

export default function ProgressPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Trends" title="Progress" />
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Weekly average" value="2,223 cal" detail="17 cal under target" icon={Flame} />
        <StatCard label="Protein consistency" value="82%" detail="4 of 5 days on pace" icon={Activity} />
        <StatCard label="Goal progress" value="46%" detail="5.4 lb down since start" icon={Trophy} tone="bg-lime" />
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
            <BarChart data={weeklyCalories} valueKey="calories" target={targets.calories} />
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
            {weightTrend.map((point, index) => (
              <div key={point.label} className="flex items-center gap-3">
                <span className="w-14 text-xs font-black text-ink/45">{point.label}</span>
                <div className="h-3 flex-1 rounded-full bg-field">
                  <div className="h-3 rounded-full bg-moss" style={{ width: `${86 - index * 7}%` }} />
                </div>
                <span className="w-14 text-right text-sm font-black text-ink">{point.weight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
