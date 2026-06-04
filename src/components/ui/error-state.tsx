"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "./button";

export function ErrorState({
  title = "Something went sideways",
  description = "We couldn't load this view. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 border border-[var(--color-line)] bg-[var(--color-surface)] py-16 px-6 text-center">
      <AlertCircle className="size-7 text-[var(--color-danger)]" aria-hidden />
      <div className="space-y-1">
        <p className="font-display text-xl text-[var(--color-ink)]">{title}</p>
        <p className="text-sm text-[var(--color-muted)]">{description}</p>
      </div>
      {onRetry ? (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
