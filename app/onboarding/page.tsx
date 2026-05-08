"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Dumbbell } from "lucide-react";
import { useNutrivueStore, type UserProfile } from "@/lib/app-store";
import { estimateTargets } from "@/lib/nutrition";

const steps = ["Profile", "Body", "Goals", "Preferences"];
const preferences = ["High protein", "Vegetarian", "Gluten-free", "Low sodium", "Dairy-free"];

export default function OnboardingPage() {
  const router = useRouter();
  const { state, ready, saveProfile } = useNutrivueStore();
  const [profile, setProfile] = useState<UserProfile>(state.profile);
  const estimated = estimateTargets(profile);

  useEffect(() => {
    if (ready) {
      setProfile(state.profile);
    }
  }, [ready, state.profile]);

  function update<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function togglePreference(pref: string) {
    setProfile((current) => ({
      ...current,
      dietaryPreferences: current.dietaryPreferences.includes(pref)
        ? current.dietaryPreferences.filter((item) => item !== pref)
        : [...current.dietaryPreferences, pref]
    }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveProfile(profile);
    router.push("/");
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-6 sm:px-6">
      <header className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink font-black text-lime">N</span>
          <span className="text-lg font-black text-ink">Nutrivue</span>
        </Link>
        <Link href="/" className="text-sm font-black text-ink/50">Skip</Link>
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="rounded-[2rem] bg-ink p-6 text-white shadow-soft">
          <Dumbbell className="h-8 w-8 text-lime" />
          <h1 className="mt-6 text-4xl font-black leading-tight">Set targets that actually fit your life.</h1>
          <p className="mt-4 text-base font-medium leading-7 text-white/65">
            Nutrivue uses your body, activity, goal, and pace to estimate a calorie budget and macro plan you can adjust later.
          </p>
          <div className="mt-8 space-y-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl bg-white/8 p-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-lime text-sm font-black text-ink">
                  {index === 0 ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                <span className="font-bold">{step}</span>
              </div>
            ))}
          </div>
        </aside>

        <form onSubmit={submit} className="rounded-[2rem] border border-ink/10 bg-white p-5 shadow-card sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-black text-ink/55">Name</span>
              <input className="mt-2 w-full rounded-2xl border border-ink/10 bg-field px-4 py-3 font-bold text-ink outline-none focus:border-moss" value={profile.name} onChange={(event) => update("name", event.target.value)} />
            </label>
            <label className="block">
              <span className="text-sm font-black text-ink/55">Age</span>
              <input inputMode="numeric" className="mt-2 w-full rounded-2xl border border-ink/10 bg-field px-4 py-3 font-bold text-ink outline-none focus:border-moss" value={profile.age} onChange={(event) => update("age", Number(event.target.value) || 0)} />
            </label>
            <label className="block">
              <span className="text-sm font-black text-ink/55">Height cm</span>
              <input inputMode="decimal" className="mt-2 w-full rounded-2xl border border-ink/10 bg-field px-4 py-3 font-bold text-ink outline-none focus:border-moss" value={profile.heightCm} onChange={(event) => update("heightCm", Number(event.target.value) || 0)} />
            </label>
            <label className="block">
              <span className="text-sm font-black text-ink/55">Current weight kg</span>
              <input inputMode="decimal" className="mt-2 w-full rounded-2xl border border-ink/10 bg-field px-4 py-3 font-bold text-ink outline-none focus:border-moss" value={profile.weightKg} onChange={(event) => update("weightKg", Number(event.target.value) || 0)} />
            </label>
            <label className="block">
              <span className="text-sm font-black text-ink/55">Goal weight kg</span>
              <input inputMode="decimal" className="mt-2 w-full rounded-2xl border border-ink/10 bg-field px-4 py-3 font-bold text-ink outline-none focus:border-moss" value={profile.goalWeightKg} onChange={(event) => update("goalWeightKg", Number(event.target.value) || 0)} />
            </label>
            <label className="block">
              <span className="text-sm font-black text-ink/55">Preferred pace kg / week</span>
              <input inputMode="decimal" className="mt-2 w-full rounded-2xl border border-ink/10 bg-field px-4 py-3 font-bold text-ink outline-none focus:border-moss" value={profile.weeklyPaceKg} onChange={(event) => update("weeklyPaceKg", Number(event.target.value) || 0)} />
            </label>
            <label className="block">
              <span className="text-sm font-black text-ink/55">Sex</span>
              <select className="mt-2 w-full rounded-2xl border border-ink/10 bg-field px-4 py-3 font-bold text-ink outline-none focus:border-moss" value={profile.sex} onChange={(event) => update("sex", event.target.value as UserProfile["sex"])}>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non_binary">Non-binary</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-black text-ink/55">Activity level</span>
              <select className="mt-2 w-full rounded-2xl border border-ink/10 bg-field px-4 py-3 font-bold text-ink outline-none focus:border-moss" value={profile.activityLevel} onChange={(event) => update("activityLevel", event.target.value as UserProfile["activityLevel"])}>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very_active">Very active</option>
              </select>
            </label>
          </div>

          <div className="mt-5">
            <p className="text-sm font-black text-ink/55">Goal</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              {[
                ["lose", "Lose weight"],
                ["maintain", "Maintain"],
                ["gain", "Gain weight"]
              ].map(([value, label]) => (
                <button key={value} type="button" onClick={() => update("goal", value as UserProfile["goal"])} className={`rounded-2xl border px-4 py-3 text-sm font-black ${profile.goal === value ? "border-ink bg-lime text-ink" : "border-ink/10 bg-field text-ink"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-black text-ink/55">Dietary preferences</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {preferences.map((pref) => (
                <button key={pref} type="button" onClick={() => togglePreference(pref)} className={`rounded-full border px-4 py-2 text-sm font-bold hover:bg-lime hover:text-ink ${profile.dietaryPreferences.includes(pref) ? "border-ink bg-lime text-ink" : "border-ink/10 bg-white text-ink/65"}`}>
                  {pref}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 rounded-[1.5rem] bg-field p-4">
            <p className="text-sm font-black text-ink/55">Estimated targets</p>
            <div className="mt-3 grid grid-cols-4 gap-2 text-center">
              {[`${estimated.dailyCalories} cal`, `${estimated.protein}g P`, `${estimated.carbs}g C`, `${estimated.fat}g F`].map((item) => (
                <div key={item} className="rounded-2xl bg-white p-3 text-sm font-black text-ink">{item}</div>
              ))}
            </div>
          </div>

          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-4 font-black text-white">
            Create my plan <ArrowRight className="h-5 w-5" />
          </button>
        </form>
      </section>
    </main>
  );
}
