import { prisma } from "@/lib/db/prisma";
import { OrderStatus, PaymentStatus, ShippingStatus, ReviewStatus, Prisma } from "@prisma/client";

export type AdminProductInput = {
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  featured?: boolean;
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
  stockStatus?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  originCountry: string;
  material: string;
  maxUserWeight?: number | null;
  assemblyRequired?: boolean;
  footprintTag: "COMPACT" | "MEDIUM" | "LARGE";
  usageType: "HOME" | "STUDIO" | "COMMERCIAL";
  lengthCm?: number | null;
  widthCm?: number | null;
  heightCm?: number | null;
  weightKg?: number | null;
  warrantyMonths: number;
  shippingEstimateDays: number;
  tags?: string[];
  categoryId: string;
  brandId: string;
  inventory?: {
    stock: number;
    reserved?: number;
    reorderLevel?: number;
    location?: string;
  };
  images?: Array<{ url: string; alt: string; sortOrder?: number }>;
  specifications?: Array<{
    group?: string;
    name: string;
    value: string;
    sortOrder?: number;
  }>;
};

export type AdminOrderCreateInput = {
  email: string;
  phone?: string;
  shippingAddress: Record<string, unknown>;
  billingAddress?: Record<string, unknown>;
  shippingMethodId?: string;
  paymentMethodId?: string;
  items: Array<{ productId: string; quantity: number }>;
};

const cleanUndefined = <T extends Record<string, unknown>>(input: T) =>
  Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined)) as T;

const productInclude = {
  images: true,
  specifications: true,
  inventory: true,
  brand: true,
  category: true,
};

export const getAdminProducts = async (filters: {
  search?: string;
  status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
  categoryId?: string;
  brandId?: string;
}) => {
  const where: Record<string, unknown> = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.brandId) {
    where.brandId = filters.brandId;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { sku: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: productInclude,
  });
};

export const getAdminProductById = async (id: string) => {
  return prisma.product.findUnique({ where: { id }, include: productInclude });
};

export const createAdminProduct = async (payload: AdminProductInput) => {
  const { images, specifications, inventory, tags, ...product } = payload;

  const created = await prisma.product.create({
    data: {
      ...product,
      currency: "EUR",
      tags: tags ?? [],
      featured: product.featured ?? false,
      status: product.status ?? "ACTIVE",
      stockStatus: product.stockStatus ?? "IN_STOCK",
      assemblyRequired: product.assemblyRequired ?? false,
      compareAtPrice: product.compareAtPrice ?? null,
      images: images?.length
        ? {
            create: images.map((image) => ({
              url: image.url,
              alt: image.alt,
              sortOrder: image.sortOrder ?? 0,
            })),
          }
        : undefined,
      specifications: specifications?.length
        ? {
            create: specifications.map((spec) => ({
              group: spec.group,
              name: spec.name,
              value: spec.value,
              sortOrder: spec.sortOrder ?? 0,
            })),
          }
        : undefined,
      inventory: inventory
        ? {
            create: {
              stock: inventory.stock,
              reserved: inventory.reserved ?? 0,
              reorderLevel: inventory.reorderLevel,
              location: inventory.location,
            },
          }
        : undefined,
    },
  });

  return prisma.product.findUnique({ where: { id: created.id }, include: productInclude });
};

export const updateAdminProduct = async (id: string, payload: Partial<AdminProductInput>) => {
  const { images, specifications, inventory, tags, ...rest } = payload;
  const data = cleanUndefined({ ...rest, tags, compareAtPrice: rest.compareAtPrice });

  return prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        ...data,
        tags: tags === undefined ? undefined : tags,
      },
    });

    if (images !== undefined) {
      await tx.productImage.deleteMany({ where: { productId: id } });
      if (images.length) {
        await tx.productImage.createMany({
          data: images.map((image) => ({
            productId: id,
            url: image.url,
            alt: image.alt,
            sortOrder: image.sortOrder ?? 0,
          })),
        });
      }
    }

    if (specifications !== undefined) {
      await tx.productSpecification.deleteMany({ where: { productId: id } });
      if (specifications.length) {
        await tx.productSpecification.createMany({
          data: specifications.map((spec) => ({
            productId: id,
            group: spec.group,
            name: spec.name,
            value: spec.value,
            sortOrder: spec.sortOrder ?? 0,
          })),
        });
      }
    }

    if (inventory !== undefined) {
      await tx.inventory.upsert({
        where: { productId: id },
        update: {
          stock: inventory.stock,
          reserved: inventory.reserved ?? 0,
          reorderLevel: inventory.reorderLevel,
          location: inventory.location,
        },
        create: {
          productId: id,
          stock: inventory.stock,
          reserved: inventory.reserved ?? 0,
          reorderLevel: inventory.reorderLevel,
          location: inventory.location,
        },
      });
    }

    return tx.product.findUnique({ where: { id }, include: productInclude });
  });
};

export const archiveAdminProduct = async (id: string) => {
  return prisma.product.update({
    where: { id },
    data: { status: "ARCHIVED" },
    include: productInclude,
  });
};

export const getAdminOrders = async (filters: {
  status?: string;
  paymentStatus?: string;
  shippingStatus?: string;
}) => {
  const where: Record<string, unknown> = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.paymentStatus) {
    where.paymentStatus = filters.paymentStatus;
  }

  if (filters.shippingStatus) {
    where.shippingStatus = filters.shippingStatus;
  }

  return prisma.order.findMany({
    where,
    orderBy: { placedAt: "desc" },
    include: {
      items: true,
      shippingMethod: true,
      paymentMethod: true,
    },
  });
};

export const getAdminOrderById = async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      shippingMethod: true,
      paymentMethod: true,
    },
  });
};

export const updateAdminOrder = async (
  id: string,
  payload: {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    shippingStatus?: ShippingStatus;
  }
) => {
  const data = cleanUndefined(payload);
  return prisma.order.update({ where: { id }, data, include: { items: true } });
};

export const cancelAdminOrder = async (id: string) => {
  return prisma.order.update({
    where: { id },
    data: { status: "CANCELLED" },
    include: { items: true },
  });
};

export const createAdminOrder = async (payload: AdminOrderCreateInput) => {
  const productIds = payload.items.map((item) => item.productId);
  const products = (await prisma.product.findMany({
    where: { id: { in: productIds } },
  })) as Array<{ id: string; price: unknown; name: string; sku: string }>;

  const productMap = new Map(
    products.map((product: (typeof products)[number]) => [product.id, product])
  );
  const lineItems = payload.items
    .map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        return null;
      }

      return {
        product,
        quantity: item.quantity,
        unitPrice: Number(product.price),
        lineTotal: Number(product.price) * item.quantity,
      };
    })
    .filter(Boolean) as Array<{
    product: (typeof products)[number];
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;

  const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);

  const shippingMethod = payload.shippingMethodId
    ? await prisma.shippingMethod.findUnique({ where: { id: payload.shippingMethodId } })
    : await prisma.shippingMethod.findFirst({ where: { active: true }, orderBy: { sortOrder: "asc" } });

  const paymentMethod = payload.paymentMethodId
    ? await prisma.paymentMethod.findUnique({ where: { id: payload.paymentMethodId } })
    : await prisma.paymentMethod.findFirst({ where: { active: true }, orderBy: { sortOrder: "asc" } });

  const shippingTotal = shippingMethod ? Number(shippingMethod.price) : 0;
  const taxTotal = 0;
  const discountTotal = 0;
  const total = subtotal + shippingTotal + taxTotal - discountTotal;

  const orderNumber = `CM-${Date.now().toString(36).toUpperCase()}`;

  return prisma.order.create({
    data: {
      orderNumber,
      guestEmail: payload.email,
      subtotal,
      shippingTotal,
      taxTotal,
      discountTotal,
      total,
      currency: "EUR",
      shippingMethodId: shippingMethod?.id,
      paymentMethodId: paymentMethod?.id,
      shippingAddressSnapshot: payload.shippingAddress as Prisma.InputJsonValue,
      billingAddressSnapshot: payload.billingAddress as Prisma.InputJsonValue,
      items: {
        create: lineItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          sku: item.product.sku,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
          productSnapshot: item.product as Prisma.InputJsonValue,
        })),
      },
    },
    include: { items: true },
  });
};

export const getAdminFaqs = async () => {
  return prisma.fAQ.findMany({ orderBy: { sortOrder: "asc" } });
};

export const createAdminFaq = async (payload: {
  question: string;
  answer: string;
  category?: string;
  sortOrder?: number;
}) => {
  return prisma.fAQ.create({
    data: {
      question: payload.question,
      answer: payload.answer,
      category: payload.category,
      sortOrder: payload.sortOrder ?? 0,
    },
  });
};

export const updateAdminFaq = async (
  id: string,
  payload: { question?: string; answer?: string; category?: string; sortOrder?: number }
) => {
  const data = cleanUndefined(payload);
  return prisma.fAQ.update({ where: { id }, data });
};

export const deleteAdminFaq = async (id: string) => {
  return prisma.fAQ.delete({ where: { id } });
};

export const getAdminReviews = async (filters: { status?: string; productSlug?: string }) => {
  const where: Record<string, unknown> = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.productSlug) {
    const product = await prisma.product.findUnique({ where: { slug: filters.productSlug } });
    if (product) {
      where.productId = product.id;
    }
  }

  return prisma.review.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { product: true, customer: true },
  });
};

export const updateAdminReviewStatus = async (id: string, status: ReviewStatus) => {
  return prisma.review.update({
    where: { id },
    data: { status },
    include: { product: true, customer: true },
  });
};
