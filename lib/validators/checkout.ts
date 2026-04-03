import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(6).max(30).optional(),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    line1: z.string().min(2),
    line2: z.string().optional(),
    city: z.string().min(2),
    region: z.string().optional(),
    postalCode: z.string().min(3),
    country: z.string().min(2),
  }),
  billingAddress: z
    .object({
      fullName: z.string().min(2),
      line1: z.string().min(2),
      line2: z.string().optional(),
      city: z.string().min(2),
      region: z.string().optional(),
      postalCode: z.string().min(3),
      country: z.string().min(2),
    })
    .optional(),
  shippingMethodId: z.string().optional(),
  paymentMethodId: z.string().optional(),
  notes: z.string().optional(),
});
