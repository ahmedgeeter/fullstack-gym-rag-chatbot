import { prisma } from "@/lib/db/prisma";

export const getRecentOrders = async () => {
  return prisma.order.findMany({
    orderBy: { placedAt: "desc" },
    take: 20,
    include: { items: true },
  });
};

export const getOrders = async (filters: { email?: string; orderNumber?: string }) => {
  const where: Record<string, unknown> = {};

  if (filters.email) {
    where.OR = [{ guestEmail: filters.email }, { customer: { email: filters.email } }];
  }

  if (filters.orderNumber) {
    where.orderNumber = filters.orderNumber;
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

export const getOrderById = async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      shippingMethod: true,
      paymentMethod: true,
    },
  });
};
