"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { SortField, SortOrder } from "@/types/product";

export type SortValue = {
  sortBy: SortField;
  order: SortOrder;
};

const OPTIONS: { value: SortValue; label: string }[] = [
  { value: { sortBy: "default", order: "asc" }, label: "Featured" },
  { value: { sortBy: "price", order: "asc" }, label: "Price · Low to high" },
  { value: { sortBy: "price", order: "desc" }, label: "Price · High to low" },
  { value: { sortBy: "title", order: "asc" }, label: "Title · A → Z" },
  { value: { sortBy: "rating", order: "desc" }, label: "Top rated" },
];

function valueKey(v: SortValue) {
  return `${v.sortBy}:${v.order}`;
}

export function SortMenu({
  value,
  onChange,
}: {
  value: SortValue;
  onChange: (value: SortValue) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const current = OPTIONS.find((o) => valueKey(o.value) === valueKey(value)) ?? OPTIONS[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--color-line)] px-4 text-xs uppercase tracking-[0.16em] text-[var(--color-ink)] transition hover:border-[var(--color-ink)]"
      >
        Sort
        <span className="text-[var(--color-muted)] normal-case tracking-normal">
          {current.label}
        </span>
        <ChevronDown className="size-3.5" aria-hidden />
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute right-0 z-30 mt-2 w-64 overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] py-1 shadow-lg"
        >
          {OPTIONS.map((opt) => {
            const active = valueKey(opt.value) === valueKey(value);
            return (
              <li key={valueKey(opt.value)}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition",
                    active
                      ? "bg-[var(--color-bg)] text-[var(--color-ink)]"
                      : "text-[var(--color-ink)] hover:bg-[var(--color-bg)]",
                  )}
                >
                  {opt.label}
                  {active ? <Check className="size-3.5" aria-hidden /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
