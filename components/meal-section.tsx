import { MoreHorizontal, Plus } from "lucide-react";

type Entry = {
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export function MealSection({ type, calories, entries }: { type: string; calories: number; entries: Entry[] }) {
  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-ink">{type}</h2>
          <p className="text-sm font-semibold text-ink/45">{calories} cal logged</p>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime text-ink" aria-label={`Add ${type}`}>
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink/15 bg-field px-4 py-5 text-sm font-semibold text-ink/45">
            No foods yet
          </div>
        ) : (
          entries.map((entry) => (
            <article key={`${type}-${entry.name}`} className="flex items-center justify-between gap-3 rounded-2xl bg-field p-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-black text-ink">{entry.name}</h3>
                <p className="mt-1 text-xs font-semibold text-ink/45">{entry.serving}</p>
                <p className="mt-2 text-xs font-bold text-ink/45">
                  P {entry.protein}g | C {entry.carbs}g | F {entry.fat}g
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <p className="text-right text-sm font-black text-ink">{entry.calories}</p>
                <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-ink/55" aria-label={`Edit ${entry.name}`}>
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
