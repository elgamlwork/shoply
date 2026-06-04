import { describe, it, expect, vi, beforeEach } from "vitest";
import { getProducts, getCategories } from "./products";

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

describe("getProducts URL building", () => {
  it("uses /products with sort + order for no search/category", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ products: [], total: 0, skip: 0, limit: 12 }),
    );
    await getProducts({ sortBy: "price", order: "desc", limit: 12, skip: 24 });
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/products?");
    expect(url).toContain("limit=12");
    expect(url).toContain("skip=24");
    expect(url).toContain("sortBy=price");
    expect(url).toContain("order=desc");
  });

  it("uses /products/search when q is set", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ products: [], total: 0, skip: 0, limit: 12 }),
    );
    await getProducts({ q: "phone" });
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/products/search?");
    expect(url).toContain("q=phone");
    expect(url).not.toContain("sortBy=");
  });

  it("uses /products/category/{slug} when category is set", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ products: [], total: 0, skip: 0, limit: 12 }),
    );
    await getProducts({ category: "beauty" });
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("/products/category/beauty?");
  });

  it("client-sorts category results when sortBy is provided", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        products: [
          { id: 1, title: "B", price: 30 },
          { id: 2, title: "A", price: 10 },
          { id: 3, title: "C", price: 20 },
        ],
        total: 3,
        skip: 0,
        limit: 12,
      }),
    );
    const result = await getProducts({
      category: "beauty",
      sortBy: "price",
      order: "asc",
    });
    expect(result.products.map((p) => p.id)).toEqual([2, 3, 1]);
  });
});

describe("getCategories", () => {
  it("normalizes string entries", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(["beauty", "home-decoration"]));
    const result = await getCategories();
    expect(result).toEqual([
      { slug: "beauty", name: "Beauty" },
      { slug: "home-decoration", name: "Home Decoration" },
    ]);
  });

  it("normalizes object entries", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse([
        { slug: "smartphones", name: "Smartphones" },
        { slug: "tops" },
      ]),
    );
    const result = await getCategories();
    expect(result).toEqual([
      { slug: "smartphones", name: "Smartphones" },
      { slug: "tops", name: "Tops" },
    ]);
  });
});
