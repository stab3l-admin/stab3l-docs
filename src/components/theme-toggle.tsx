"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * ThemeToggle component for switching between light and dark modes
 * Uses next-themes for theme management
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="border px-2 py-1 text-xs font-mono bg-white text-black border-black dark:bg-black dark:text-white dark:border-white"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "LIGHT" : "DARK"}
    </button>
  );
} 