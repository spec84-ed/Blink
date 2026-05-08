import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "bg-white"
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: string;
}) {
  return (
    <section className={`rounded-[1.75rem] border border-ink/10 p-4 shadow-card ${tone}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-ink/55">{label}</p>
          <p className="mt-2 text-2xl font-black text-ink">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink/5 text-ink">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-ink/55">{detail}</p>
    </section>
  );
}
