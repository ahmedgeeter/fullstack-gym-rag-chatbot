import { z } from "zod";

export const orderQuerySchema = z.object({
  email: z.string().email().optional(),
  orderNumber: z.string().optional(),
});
