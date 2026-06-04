export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
  tags?: string[];
  availabilityStatus?: string;
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
};

export type ProductPage = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type RawCategory = string | { slug: string; name?: string; url?: string };

export type Category = {
  slug: string;
  name: string;
};

export type SortField = "title" | "price" | "rating" | "default";
export type SortOrder = "asc" | "desc";

export type ProductQuery = {
  q?: string;
  category?: string;
  sortBy?: SortField;
  order?: SortOrder;
  limit?: number;
  skip?: number;
};
