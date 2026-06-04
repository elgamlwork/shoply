"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, Star } from "lucide-react";
import { getProduct } from "@/lib/api/products";
import { queryKeys } from "@/lib/query/keys";
import { useAuthStore } from "@/lib/auth/store";
import { useFavoritesStore } from "@/lib/favorites/store";
import { discountedPrice, formatCategory, formatPrice, formatRating } from "@/lib/utils/format";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

export function ProductDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: product, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.product(id),
    queryFn: ({ signal }) => getProduct(id, signal),
  });
  const user = useAuthStore((s) => s.user);
  const isFavorite = useFavoritesStore((s) => s.ids.includes(Number(id)));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const [activeImage, setActiveImage] = useState(0);

  function handleFavorite() {
    if (!user) {
      router.push(`/login?from=${encodeURIComponent(`/products/${id}`)}&reason=favorite`);
      return;
    }
    toggleFavorite(Number(id));
  }

  if (isLoading) return <DetailSkeleton />;
  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  const hasDiscount = product.discountPercentage > 0;
  const finalPrice = hasDiscount
    ? discountedPrice(product.price, product.discountPercentage)
    : product.price;

  const images = product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <article className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Back to the edit
      </Link>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="sticky top-24 space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-[var(--color-surface)] editorial-shadow">
              <Image
                src={images[activeImage] ?? product.thumbnail}
                alt={product.title}
                fill
                priority
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-contain"
              />
              {hasDiscount ? (
                <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-[var(--color-ink)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-bg)]">
                  −{Math.round(product.discountPercentage)}% off
                </span>
              ) : null}
            </div>
            {images.length > 1 ? (
              <div className="flex gap-3 overflow-x-auto scroll-hidden">
                {images.map((src, idx) => (
                  <button
                    key={src}
                    type="button"
                    aria-label={`Show image ${idx + 1}`}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border transition",
                      idx === activeImage
                        ? "border-[var(--color-ink)]"
                        : "border-[var(--color-line)] opacity-70 hover:opacity-100",
                    )}
                  >
                    <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="space-y-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.24em] text-[var(--color-muted)]">
                {formatCategory(product.category)}
                {product.brand ? ` · ${product.brand}` : ""}
              </span>
              <h1 className="mt-2 font-display text-4xl leading-tight tracking-tight text-[var(--color-ink)] md:text-5xl">
                {product.title}
              </h1>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-medium text-[var(--color-ink)]">
                {formatPrice(finalPrice)}
              </span>
              {hasDiscount ? (
                <span className="text-base text-[var(--color-muted)] line-through">
                  {formatPrice(product.price)}
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-4 text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-3.5 fill-current text-[var(--color-ink)]" aria-hidden />
                <span className="text-[var(--color-ink)]">{formatRating(product.rating)}</span>
                rating
              </span>
              <span className="hairline h-3 border-l" aria-hidden />
              <span>
                <span className="text-[var(--color-ink)]">{product.stock}</span> in stock
              </span>
              {product.availabilityStatus ? (
                <>
                  <span className="hairline h-3 border-l" aria-hidden />
                  <span>{product.availabilityStatus}</span>
                </>
              ) : null}
            </div>

            <p className="text-[15px] leading-relaxed text-[var(--color-ink)]">
              {product.description}
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleFavorite}
                className={cn(
                  "inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border px-6 text-xs uppercase tracking-[0.18em] transition",
                  isFavorite
                    ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg)]"
                    : "border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)]",
                )}
              >
                <Heart className={cn("size-4", isFavorite && "fill-current")} aria-hidden />
                {!user ? "Sign in to save" : isFavorite ? "Saved" : "Save to favorites"}
              </button>
            </div>

            {product.tags?.length ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--color-line)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[var(--color-line)] pt-6 text-sm">
              {product.warrantyInformation ? (
                <Row label="Warranty" value={product.warrantyInformation} />
              ) : null}
              {product.shippingInformation ? (
                <Row label="Shipping" value={product.shippingInformation} />
              ) : null}
              {product.returnPolicy ? (
                <Row label="Returns" value={product.returnPolicy} />
              ) : null}
              <Row label="Category" value={formatCategory(product.category)} />
            </dl>
          </div>
        </div>
      </div>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">{label}</dt>
      <dd className="text-sm text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      <Skeleton className="mb-8 h-3 w-32" />
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <Skeleton className="aspect-square w-full rounded-xl" />
        </div>
        <div className="md:col-span-5 space-y-6">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-48" />
        </div>
      </div>
    </div>
  );
}
