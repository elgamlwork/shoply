import { describe, it, expect } from "vitest";
import { discountedPrice, formatCategory, formatPrice, formatRating } from "./format";

describe("formatPrice", () => {
  it("formats a whole number as USD", () => {
    expect(formatPrice(129)).toBe("$129.00");
  });

  it("rounds two decimals", () => {
    expect(formatPrice(19.999)).toBe("$20.00");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });
});

describe("formatCategory", () => {
  it("title-cases a hyphenated slug", () => {
    expect(formatCategory("home-decoration")).toBe("Home Decoration");
  });

  it("handles underscores and whitespace", () => {
    expect(formatCategory("mens_shirts")).toBe("Mens Shirts");
    expect(formatCategory("  beauty  ")).toBe("Beauty");
  });

  it("returns empty string for empty input", () => {
    expect(formatCategory("")).toBe("");
  });
});

describe("discountedPrice", () => {
  it("subtracts the discount percentage", () => {
    expect(discountedPrice(100, 25)).toBe(75);
  });

  it("returns the original price when discount is zero or negative", () => {
    expect(discountedPrice(100, 0)).toBe(100);
    expect(discountedPrice(100, -10)).toBe(100);
  });

  it("clamps to zero if percentage exceeds 100", () => {
    expect(discountedPrice(100, 150)).toBe(0);
  });
});

describe("formatRating", () => {
  it("renders one decimal place", () => {
    expect(formatRating(4.567)).toBe("4.6");
    expect(formatRating(5)).toBe("5.0");
  });
});
