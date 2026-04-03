import { adminFaqSchema } from "@/lib/validators/admin";
import { respondSuccess, respondError } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";
import { getAdminFaqs, createAdminFaq, updateAdminFaq, deleteAdminFaq } from "@/lib/repositories/admin";

export async function GET() {
  try {
    const faqs = await getAdminFaqs();
    return respondSuccess(faqs, { total: faqs.length });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = adminFaqSchema.parse(await request.json());
    const faq = await createAdminFaq(payload);

    return respondSuccess(faq, null, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : null;

    if (!id) {
      return respondError({ message: "FAQ id is required.", code: "VALIDATION_ERROR" }, 422);
    }

    const payload = adminFaqSchema.partial().parse(body);
    const faq = await updateAdminFaq(id, payload);

    return respondSuccess(faq);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : null;

    if (!id) {
      return respondError({ message: "FAQ id is required.", code: "VALIDATION_ERROR" }, 422);
    }

    const faq = await deleteAdminFaq(id);
    return respondSuccess(faq);
  } catch (error) {
    return handleApiError(error);
  }
}
