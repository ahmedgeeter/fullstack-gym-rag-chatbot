import { getProductBySlug } from "@/lib/repositories/catalog";
import { respondSuccess, respondError } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";

type RouteParams = { params: { slug: string } };

export async function GET(_: Request, { params }: RouteParams) {
  try {
    const product = await getProductBySlug(params.slug);

    if (!product) {
      return respondError({ message: "Product not found.", code: "NOT_FOUND" }, 404);
    }

    return respondSuccess(product);
  } catch (error) {
    return handleApiError(error);
  }
}
