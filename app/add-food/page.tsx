import { Camera, ChefHat, Clock3, Copy, PackagePlus, Search, ScanLine } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { FoodSearchCard } from "@/components/food-search-card";
import { PageHeader } from "@/components/page-header";
import { recentFoods } from "@/lib/mock-data";

const quickActions = [
  { label: "Barcode", detail: "Open Food Facts first", icon: ScanLine },
  { label: "Custom food", detail: "Create nutrition facts", icon: PackagePlus },
  { label: "Saved meal", detail: "Log a full recipe", icon: ChefHat },
  { label: "Copy day", detail: "Reuse yesterday", icon: Copy }
];

export default function AddFoodPage() {
  return (
    <AppShell>
      <PageHeader eyebrow="Fast log" title="Add food" />
      <section className="rounded-[2rem] bg-ink p-5 text-white shadow-soft">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-ink">
          <Search className="h-5 w-5 text-ink/45" />
          <input className="w-full bg-transparent font-bold outline-none" placeholder="Search chicken breast, Big Mac, cereal..." />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <button key={action.label} className="rounded-[1.5rem] bg-white/10 p-4 text-left transition hover:bg-white/15">
              <action.icon className="h-6 w-6 text-lime" />
              <p className="mt-4 font-black">{action.label}</p>
              <p className="mt-1 text-sm font-semibold text-white/55">{action.detail}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          <div className="rounded-[2rem] border border-ink/10 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-ink">Barcode scanner</h2>
                <p className="text-sm font-semibold text-ink/45">Camera integration placeholder</p>
              </div>
              <Camera className="h-6 w-6 text-moss" />
            </div>
            <div className="mt-5 grid aspect-[4/3] place-items-center rounded-[1.5rem] border border-dashed border-ink/20 bg-field">
              <div className="text-center">
                <ScanLine className="mx-auto h-10 w-10 text-ink/35" />
                <p className="mt-3 text-sm font-black text-ink">Ready for scanner SDK</p>
                <p className="mt-1 text-xs font-semibold text-ink/45">Lookup route: /api/barcode/[barcode]</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-ink/10 bg-white p-5 shadow-card">
            <h2 className="text-xl font-black text-ink">Custom food</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["Food name", "Brand", "Serving size", "Calories", "Protein", "Carbs", "Fat", "Sodium"].map((label) => (
                <input key={label} className="rounded-2xl border border-ink/10 bg-field px-4 py-3 text-sm font-bold outline-none focus:border-moss" placeholder={label} />
              ))}
            </div>
            <button className="mt-4 w-full rounded-2xl bg-ink px-4 py-3 text-sm font-black text-white">Save custom food</button>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-moss" />
            <h2 className="text-xl font-black text-ink">Recent foods</h2>
          </div>
          <div className="space-y-3">
            {recentFoods.map((food) => (
              <FoodSearchCard key={food.name} {...food} />
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
