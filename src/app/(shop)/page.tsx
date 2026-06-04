import { Suspense } from "react";
import { HeroBand } from "@/components/layout/hero-band";
import { ProductBrowser } from "@/components/product/product-browser";
import { ProductGridSkeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  return (
    <>
      <HeroBand />
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-6 py-12">
            <ProductGridSkeleton />
          </div>
        }
      >
        <ProductBrowser />
      </Suspense>
    </>
  );
}
