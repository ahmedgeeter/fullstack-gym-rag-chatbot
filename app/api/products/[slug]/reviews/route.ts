import { getProductReviews } from "@/lib/repositories/catalog";
import { reviewQuerySchema } from "@/lib/validators/reviews";
import { respondSuccess, respondError } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";

type RouteParams = { params: { slug: string } };

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const query = reviewQuerySchema.parse(Object.fromEntries(searchParams.entries()));

    const result = await getProductReviews(params.slug, query.status);

    if (!result) {
      return respondError({ message: "Product not found.", code: "NOT_FOUND" }, 404);
    }

    return respondSuccess(result.reviews, { total: result.reviews.length });
  } catch (error) {
    return handleApiError(error);
  }
}
