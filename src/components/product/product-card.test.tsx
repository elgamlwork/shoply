import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCard } from "./product-card";
import { useFavoritesStore } from "@/lib/favorites/store";
import { useAuthStore } from "@/lib/auth/store";
import type { Product } from "@/types/product";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/products/42",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const baseProduct: Product = {
  id: 42,
  title: "Editorial Leather Tote",
  description: "A handcrafted tote.",
  category: "womens-bags",
  price: 240,
  discountPercentage: 25,
  rating: 4.5,
  stock: 12,
  brand: "Studio",
  thumbnail: "https://cdn.dummyjson.com/p/42.png",
  images: [],
};

const signedInUser = {
  id: "u1",
  username: "ada",
  email: "ada@example.com",
  firstName: "Ada",
  provider: "dummyjson" as const,
};

beforeEach(() => {
  mockPush.mockReset();
  act(() => {
    useFavoritesStore.setState({ ids: [] });
    useAuthStore.setState({ user: null, status: "anonymous" });
  });
});

describe("ProductCard", () => {
  it("renders title, formatted category, and discounted price", () => {
    render(<ProductCard product={baseProduct} />);
    expect(screen.getByText("Editorial Leather Tote")).toBeInTheDocument();
    expect(screen.getByText("Womens Bags")).toBeInTheDocument();
    // Discounted: 240 - 25% = 180
    expect(screen.getByText("$180.00")).toBeInTheDocument();
    // Original price line-through
    expect(screen.getByText("$240.00")).toBeInTheDocument();
    // Discount badge
    expect(screen.getByText("−25%")).toBeInTheDocument();
  });

  it("links to the product detail page", () => {
    render(<ProductCard product={baseProduct} />);
    const link = screen.getByLabelText("Editorial Leather Tote");
    expect(link).toHaveAttribute("href", "/products/42");
  });

  it("redirects unauthed users to /login when the heart is clicked", async () => {
    const user = userEvent.setup();
    render(<ProductCard product={baseProduct} />);
    const button = screen.getByRole("button", {
      name: /sign in to save to favorites/i,
    });
    await user.click(button);
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush.mock.calls[0][0]).toMatch(/^\/login\?/);
    expect(mockPush.mock.calls[0][0]).toContain("from=%2Fproducts%2F42");
    expect(mockPush.mock.calls[0][0]).toContain("reason=favorite");
    expect(useFavoritesStore.getState().ids).not.toContain(42);
  });

  it("toggles favorite state when the user is signed in", async () => {
    act(() => {
      useAuthStore.setState({ user: signedInUser, status: "authenticated" });
    });
    const user = userEvent.setup();
    render(<ProductCard product={baseProduct} />);

    const button = screen.getByRole("button", { name: /save to favorites/i });
    await user.click(button);
    expect(useFavoritesStore.getState().ids).toContain(42);
    expect(mockPush).not.toHaveBeenCalled();

    const filledButton = screen.getByRole("button", {
      name: /remove from favorites/i,
    });
    await user.click(filledButton);
    expect(useFavoritesStore.getState().ids).not.toContain(42);
  });

  it("omits the discount badge when discountPercentage is zero", () => {
    render(<ProductCard product={{ ...baseProduct, discountPercentage: 0 }} />);
    expect(screen.queryByText(/−/)).toBeNull();
    expect(screen.getByText("$240.00")).toBeInTheDocument();
  });
});
