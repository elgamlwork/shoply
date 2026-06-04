"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { CategoryRail } from "./category-rail";
import { ProductGrid } from "./product-grid";
import { SortMenu, type SortValue } from "./sort-menu";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { getCategories, getProducts, PAGE_SIZE } from "@/lib/api/products";
import { queryKeys } from "@/lib/query/keys";
import type { SortField, SortOrder } from "@/types/product";

function parseSort(searchParams: URLSearchParams): SortValue {
  const sortBy = (searchParams.get("sortBy") ?? "default") as SortField;
  const order = (searchParams.get("order") ?? "asc") as SortOrder;
  return { sortBy, order };
}

export function ProductBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";
  const sort = useMemo(() => parseSort(new URLSearchParams(searchParams.toString())), [searchParams]);

  const updateParam = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v === null || v === "" || v === "all") next.delete(k);
        else next.set(k, v);
      }
      router.replace(`/?${next.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const categoriesQuery = useQuery({
    queryKey: queryKeys.categories(),
    queryFn: ({ signal }) => getCategories(signal),
    staleTime: 10 * 60 * 1000,
  });

  const productsQuery = useInfiniteQuery({
    queryKey: queryKeys.products({ q, category, sortBy: sort.sortBy, order: sort.order }),
    queryFn: ({ pageParam = 0, signal }) =>
      getProducts(
        { q, category, sortBy: sort.sortBy, order: sort.order, limit: PAGE_SIZE, skip: pageParam },
        signal,
      ),
    initialPageParam: 0,
    getNextPageParam: (last) => {
      const next = last.skip + last.products.length;
      return next < last.total ? next : undefined;
    },
  });

  const products = useMemo(
    () => productsQuery.data?.pages.flatMap((p) => p.products) ?? [],
    [productsQuery.data],
  );
  const total = productsQuery.data?.pages[0]?.total ?? 0;

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            productsQuery.hasNextPage &&
            !productsQuery.isFetchingNextPage
          ) {
            void productsQuery.fetchNextPage();
          }
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [productsQuery]);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 md:py-16">
      <div className="flex flex-col gap-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-[var(--color-ink)] md:text-4xl">
              {q ? `Results for “${q}”` : category === "all" ? "All products" : capitalize(category)}
            </h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {productsQuery.isLoading
                ? "Loading the edit…"
                : total > 0
                  ? `${total} ${total === 1 ? "item" : "items"}`
                  : "No items found"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <SortMenu
              value={sort}
              onChange={(v) =>
                updateParam({
                  sortBy: v.sortBy === "default" ? null : v.sortBy,
                  order: v.sortBy === "default" ? null : v.order,
                })
              }
            />
          </div>
        </header>

        <CategoryRail
          categories={categoriesQuery.data ?? []}
          active={category}
          onSelect={(slug) => updateParam({ category: slug })}
          loading={categoriesQuery.isLoading}
        />

        {q ? (
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            <span>Search:</span>
            <button
              type="button"
              onClick={() => updateParam({ q: null })}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--color-line)] px-2.5 py-1 normal-case tracking-normal text-[var(--color-ink)] hover:border-[var(--color-ink)]"
            >
              {q}
              <X className="size-3" aria-hidden />
            </button>
          </div>
        ) : null}

        <div className="mt-2">
          {productsQuery.isLoading ? (
            <ProductGridSkeleton />
          ) : productsQuery.isError ? (
            <ErrorState onRetry={() => productsQuery.refetch()} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products match."
              description="Try clearing filters, switching categories, or searching for something different."
              action={
                <Button variant="outline" size="sm" onClick={() => router.replace("/")}>
                  Reset filters
                </Button>
              }
            />
          ) : (
            <>
              <ProductGrid products={products} />
              <div ref={sentinelRef} aria-hidden className="h-1" />
              {productsQuery.hasNextPage ? (
                <div className="mt-12 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => productsQuery.fetchNextPage()}
                    disabled={productsQuery.isFetchingNextPage}
                  >
                    {productsQuery.isFetchingNextPage ? "Loading…" : "Load more"}
                  </Button>
                </div>
              ) : products.length > 0 ? (
                <p className="mt-12 text-center text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">
                  — End of edit —
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function capitalize(slug: string) {
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}
