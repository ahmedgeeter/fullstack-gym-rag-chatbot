import { prisma } from "@/lib/db/prisma";
import { respondSuccess, respondError } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(_: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
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
      return respondError({ message: "Collection not found.", code: "NOT_FOUND" }, 404);
    }

    const items = collection.products.map(
      (entry: { product: Record<string, unknown> }) => entry.product
    );

    return respondSuccess({ ...collection, items });
  } catch (error) {
    return handleApiError(error);
  }
}
