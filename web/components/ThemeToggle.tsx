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
      applyTheme(stored);
      setTheme(stored);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Theme = prefersDark ? "dark" : "light";
    applyTheme(initial);
    setTheme(initial);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
    window.localStorage.setItem("theme", next);
  };

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-full border border-white/30 bg-black/40 p-2 hover:bg-white hover:text-black transition-colors"
    >
      {theme === "dark" ? (
        <SunIcon className="h-4 w-4 text-yellow-300" />
      ) : (
        <MoonIcon className="h-4 w-4 text-gray-700" />
      )}
    </button>
  );
}

function applyTheme(theme: Theme) {
    const root = document.documentElement;
  
    if (theme === "dark") {
      // dark theme
      root.style.setProperty("--background", "#050509");
      root.style.setProperty("--foreground", "#f5f5f5");
    } else {
      // LIGHT THEME: make it a darker, warmer off-white
      root.style.setProperty("--background", "#e5e7eb"); // Tailwind gray-200
      root.style.setProperty("--foreground", "#020617"); // almost-black (slate-950)
    }
  }
  
