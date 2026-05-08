import { AppShell } from "@/components/app-shell";
import { MealSection } from "@/components/meal-section";
import { PageHeader } from "@/components/page-header";
import { meals, targets, today } from "@/lib/mock-data";

export default function DiaryPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Daily diary" title="Meals by time of day" />
      <section className="mb-5 rounded-[2rem] bg-white p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">May 7</p>
            <h1 className="mt-1 text-2xl font-black text-ink">{today.calories} / {targets.calories} calories</h1>
          </div>
          <div className="flex rounded-2xl bg-field p-1">
            {["Yesterday", "Today", "Tomorrow"].map((day) => (
              <button key={day} className="rounded-xl px-4 py-2 text-sm font-black text-ink/55 hover:bg-white hover:text-ink">{day}</button>
            ))}
          </div>
        </div>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        {meals.map((meal) => (
          <MealSection key={meal.type} {...meal} />
        ))}
      </div>
    </AppShell>
  );
}
