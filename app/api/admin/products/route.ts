import {
  adminProductListSchema,
  adminProductSchema,
  adminProductUpdateSchema,
} from "@/lib/validators/admin";
import { respondSuccess, respondError } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  archiveAdminProduct,
} from "@/lib/repositories/admin";

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const query = adminProductListSchema.parse(Object.fromEntries(searchParams.entries()));

    const products = await getAdminProducts(query);
    return respondSuccess(products, { total: products.length });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = adminProductSchema.parse(await request.json());
    const product = await createAdminProduct(payload);

    return respondSuccess(product, null, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : null;

    if (!id) {
      return respondError({ message: "Product id is required.", code: "VALIDATION_ERROR" }, 422);
    }

    const payload = adminProductUpdateSchema.parse(body);
    const product = await updateAdminProduct(id, payload);

    return respondSuccess(product);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : null;

    if (!id) {
      return respondError({ message: "Product id is required.", code: "VALIDATION_ERROR" }, 422);
    }

    const product = await archiveAdminProduct(id);

    return respondSuccess(product);
  } catch (error) {
    return handleApiError(error);
  }
}
