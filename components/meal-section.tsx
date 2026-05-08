import Link from "next/link";
import { Copy, MoveRight, Plus, Trash2 } from "lucide-react";
import { mealTypes, type MealType } from "@/lib/app-store";

type Entry = {
  id: string;
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType?: MealType;
};

export function MealSection({
  type,
  calories,
  entries,
  onDelete,
  onDuplicate,
  onMove
}: {
  type: MealType;
  calories: number;
  entries: Entry[];
  onDelete?: (entryId: string) => void;
  onDuplicate?: (entryId: string) => void;
  onMove?: (entryId: string, mealType: MealType) => void;
}) {
  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white p-4 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-ink">{type}</h2>
          <p className="text-sm font-semibold text-ink/45">{calories} cal logged</p>
        </div>
        <Link href={`/add-food?meal=${type}`} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime text-ink" aria-label={`Add ${type}`}>
          <Plus className="h-5 w-5" />
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink/15 bg-field px-4 py-5 text-sm font-semibold text-ink/45">
            No foods yet
          </div>
        ) : (
          entries.map((entry) => (
            <article key={entry.id} className="rounded-2xl bg-field p-3">
              <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-black text-ink">{entry.name}</h3>
                <p className="mt-1 text-xs font-semibold text-ink/45">{entry.serving}</p>
                <p className="mt-2 text-xs font-bold text-ink/45">
                  P {entry.protein}g | C {entry.carbs}g | F {entry.fat}g
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <p className="text-right text-sm font-black text-ink">{entry.calories}</p>
              </div>
              </div>
              {(onDelete || onDuplicate || onMove) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {onDuplicate && (
                    <button onClick={() => onDuplicate(entry.id)} className="flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-black text-ink/60">
                      <Copy className="h-3.5 w-3.5" /> Duplicate
                    </button>
                  )}
                  {onMove && (
                    <label className="flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-black text-ink/60">
                      <MoveRight className="h-3.5 w-3.5" />
                      <select
                        className="bg-transparent outline-none"
                        value={entry.mealType ?? type}
                        onChange={(event) => onMove(entry.id, event.target.value as MealType)}
                      >
                        {mealTypes.map((mealType) => (
                          <option key={mealType} value={mealType}>
                            {mealType}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(entry.id)} className="flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-black text-coral">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  )}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
