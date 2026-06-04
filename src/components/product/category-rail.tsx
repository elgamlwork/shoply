"use client";

import { Chip } from "@/components/ui/chip";
import type { Category } from "@/types/product";

export function CategoryRail({
  categories,
  active,
  onSelect,
  loading,
}: {
  categories: Category[];
  active: string;
  onSelect: (slug: string) => void;
  loading?: boolean;
}) {
  return (
    <div
      role="tablist"
      aria-label="Categories"
      className="scroll-hidden -mx-6 flex gap-2 overflow-x-auto px-6 py-2"
    >
      <Chip active={active === "all"} onClick={() => onSelect("all")}>
        All
      </Chip>
      {loading
        ? Array.from({ length: 6 }).map((_, idx) => (
            <span
              key={idx}
              className="inline-flex h-9 w-28 shrink-0 animate-pulse rounded-full bg-[var(--color-line)]/60"
              aria-hidden
            />
          ))
        : categories.map((cat) => (
            <Chip
              key={cat.slug}
              active={active === cat.slug}
              onClick={() => onSelect(cat.slug)}
            >
              {cat.name}
            </Chip>
          ))}
    </div>
  );
}
