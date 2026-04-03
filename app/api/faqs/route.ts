import { getFaqs } from "@/lib/repositories/catalog";
import { respondSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";

export async function GET() {
  try {
    const faqs = await getFaqs();
    return respondSuccess(faqs, { total: faqs.length });
  } catch (error) {
    return handleApiError(error);
  }
}
