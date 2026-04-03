import { prisma } from "@/lib/db/prisma";
import { respondSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";

export async function GET() {
  try {
    const [orderCount, productCount, customerCount, revenue, recentOrders, lowStock] =
      await Promise.all([
        prisma.order.count(),
        prisma.product.count(),
        prisma.customer.count(),
        prisma.order.aggregate({ _sum: { total: true } }),
        prisma.order.findMany({
          take: 8,
          orderBy: { placedAt: "desc" },
          include: { items: true },
        }),
        prisma.product.findMany({
          where: { stockStatus: { in: ["LOW_STOCK", "OUT_OF_STOCK"] } },
          take: 8,
          include: { inventory: true },
        }),
      ]);

    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId", "productName"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    });

    return respondSuccess({
      kpis: {
        orderCount,
        productCount,
        customerCount,
        revenue: Number(revenue._sum.total ?? 0),
      },
      recentOrders,
      lowStock,
      topProducts,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
