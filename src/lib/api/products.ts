import { api } from "./client";
import type {
  Category,
  Product,
  ProductPage,
  ProductQuery,
  RawCategory,
  SortField,
} from "@/types/product";
import { formatCategory } from "@/lib/utils/format";

export const PAGE_SIZE = 12;

function basePath(q?: string, category?: string): string {
  if (q && q.trim().length > 0) return "/products/search";
  if (category && category !== "all") {
    return `/products/category/${encodeURIComponent(category)}`;
  }
  return "/products";
}

export async function getProducts(
  query: ProductQuery = {},
  signal?: AbortSignal,
): Promise<ProductPage> {
  const {
    q,
    category,
    sortBy,
    order = "asc",
    limit = PAGE_SIZE,
    skip = 0,
  } = query;

  const path = basePath(q, category);
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("skip", String(skip));
  if (q && q.trim().length > 0) params.set("q", q.trim());

  const isFlatProducts = path === "/products";
  if (isFlatProducts && sortBy && sortBy !== "default") {
    params.set("sortBy", sortBy);
    params.set("order", order);
  }

  const result = await api<ProductPage>(`${path}?${params.toString()}`, { signal });

  if (!isFlatProducts && sortBy && sortBy !== "default") {
    result.products = sortClientSide(result.products, sortBy, order);
  }

  return result;
}

function sortClientSide(items: Product[], field: SortField, order: "asc" | "desc"): Product[] {
  const dir = order === "desc" ? -1 : 1;
  return [...items].sort((a, b) => {
    const av = a[field as keyof Product];
    const bv = b[field as keyof Product];
    if (typeof av === "string" && typeof bv === "string") {
      return av.localeCompare(bv) * dir;
    }
    return ((Number(av) || 0) - (Number(bv) || 0)) * dir;
  });
}

export function getProduct(id: number | string, signal?: AbortSignal): Promise<Product> {
  return api<Product>(`/products/${encodeURIComponent(String(id))}`, { signal });
}

export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
  const raw = await api<RawCategory[]>("/products/categories", { signal });
  return raw.map((entry) => {
    if (typeof entry === "string") {
      return { slug: entry, name: formatCategory(entry) };
    }
    return { slug: entry.slug, name: entry.name ?? formatCategory(entry.slug) };
  });
}
