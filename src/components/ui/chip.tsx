"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function Chip({ active, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-full border px-4 text-xs uppercase tracking-[0.14em] transition",
        active
          ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg)]"
          : "border-[var(--color-line)] bg-transparent text-[var(--color-ink)] hover:border-[var(--color-ink)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
