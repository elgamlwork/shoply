"use client";

import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import { useFavoritesStore } from "@/lib/favorites/store";
import { getProduct } from "@/lib/api/products";
import { queryKeys } from "@/lib/query/keys";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
  const ids = useFavoritesStore((s) => s.ids);
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: queryKeys.product(id),
      queryFn: ({ signal }: { signal?: AbortSignal }) => getProduct(id, signal),
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const products = results.flatMap((r) => (r.data ? [r.data] : []));

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 md:py-16">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-muted)]">
            Saved items
          </p>
          <h1 className="mt-1 font-display text-4xl text-[var(--color-ink)] md:text-5xl">
            Your favorites
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {ids.length === 0 ? "Nothing here yet." : `${ids.length} saved`}
          </p>
        </div>
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
        >
          Back to the edit ↗
        </Link>
      </header>

      {ids.length === 0 ? (
        <EmptyState
          title="No favorites yet."
          description="Tap the heart on any product to save it for later. Favorites are stored on this device."
          action={
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--color-ink)] px-6 text-xs uppercase tracking-[0.16em] text-[var(--color-ink)] transition hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)]"
            >
              Browse products
            </Link>
          }
        />
      ) : isLoading && products.length === 0 ? (
        <ProductGridSkeleton count={Math.min(ids.length, 8)} />
      ) : (
        <>
          <ProductGrid products={products} />
          {products.length > 0 ? (
            <div className="mt-12 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => useFavoritesStore.getState().clear()}
              >
                Clear all
              </Button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
