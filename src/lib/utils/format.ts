const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function formatPrice(value: number): string {
  return currency.format(value);
}

export function formatCategory(slug: string): string {
  if (!slug) return "";
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function discountedPrice(price: number, percentage: number): number {
  if (!percentage || percentage <= 0) return price;
  return Math.max(0, price - (price * percentage) / 100);
}

export function formatRating(value: number): string {
  return value.toFixed(1);
}
