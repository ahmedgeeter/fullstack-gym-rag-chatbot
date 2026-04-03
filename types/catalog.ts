export type ProductImage = {
  url: string;
  alt: string;
  sortOrder?: number;
};

export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  images: ProductImage[];
  brand?: { name: string; slug?: string | null } | null;
  category?: { name: string; slug?: string | null } | null;
  averageRating?: number;
  reviewCount?: number;
  stockStatus?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
};

export type ProductDetail = ProductSummary & {
  sku?: string;
  shortDescription?: string;
  description?: string;
  originCountry?: string;
  material?: string;
  maxUserWeight?: number | null;
  assemblyRequired?: boolean;
  footprintTag?: "COMPACT" | "MEDIUM" | "LARGE";
  usageType?: "HOME" | "STUDIO" | "COMMERCIAL";
  lengthCm?: number | null;
  widthCm?: number | null;
  heightCm?: number | null;
  weightKg?: number | null;
  warrantyMonths?: number | null;
  shippingEstimateDays?: number | null;
  specifications?: Array<{ group?: string | null; name: string; value: string }>;
};

export type Review = {
  id: string;
  rating: number;
  title: string;
  content: string;
  createdAt?: string | Date;
  customer?: { firstName?: string | null; lastName?: string | null } | null;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
};
