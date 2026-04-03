import { z } from "zod";

const productBaseSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().min(2),
  shortDescription: z.string().min(10),
  description: z.string().min(20),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0).optional().nullable(),
  featured: z.coerce.boolean().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
  stockStatus: z.enum(["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"]).optional(),
  originCountry: z.string().min(2),
  material: z.string().min(2),
  maxUserWeight: z.coerce.number().int().min(1).optional().nullable(),
  assemblyRequired: z.coerce.boolean().optional(),
  footprintTag: z.enum(["COMPACT", "MEDIUM", "LARGE"]),
  usageType: z.enum(["HOME", "STUDIO", "COMMERCIAL"]),
  lengthCm: z.coerce.number().int().min(1).optional().nullable(),
  widthCm: z.coerce.number().int().min(1).optional().nullable(),
  heightCm: z.coerce.number().int().min(1).optional().nullable(),
  weightKg: z.coerce.number().min(0).optional().nullable(),
  warrantyMonths: z.coerce.number().int().min(1),
  shippingEstimateDays: z.coerce.number().int().min(1),
  tags: z.array(z.string().min(1)).optional(),
  categoryId: z.string().min(1),
  brandId: z.string().min(1),
  inventory: z
    .object({
      stock: z.coerce.number().int().min(0),
      reserved: z.coerce.number().int().min(0).optional(),
      reorderLevel: z.coerce.number().int().min(0).optional(),
      location: z.string().optional(),
    })
    .optional(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string().min(2),
        sortOrder: z.coerce.number().int().min(0).optional(),
      })
    )
    .optional(),
  specifications: z
    .array(
      z.object({
        group: z.string().optional(),
        name: z.string().min(1),
        value: z.string().min(1),
        sortOrder: z.coerce.number().int().min(0).optional(),
      })
    )
    .optional(),
});

export const adminProductSchema = productBaseSchema;
export const adminProductUpdateSchema = productBaseSchema.partial();

export const adminFaqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10),
  category: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
});

export const adminOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "FULFILLED", "CANCELLED", "RETURNED"]).optional(),
  paymentStatus: z.enum(["UNPAID", "PAID", "REFUNDED"]).optional(),
  shippingStatus: z.enum(["NOT_SHIPPED", "IN_TRANSIT", "DELIVERED", "RETURNED"]).optional(),
});

export const adminReviewModerationSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export const adminProductListSchema = z.object({
  search: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
});

export const adminOrderListSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "FULFILLED", "CANCELLED", "RETURNED"]).optional(),
  paymentStatus: z.enum(["UNPAID", "PAID", "REFUNDED"]).optional(),
  shippingStatus: z.enum(["NOT_SHIPPED", "IN_TRANSIT", "DELIVERED", "RETURNED"]).optional(),
});

export const adminOrderCreateSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  shippingAddress: z.record(z.unknown()),
  billingAddress: z.record(z.unknown()).optional(),
  shippingMethodId: z.string().optional(),
  paymentMethodId: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().min(1),
      })
    )
    .min(1),
});

export const adminReviewListSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  productSlug: z.string().optional(),
});
