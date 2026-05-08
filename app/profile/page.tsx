"use client";

import Link from "next/link";
import { Bell, ChevronRight, Settings, ShieldCheck, UserRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { useNutrivueStore } from "@/lib/app-store";

export default function ProfilePage() {
  const { state, resetDemoData } = useNutrivueStore();
  const settings = [
    { label: "Nutrition targets", detail: `${state.targets.calories} calories | ${state.targets.protein}g protein`, icon: Settings },
    { label: "Diet preferences", detail: state.profile.dietaryPreferences.join(", ") || "None selected", icon: UserRound },
    { label: "Reminders", detail: "Water and dinner logging", icon: Bell },
    { label: "Privacy and data", detail: "Local-first data on this device", icon: ShieldCheck }
  ];

  return (
    <AppShell>
      <PageHeader eyebrow="Account" title="Profile" />
      <section className="rounded-[2rem] bg-ink p-6 text-white shadow-soft">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-lime text-2xl font-black text-ink">{state.profile.name.slice(0, 1).toUpperCase() || "N"}</div>
          <div>
            <h2 className="text-2xl font-black">{state.profile.name}</h2>
            <p className="text-sm font-semibold text-white/55">{state.profile.goal} weight | {state.profile.activityLevel.replace("_", " ")}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/onboarding" className="inline-flex rounded-2xl bg-white/10 px-5 py-3 text-sm font-black text-white">
            Edit plan
          </Link>
          <button onClick={resetDemoData} className="inline-flex rounded-2xl bg-white/10 px-5 py-3 text-sm font-black text-white">
            Reset demo data
          </button>
        </div>
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
