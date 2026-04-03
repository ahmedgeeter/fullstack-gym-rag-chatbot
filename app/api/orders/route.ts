import { orderQuerySchema } from "@/lib/validators/orders";
import { respondSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import { getOrders } from "@/lib/repositories/orders";

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const query = orderQuerySchema.parse(Object.fromEntries(searchParams.entries()));

    const orders = await getOrders({
      email: query.email,
      orderNumber: query.orderNumber,
    });

    return respondSuccess(orders, { total: orders.length });
  } catch (error) {
    return handleApiError(error);
  }
}
