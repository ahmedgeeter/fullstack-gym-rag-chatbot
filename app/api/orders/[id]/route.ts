import { respondSuccess, respondError } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import { getOrderById } from "@/lib/repositories/orders";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return respondError({ message: "Order not found.", code: "NOT_FOUND" }, 404);
    }

    return respondSuccess(order);
  } catch (error) {
    return handleApiError(error);
  }
}
