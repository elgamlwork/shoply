"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/types/product";
import { useFavoritesStore } from "@/lib/favorites/store";
import { discountedPrice, formatCategory, formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const isFavorite = useFavoritesStore((s) => s.ids.includes(product.id));
  const toggle = useFavoritesStore((s) => s.toggle);
  const hasDiscount = product.discountPercentage > 0;
  const finalPrice = hasDiscount
    ? discountedPrice(product.price, product.discountPercentage)
    : product.price;

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-xl bg-[var(--color-surface)] editorial-shadow">
        <Link
          href={`/products/${product.id}`}
          className="block aspect-[4/5] w-full"
          aria-label={product.title}
        >
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </Link>
        <button
          type="button"
          aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
          onClick={() => toggle(product.id)}
          className={cn(
            "absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full border bg-[var(--color-surface)]/85 backdrop-blur transition",
            isFavorite
              ? "border-[var(--color-ink)] text-[var(--color-ink)]"
              : "border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]",
          )}
        >
          <Heart
            className={cn("size-4", isFavorite && "fill-current")}
            aria-hidden
          />
        </button>
        {hasDiscount ? (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-[var(--color-ink)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-bg)]">
            −{Math.round(product.discountPercentage)}%
          </span>
        ) : null}
      </div>

      <Link href={`/products/${product.id}`} className="mt-4 flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
          {formatCategory(product.category)}
        </span>
        <h3 className="font-display text-lg leading-tight text-[var(--color-ink)] line-clamp-2">
          {product.title}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-medium text-[var(--color-ink)]">
            {formatPrice(finalPrice)}
          </span>
          {hasDiscount ? (
            <span className="text-xs text-[var(--color-muted)] line-through">
              {formatPrice(product.price)}
            </span>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
