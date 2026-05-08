import type { LucideIcon } from "lucide-react";

export function MacroCard({
  label,
  value,
  target,
  unit,
  color,
  icon: Icon
}: {
  label: string;
  value: number;
  target: number;
  unit: string;
  color: string;
  icon: LucideIcon;
}) {
  const pct = Math.min(100, Math.round((value / target) * 100));

  return (
    <section className="rounded-[1.5rem] border border-ink/10 bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl" style={{ backgroundColor: `${color}22`, color }}>
          <Icon className="h-5 w-5" />
        </span>
        <p className="text-sm font-bold text-ink/45">{pct}%</p>
      </div>
      <p className="mt-4 text-sm font-semibold text-ink/55">{label}</p>
      <p className="mt-1 text-xl font-black text-ink">
        {value}
        <span className="text-sm font-bold text-ink/40"> / {target}{unit}</span>
      </p>
      <div className="mt-3 h-2 rounded-full bg-ink/8">
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </section>
  );
}
