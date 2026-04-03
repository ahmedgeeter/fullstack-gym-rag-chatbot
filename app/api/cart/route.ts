import { cartUpdateSchema } from "@/lib/validators/cart";
import { respondSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import { getOrCreateCartToken } from "@/lib/utils/cart";
import { ensureCart, replaceCartItems } from "@/lib/repositories/cart";

export async function POST() {
  try {
    const { token, isNew } = await getOrCreateCartToken();
    const cart = await ensureCart(token);

    return respondSuccess(cart, null, isNew ? 201 : 200);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = cartUpdateSchema.parse(await request.json());
    const { token } = await getOrCreateCartToken();
    const cart = await replaceCartItems(token, payload.items);

    return respondSuccess(cart);
  } catch (error) {
    return handleApiError(error);
  }
}
