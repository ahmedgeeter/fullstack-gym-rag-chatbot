import { prisma } from "@/lib/db/prisma";

type ReviewStatusValue = "PENDING" | "APPROVED" | "REJECTED";
type ProductStatusValue = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type ProductQuery = {
  page: number;
  pageSize: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  usageType?: "HOME" | "STUDIO" | "COMMERCIAL";
  footprintTag?: "COMPACT" | "MEDIUM" | "LARGE";
  stockStatus?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  featured?: boolean;
  sort?: "featured" | "price-asc" | "price-desc" | "newest";
};

export const getCategories = async () => {
  const categories = (await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  })) as Array<Record<string, unknown> & { _count: { products: number } }>;

  return categories.map((category: (typeof categories)[number]) => ({
    ...category,
    productCount: category._count.products,
  }));
};

export const getBrands = async () => {
  const brands = (await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  })) as Array<Record<string, unknown> & { _count: { products: number } }>;

  return brands.map((brand: (typeof brands)[number]) => ({
    ...brand,
    productCount: brand._count.products,
  }));
};

export const getCollections = async () => {
  return prisma.collection.findMany({
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
  });
};

export const getCollectionBySlug = async (slug: string) => {
  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: {
      products: {
        orderBy: { sortOrder: "asc" },
        include: {
          product: {
            include: { images: true, category: true, brand: true },
          },
        },
      },
    },
  });

  if (!collection) {
    return null;
  }

  return {
    ...collection,
    items: collection.products.map(
      (entry: { product: Record<string, unknown> }) => entry.product
    ),
  };
};

export const getProducts = async (query: ProductQuery) => {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 12;
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {
    status: "ACTIVE" as ProductStatusValue,
  };

  if (query.category) {
    where.category = { slug: query.category };
  }

  if (query.brand) {
    where.brand = { slug: query.brand };
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { shortDescription: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.minPrice || query.maxPrice) {
    where.price = {
      ...(query.minPrice ? { gte: query.minPrice } : {}),
      ...(query.maxPrice ? { lte: query.maxPrice } : {}),
    };
  }

  if (query.usageType) {
    where.usageType = query.usageType;
  }

  if (query.footprintTag) {
    where.footprintTag = query.footprintTag;
  }

  if (query.stockStatus) {
    where.stockStatus = query.stockStatus;
  }

  if (typeof query.featured === "boolean") {
    where.featured = query.featured;
  }

  const orderBy = (() => {
    switch (query.sort) {
      case "price-asc":
        return [{ price: "asc" }];
      case "price-desc":
        return [{ price: "desc" }];
      case "newest":
        return [{ createdAt: "desc" }];
      default:
        return [{ featured: "desc" }, { createdAt: "desc" }];
    }
  })();

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: orderBy as any,
      skip,
      take: pageSize,
      include: {
        images: true,
        brand: true,
        category: true,
        reviews: {
          where: { status: "APPROVED" as ReviewStatusValue },
          select: { rating: true },
        },
      },
    }),
  ]);

  const items = products.map((product: (typeof products)[number]) => {
    const ratings = product.reviews.map((review: { rating: number }) => review.rating);
    const averageRating = ratings.length
      ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length
      : 0;

    return {
      ...product,
      averageRating,
      reviewCount: ratings.length,
    };
  });

  const totalPages = Math.ceil(total / pageSize);

  return { items, total, totalPages, page, pageSize };
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      specifications: { orderBy: { sortOrder: "asc" } },
      brand: true,
      category: true,
      inventory: true,
      reviews: {
        where: { status: "APPROVED" as ReviewStatusValue },
        orderBy: { createdAt: "desc" },
        include: { customer: true },
      },
    },
  });

  if (!product) {
    return null;
  }

  const ratings = product.reviews.map((review: { rating: number }) => review.rating);
  const averageRating = ratings.length
    ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length
    : 0;

  return {
    ...product,
    averageRating,
    reviewCount: ratings.length,
  };
};

export const getProductReviews = async (slug: string, status?: ReviewStatusValue) => {
  const product = await prisma.product.findUnique({ where: { slug } });

  if (!product) {
    return null;
  }

  const reviews = await prisma.review.findMany({
    where: {
      productId: product.id,
      ...(status ? { status } : { status: "APPROVED" as ReviewStatusValue }),
    },
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });

  return { productId: product.id, reviews };
};

export const getReviews = async (filters: {
  productSlug?: string;
  status?: ReviewStatusValue;
}) => {
  if (filters.productSlug) {
    const product = await prisma.product.findUnique({ where: { slug: filters.productSlug } });
    if (!product) {
      return [];
    }

    return prisma.review.findMany({
      where: {
        productId: product.id,
        ...(filters.status ? { status: filters.status } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: { customer: true },
    });
  }

  return prisma.review.findMany({
    where: {
      ...(filters.status ? { status: filters.status } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });
};

export const getHighlightedReviews = async (limit = 4) => {
  return prisma.review.findMany({
    where: { status: "APPROVED" as ReviewStatusValue },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { customer: true, product: true },
  });
};

export const getFaqs = async () => {
  return prisma.fAQ.findMany({ orderBy: { sortOrder: "asc" } });
};
