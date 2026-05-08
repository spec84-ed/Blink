import Link from "next/link";
import { Bell, ChevronRight, Settings, ShieldCheck, UserRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";

const settings = [
  { label: "Nutrition targets", detail: "2240 calories | 150g protein", icon: Settings },
  { label: "Diet preferences", detail: "High protein, low sodium", icon: UserRound },
  { label: "Reminders", detail: "Water and dinner logging", icon: Bell },
  { label: "Privacy and data", detail: "Export or delete account data", icon: ShieldCheck }
];

export default function ProfilePage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Account" title="Profile" />
      <section className="rounded-[2rem] bg-ink p-6 text-white shadow-soft">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-lime text-2xl font-black text-ink">M</div>
          <div>
            <h2 className="text-2xl font-black">Maya Rivera</h2>
            <p className="text-sm font-semibold text-white/55">Lose weight | Moderate activity</p>
          </div>
        </div>
        <Link href="/onboarding" className="mt-6 inline-flex rounded-2xl bg-white/10 px-5 py-3 text-sm font-black text-white">
          Edit plan
        </Link>
      </section>

      <section className="mt-5 space-y-3">
        {settings.map((item) => (
          <article key={item.label} className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-ink/10 bg-white p-4 shadow-card">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-field text-moss">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-black text-ink">{item.label}</h3>
                <p className="text-sm font-semibold text-ink/45">{item.detail}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-ink/35" />
          </article>
        ))}
      </section>
    </AppShell>
  );
}
