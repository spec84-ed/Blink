"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const themeKey = "nutrivue-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(themeKey) === "dark" ? "dark" : "light";
    setTheme(stored);
    document.documentElement.dataset.theme = stored;
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem(themeKey, nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ink/10 bg-white text-ink/70"
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
