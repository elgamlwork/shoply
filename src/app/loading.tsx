import { ProductGridSkeleton } from "@/components/ui/skeleton";

export default function GlobalLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12 space-y-3">
        <div className="h-3 w-32 animate-pulse rounded bg-[var(--color-line)]" />
        <div className="h-12 w-2/3 animate-pulse rounded bg-[var(--color-line)]" />
      </div>
      <ProductGridSkeleton />
    </div>
  );
}
