import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-[var(--color-line)] py-20 px-6 text-center">
      <p className="font-display text-2xl text-[var(--color-ink)]">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-[var(--color-muted)]">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
