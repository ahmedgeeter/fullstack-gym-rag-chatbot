import { productQuerySchema } from "@/lib/validators/catalog";
import { respondSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import { getProducts } from "@/lib/repositories/catalog";

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const query = productQuerySchema.parse(Object.fromEntries(searchParams.entries()));

    const result = await getProducts(query);

    return respondSuccess(result.items, {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
