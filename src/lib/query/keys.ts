import type { ProductQuery } from "@/types/product";

export const queryKeys = {
  products: (params: Omit<ProductQuery, "skip" | "limit">) =>
    [
      "products",
      {
        q: params.q ?? "",
        category: params.category ?? "all",
        sortBy: params.sortBy ?? "default",
        order: params.order ?? "asc",
      },
    ] as const,
  product: (id: string | number) => ["product", String(id)] as const,
  categories: () => ["categories"] as const,
  me: () => ["me"] as const,
};
