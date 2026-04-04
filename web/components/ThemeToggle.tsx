"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setMounted(true);

    const stored = window.localStorage.getItem("theme") as Theme | null;

    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      applyTheme(stored);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Theme = prefersDark ? "dark" : "light";
    setTheme(initial);
    applyTheme(initial);
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
      className="inline-flex items-center justify-center rounded-full border border-black/15 dark:border-white/30 bg-[#ebe7df]/80 dark:bg-black/40 text-zinc-800 dark:text-white p-2 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
    >
      {theme === "dark" ? (
        <MoonIcon className="h-4 w-4 text-zinc-700" />
      ) : (
        <SunIcon className="h-4 w-4 text-yellow-300" />
      )}
    </button>
  );
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
    root.style.setProperty("--background", "#050509");
    root.style.setProperty("--foreground", "#3e3d3cff");
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
    root.style.setProperty("--background", "#3e3d3cff");
    root.style.setProperty("--foreground", "#020617");
  }
}