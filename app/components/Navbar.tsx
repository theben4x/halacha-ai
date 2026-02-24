"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

type Props = { onResetView?: () => void };

export default function Navbar({ onResetView }: Props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white/98 px-4 py-3 backdrop-blur dark:border-gray-800 dark:bg-[var(--background)]/98 sm:px-6">
      <h1 className="m-0">
        <button
          type="button"
          onClick={onResetView}
          className="cursor-pointer flex items-baseline gap-2 text-lg font-semibold tracking-wide text-gray-900 no-underline opacity-100 transition-opacity hover:opacity-80 dark:text-white"
          aria-label="Return home and start fresh search"
        >
          <span>הֲלָכָה</span>
          <span
            className="text-[var(--halacha-gold)] underline"
            style={{ fontFamily: "var(--font-roboto), Roboto, sans-serif" }}
          >
            AI
          </span>
          <span>HALACHA</span>
        </button>
      </h1>
      <button
        type="button"
        onClick={toggleTheme}
        className="flex h-10 w-10 items-center justify-center rounded-full text-gray-900 transition-colors hover:bg-gray-100 dark:text-white dark:hover:bg-[var(--halacha-gold)]/20"
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5" aria-hidden />
        ) : (
          <Sun className="h-5 w-5" aria-hidden />
        )}
      </button>
    </header>
  );
}
