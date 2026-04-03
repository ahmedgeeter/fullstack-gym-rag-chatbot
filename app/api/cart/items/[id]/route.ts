import { getCartToken } from "@/lib/utils/cart";
import { removeCartItem } from "@/lib/repositories/cart";
import { respondSuccess, respondError } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";

type RouteParams = { params: Promise<{ id: string }> };

export async function DELETE(_: Request, { params }: RouteParams) {
  try {
    const token = await getCartToken();

    if (!token) {
      return respondError({ message: "Cart token not found.", code: "CART_NOT_FOUND" }, 400);
    }

    const { id } = await params;
    const cart = await removeCartItem(token, id);

    return respondSuccess(cart);
  } catch (error) {
    return handleApiError(error);
  }
}
