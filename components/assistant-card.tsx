import { Send, Sparkles } from "lucide-react";

const suggestions = ["Why am I stalled?", "High-protein dinner ideas", "Review today", "Snack pattern"];

export function AssistantCard() {
  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">Assistant</p>
          <h2 className="mt-1 text-xl font-black text-ink">Nutrition coach preview</h2>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-lime text-ink">
          <Sparkles className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-sm font-semibold leading-6 text-ink/55">
        Future backend route is ready to review logs, explain progress patterns, and suggest better meal choices.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((item) => (
          <button key={item} className="rounded-full bg-field px-3 py-2 text-xs font-black text-ink/60 hover:bg-lime hover:text-ink">
            {item}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-ink/10 bg-field p-2">
        <input className="min-w-0 flex-1 bg-transparent px-2 text-sm font-bold outline-none" placeholder="Ask about today..." />
        <button className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-white" aria-label="Send assistant message">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
