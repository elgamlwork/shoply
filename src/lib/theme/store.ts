"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "system" | "light" | "dark";

type ThemeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "system",
      setMode: (mode) => {
        set({ mode });
        applyTheme(mode);
      },
      toggle: () => {
        const current = get().mode;
        const next: ThemeMode =
          current === "dark" ? "light" : current === "light" ? "system" : "dark";
        set({ mode: next });
        applyTheme(next);
      },
    }),
    {
      name: "shoply:theme",
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.mode);
      },
    },
  ),
);

export function applyTheme(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldBeDark = mode === "dark" || (mode === "system" && prefersDark);
  root.classList.toggle("dark", shouldBeDark);
}
