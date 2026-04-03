import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";
import { getCartByToken } from "@/lib/repositories/cart";

const toNumber = (value: unknown) => Number(value ?? 0);

export const createOrderFromCart = async (guestToken: string, payload: {
  email: string;
  phone?: string;
  shippingAddress: Record<string, unknown>;
  billingAddress?: Record<string, unknown>;
  shippingMethodId?: string;
  paymentMethodId?: string;
}) => {
  const cart = await getCartByToken(guestToken);

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const shippingMethod = payload.shippingMethodId
    ? await prisma.shippingMethod.findUnique({ where: { id: payload.shippingMethodId } })
    : await prisma.shippingMethod.findFirst({ where: { active: true }, orderBy: { sortOrder: "asc" } });

  const paymentMethod = payload.paymentMethodId
    ? await prisma.paymentMethod.findUnique({ where: { id: payload.paymentMethodId } })
    : await prisma.paymentMethod.findFirst({ where: { active: true }, orderBy: { sortOrder: "asc" } });

  const subtotal = cart.items.reduce(
    (sum, item) => sum + toNumber(item.unitPrice) * item.quantity,
    0
  );
  const shippingTotal = shippingMethod ? toNumber(shippingMethod.price) : 0;
  const taxTotal = 0;
  const discountTotal = 0;
  const total = subtotal + shippingTotal + taxTotal - discountTotal;

  const orderNumber = `CM-${Date.now().toString(36).toUpperCase()}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      guestEmail: payload.email,
      subtotal,
      shippingTotal,
      taxTotal,
      discountTotal,
      total,
      currency: cart.currency,
      shippingMethodId: shippingMethod?.id,
      paymentMethodId: paymentMethod?.id,
      shippingAddressSnapshot: payload.shippingAddress as Prisma.InputJsonValue,
      billingAddressSnapshot: payload.billingAddress as Prisma.InputJsonValue,
      items: {
        create: cart.items.map((item) => {
          const product = item.product as {
            id?: string;
            name?: string;
            sku?: string;
          };

          return {
            productId: typeof product.id === "string" ? product.id : null,
            productName: String(product.name ?? ""),
            sku: String(product.sku ?? ""),
            unitPrice: toNumber(item.unitPrice),
            quantity: item.quantity,
            lineTotal: toNumber(item.unitPrice) * item.quantity,
            productSnapshot: item.product as Prisma.InputJsonValue,
          };
        }),
      },
    },
    include: { items: true },
  });

  await prisma.cart.update({
    where: { id: cart.id },
    data: { status: "ORDERED" },
  });

  return order;
};
