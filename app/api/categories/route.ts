import { prisma } from "@/lib/db/prisma";
import { respondSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";

export async function GET() {
  try {
    const categories = (await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    })) as Array<Record<string, unknown> & { _count: { products: number } }>;

    const data = categories.map((category) => ({
      ...category,
      productCount: category._count.products,
    }));

    return respondSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}
