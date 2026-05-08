import { Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function FoodSearchCard({
  name,
  source,
  calories,
  protein,
  icon: Icon
}: {
  name: string;
  source: string;
  calories: number;
  protein: number;
  icon: LucideIcon;
}) {
  return (
    <article className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-ink/10 bg-white p-4 shadow-card">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-field text-moss">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-black text-ink">{name}</h3>
          <p className="mt-1 text-xs font-bold text-ink/45">
            {source} | {calories} cal | {protein}g protein
          </p>
        </div>
      </div>
      <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ink text-white" aria-label={`Add ${name}`}>
        <Plus className="h-5 w-5" />
      </button>
    </article>
  );
}
