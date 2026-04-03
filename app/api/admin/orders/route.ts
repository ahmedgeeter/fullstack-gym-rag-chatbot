import {
  adminOrderListSchema,
  adminOrderStatusSchema,
  adminOrderCreateSchema,
} from "@/lib/validators/admin";
import { respondSuccess, respondError } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import {
  getAdminOrders,
  updateAdminOrder,
  cancelAdminOrder,
  createAdminOrder,
} from "@/lib/repositories/admin";

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const query = adminOrderListSchema.parse(Object.fromEntries(searchParams.entries()));

    const orders = await getAdminOrders(query);
    return respondSuccess(orders, { total: orders.length });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = adminOrderCreateSchema.parse(await request.json());
    const order = await createAdminOrder(payload);

    return respondSuccess(order, null, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : null;

    if (!id) {
      return respondError({ message: "Order id is required.", code: "VALIDATION_ERROR" }, 422);
    }

    const payload = adminOrderStatusSchema.parse(body);
    const order = await updateAdminOrder(id, payload);

    return respondSuccess(order);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : null;

    if (!id) {
      return respondError({ message: "Order id is required.", code: "VALIDATION_ERROR" }, 422);
    }

    const order = await cancelAdminOrder(id);
    return respondSuccess(order);
  } catch (error) {
    return handleApiError(error);
  }
}
