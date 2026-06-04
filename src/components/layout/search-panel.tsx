"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { getProducts } from "@/lib/api/products";
import { useDebouncedValue } from "@/lib/utils/debounce";
import {
  discountedPrice,
  formatCategory,
  formatPrice,
} from "@/lib/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

const LIVE_LIMIT = 6;

export function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const debounced = useDebouncedValue(value, 180);
  const trimmed = debounced.trim();
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const liveQuery = useQuery({
    queryKey: ["search-live", trimmed],
    queryFn: ({ signal }) =>
      getProducts({ q: trimmed, limit: LIVE_LIMIT, skip: 0 }, signal),
    enabled: trimmed.length > 0,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });

  const results = liveQuery.data?.products ?? [];

  useEffect(() => {
    // Reset the highlighted item whenever the typed query changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveIndex(results.length > 0 ? 0 : -1);
  }, [trimmed, results.length]);

  function navigateTo(href: string) {
    onClose();
    router.push(href);
  }

  function handleEnter() {
    if (activeIndex >= 0 && results[activeIndex]) {
      navigateTo(`/products/${results[activeIndex].id}`);
      return;
    }
    if (trimmed) navigateTo(`/?q=${encodeURIComponent(trimmed)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleEnter();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="mx-auto mt-20 max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
      >
        <div className="flex items-center gap-3 border-b border-[var(--color-line)] px-5 py-4">
          <Search
            className="size-5 text-[var(--color-muted)]"
            aria-hidden
          />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products by title…"
            className="flex-1 bg-transparent text-base text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none"
            aria-label="Search products"
            aria-autocomplete="list"
            aria-controls="search-results"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="inline-flex size-7 items-center justify-center rounded-full text-[var(--color-muted)] transition hover:bg-[var(--color-bg)] hover:text-[var(--color-ink)]"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div
          id="search-results"
          role="listbox"
          className="max-h-[60vh] overflow-y-auto"
        >
          {trimmed.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-[var(--color-muted)]">
              Start typing to search the catalog.
            </p>
          ) : liveQuery.isLoading ? (
            <SearchSkeleton />
          ) : liveQuery.isError ? (
            <p className="px-5 py-10 text-center text-sm text-[var(--color-danger)]">
              Couldn&apos;t fetch results. Try again.
            </p>
          ) : results.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-[var(--color-muted)]">
              No products match &ldquo;{trimmed}&rdquo;.
            </p>
          ) : (
            <ul className="py-1">
              {results.map((p, idx) => {
                const finalPrice =
                  p.discountPercentage > 0
                    ? discountedPrice(p.price, p.discountPercentage)
                    : p.price;
                return (
                  <li key={p.id}>
                    <Link
                      href={`/products/${p.id}`}
                      onClick={onClose}
                      role="option"
                      aria-selected={idx === activeIndex}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 transition",
                        idx === activeIndex
                          ? "bg-[var(--color-bg)]"
                          : "hover:bg-[var(--color-bg)]",
                      )}
                    >
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-[var(--color-bg)]">
                        <Image
                          src={p.thumbnail}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[var(--color-ink)]">
                          {p.title}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                          {formatCategory(p.category)}
                        </p>
                      </div>
                      <p className="text-sm text-[var(--color-ink)]">
                        {formatPrice(finalPrice)}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {trimmed && results.length > 0 ? (
          <button
            type="button"
            onClick={() => navigateTo(`/?q=${encodeURIComponent(trimmed)}`)}
            className="block w-full border-t border-[var(--color-line)] px-5 py-3 text-left text-xs uppercase tracking-[0.18em] text-[var(--color-ink)] transition hover:bg-[var(--color-bg)]"
          >
            View all results for &ldquo;{trimmed}&rdquo; →
          </button>
        ) : null}

        <div className="hidden border-t border-[var(--color-line)] px-5 py-2 text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] sm:flex sm:items-center sm:gap-4">
          <Kbd>↑ ↓</Kbd> navigate
          <Kbd>↵</Kbd> open
          <Kbd>esc</Kbd> close
        </div>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-[var(--color-line)] bg-[var(--color-bg)] px-1.5 py-0.5 font-mono text-[10px] normal-case tracking-normal text-[var(--color-ink)]">
      {children}
    </kbd>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-1 p-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg p-2">
          <Skeleton className="size-14 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}
