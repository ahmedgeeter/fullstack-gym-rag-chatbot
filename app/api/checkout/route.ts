import { checkoutSchema } from "@/lib/validators/checkout";
import { respondSuccess, respondError } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import { getCartToken } from "@/lib/utils/cart";
import { createOrderFromCart } from "@/lib/services/checkout";

export async function POST(request: Request) {
  try {
    const payload = checkoutSchema.parse(await request.json());
    const token = getCartToken();

    if (!token) {
      return respondError({ message: "Cart token not found.", code: "CART_NOT_FOUND" }, 400);
    }

    const order = await createOrderFromCart(token, payload);

    if (!order) {
      return respondError(
        { message: "Cart is empty or unavailable.", code: "CART_EMPTY" },
        400
      );
    }

    return respondSuccess(order, null, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
