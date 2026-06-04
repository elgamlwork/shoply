import { cn } from "@/lib/utils/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--color-line)]/60",
        className,
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="aspect-[4/5] w-full rounded-xl" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}
