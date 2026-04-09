"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setMounted(true);

    const stored = window.localStorage.getItem("theme") as Theme | null;

    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      applyTheme(stored);
      return;
    }

    const initial: Theme = "light";
    setTheme(initial);
    applyTheme(initial);
    window.localStorage.setItem("theme", initial);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    window.localStorage.setItem("theme", next);
  };

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-full border border-white/30 dark:border-white/30 bg-[#3e3d3c] dark:bg-[#181615]/85 text-zinc-800 dark:text-[#f3efe8] p-2 hover:bg-black/85 hover:text-zinc-900 dark:hover:bg-white/85 dark:hover:text-white transition-colors"
    >
      {theme === "dark" ? (
        <MoonIcon className="h-4 w-4 text-zinc-700 dark:text-white" />
      ) : (
        <SunIcon className="h-4 w-4 text-[#b7791f]" />
      )}
    </button>
  );
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
    root.style.setProperty("--background", "#000000");
    root.style.setProperty("--foreground", "#f5f5f5");
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
    root.style.setProperty("--background", "#3e3d3c");
    root.style.setProperty("--foreground", "#f5f5f5");
  }
}