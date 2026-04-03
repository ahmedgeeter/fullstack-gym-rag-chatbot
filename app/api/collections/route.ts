import { prisma } from "@/lib/db/prisma";
import { respondSuccess } from "@/lib/api/response";
import { handleApiError } from "@/lib/api/errors";

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    });

    return respondSuccess(collections);
  } catch (error) {
    return handleApiError(error);
  }
}
