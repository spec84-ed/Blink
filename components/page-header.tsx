import Link from "next/link";
import { Bell, ScanLine } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function PageHeader({
  title,
  eyebrow,
  actionHref = "/add-food"
}: {
  title: string;
  eyebrow: string;
  actionHref?: string;
}) {
  return (
    <header className="mb-6 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-black text-ink sm:text-4xl">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Link href={actionHref} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white shadow-card" aria-label="Scan food">
          <ScanLine className="h-5 w-5" />
        </Link>
        <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ink/10 bg-white text-ink/70" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
