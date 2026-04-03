import { z } from "zod";

export const reviewQuerySchema = z.object({
  productSlug: z.string().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});
