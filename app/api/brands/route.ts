import { prisma } from "@/lib/db/prisma";
import { respondSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";

export async function GET() {
  try {
    const brands = (await prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    })) as Array<Record<string, unknown> & { _count: { products: number } }>;

    const data = brands.map((brand) => ({
      ...brand,
      productCount: brand._count.products,
    }));

    return respondSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}
