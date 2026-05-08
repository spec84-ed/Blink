import Link from "next/link";
import { ArrowRight, Check, Dumbbell } from "lucide-react";

const steps = ["Profile", "Body", "Goals", "Preferences"];
const preferences = ["High protein", "Vegetarian", "Gluten-free", "Low sodium", "Dairy-free"];

export default function OnboardingPage() {
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

        <form className="rounded-[2rem] border border-ink/10 bg-white p-5 shadow-card sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Name", "Maya"],
              ["Age", "32"],
              ["Height", "5 ft 8 in"],
              ["Current weight", "178.6 lb"],
              ["Goal weight", "172 lb"],
              ["Preferred pace", "0.5 lb / week"]
            ].map(([label, value]) => (
              <label key={label} className="block">
                <span className="text-sm font-black text-ink/55">{label}</span>
                <input className="mt-2 w-full rounded-2xl border border-ink/10 bg-field px-4 py-3 font-bold text-ink outline-none focus:border-moss" defaultValue={value} />
              </label>
            ))}
            <label className="block">
              <span className="text-sm font-black text-ink/55">Sex</span>
              <select className="mt-2 w-full rounded-2xl border border-ink/10 bg-field px-4 py-3 font-bold text-ink outline-none focus:border-moss" defaultValue="female">
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non_binary">Non-binary</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-black text-ink/55">Activity level</span>
              <select className="mt-2 w-full rounded-2xl border border-ink/10 bg-field px-4 py-3 font-bold text-ink outline-none focus:border-moss" defaultValue="moderate">
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
              {["Lose weight", "Maintain", "Gain weight"].map((goal) => (
                <button key={goal} type="button" className="rounded-2xl border border-ink/10 bg-field px-4 py-3 text-sm font-black text-ink hover:border-moss">
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-black text-ink/55">Dietary preferences</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {preferences.map((pref) => (
                <button key={pref} type="button" className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-bold text-ink/65 hover:bg-lime hover:text-ink">
                  {pref}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 rounded-[1.5rem] bg-field p-4">
            <p className="text-sm font-black text-ink/55">Estimated targets</p>
            <div className="mt-3 grid grid-cols-4 gap-2 text-center">
              {["2240 cal", "150g P", "245g C", "72g F"].map((item) => (
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
