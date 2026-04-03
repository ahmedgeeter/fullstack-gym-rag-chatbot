import { getReviews } from "@/lib/repositories/catalog";
import { reviewQuerySchema } from "@/lib/validators/reviews";
import { respondSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const query = reviewQuerySchema.parse(Object.fromEntries(searchParams.entries()));

    const reviews = await getReviews({
      productSlug: query.productSlug,
      status: query.status,
    });

    return respondSuccess(reviews, { total: reviews.length });
  } catch (error) {
    return handleApiError(error);
  }
}
