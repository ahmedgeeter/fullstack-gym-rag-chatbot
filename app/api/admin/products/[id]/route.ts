import { respondSuccess, respondError } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import { getAdminProductById } from "@/lib/repositories/admin";

type RouteParams = { params: { id: string } };

export async function GET(_: Request, { params }: RouteParams) {
  try {
    const product = await getAdminProductById(params.id);

    if (!product) {
      return respondError({ message: "Product not found.", code: "NOT_FOUND" }, 404);
    }

    return respondSuccess(product);
  } catch (error) {
    return handleApiError(error);
  }
}
