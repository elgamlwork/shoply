"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useThemeStore, type ThemeMode } from "@/lib/theme/store";
import { cn } from "@/lib/utils/cn";

const NEXT: Record<ThemeMode, ThemeMode> = {
  light: "dark",
  dark: "system",
  system: "light",
};

const LABEL: Record<ThemeMode, string> = {
  light: "Light mode",
  dark: "Dark mode",
  system: "System theme",
};

function subscribe(cb: () => void) {
  return useThemeStore.persist.onFinishHydration(cb);
}

function snapshot() {
  return useThemeStore.persist.hasHydrated();
}

function serverSnapshot() {
  return false;
}

export function ThemeToggle({ className }: { className?: string }) {
  const hydrated = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  const current: ThemeMode = hydrated ? mode : "system";
  const Icon = current === "dark" ? Moon : current === "light" ? Sun : Monitor;

  return (
    <button
      type="button"
      aria-label={`Theme: ${LABEL[current]}. Tap to switch.`}
      title={LABEL[current]}
      onClick={() => setMode(NEXT[current])}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-ink)] transition hover:border-[var(--color-ink)]",
        className,
      )}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}
