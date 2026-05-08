import Link from "next/link";
import { BarChart3, BookOpen, Home, PlusCircle, UserRound } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/diary", label: "Diary", icon: BookOpen },
  { href: "/add-food", label: "Add", icon: PlusCircle },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: UserRound }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-[calc(6rem+var(--safe-bottom))] pt-[var(--safe-top)] lg:pb-0">
      <aside className="fixed left-0 top-0 hidden h-screen w-24 border-r border-ink/10 bg-white/70 backdrop-blur-xl lg:block">
        <Link href="/" className="mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-lg font-black text-lime">
          N
        </Link>
        <nav className="mt-10 flex flex-col items-center gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex h-14 w-14 items-center justify-center rounded-2xl text-ink/55 transition hover:bg-ink hover:text-white"
              aria-label={item.label}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          ))}
        </nav>
      </aside>

      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:pl-32 lg:pr-8">{children}</main>

      <nav className="fixed inset-x-3 bottom-[calc(0.75rem+var(--safe-bottom))] z-20 flex items-center justify-between rounded-[2rem] border border-ink/10 bg-white/90 p-2 shadow-soft backdrop-blur-xl lg:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-3xl px-2 py-2 text-[0.7rem] font-semibold text-ink/55 transition hover:bg-field hover:text-ink"
          >
            <item.icon className="h-5 w-5" />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
