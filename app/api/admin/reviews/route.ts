import { adminReviewListSchema, adminReviewModerationSchema } from "@/lib/validators/admin";
import { respondSuccess, respondError } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import { getAdminReviews, updateAdminReviewStatus } from "@/lib/repositories/admin";

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const query = adminReviewListSchema.parse(Object.fromEntries(searchParams.entries()));

    const reviews = await getAdminReviews(query);
    return respondSuccess(reviews, { total: reviews.length });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : null;

    if (!id) {
      return respondError({ message: "Review id is required.", code: "VALIDATION_ERROR" }, 422);
    }

    const payload = adminReviewModerationSchema.parse(body);
    const review = await updateAdminReviewStatus(id, payload.status);

    return respondSuccess(review);
  } catch (error) {
    return handleApiError(error);
  }
}
