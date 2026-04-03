import { respondSuccess, respondError } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import { getAdminProductById } from "@/lib/repositories/admin";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const product = await getAdminProductById(id);

    if (!product) {
      return respondError({ message: "Product not found.", code: "NOT_FOUND" }, 404);
    }

    return respondSuccess(product);
  } catch (error) {
    return handleApiError(error);
  }
}
