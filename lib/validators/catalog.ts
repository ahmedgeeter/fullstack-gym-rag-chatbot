import { z } from "zod";

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}, z.number().optional());

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(12),
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: optionalNumber,
  maxPrice: optionalNumber,
  usageType: z.enum(["HOME", "STUDIO", "COMMERCIAL"]).optional(),
  footprintTag: z.enum(["COMPACT", "MEDIUM", "LARGE"]).optional(),
  stockStatus: z.enum(["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"]).optional(),
  featured: z.coerce.boolean().optional(),
  sort: z
    .enum(["featured", "price-asc", "price-desc", "newest"])
    .optional()
    .default("featured"),
});
