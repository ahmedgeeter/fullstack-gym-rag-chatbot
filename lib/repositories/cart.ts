import { prisma } from "@/lib/db/prisma";

const cartInclude = {
  items: {
    include: {
      product: {
        include: {
          images: true,
          brand: true,
          category: true,
        },
      },
    },
  },
};

type CartItemShape = {
  id: string;
  quantity: number;
  unitPrice: unknown;
  product: Record<string, unknown>;
};

type CartShape = {
  id: string;
  guestToken: string;
  status: string;
  currency: string;
  items: CartItemShape[];
};

const mapCart = (cart: CartShape) => {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.unitPrice ?? 0) * item.quantity,
    0
  );
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    ...cart,
    subtotal,
    itemCount,
  };
};

export const getCartByToken = async (guestToken: string) => {
  const cart = (await prisma.cart.findUnique({
    where: { guestToken },
    include: cartInclude,
  })) as CartShape | null;

  if (!cart) {
    return null;
  }

  return mapCart(cart);
};

export const ensureCart = async (guestToken: string) => {
  const existing = await getCartByToken(guestToken);
  if (existing) {
    return existing;
  }

  const cart = (await prisma.cart.create({
    data: { guestToken },
    include: cartInclude,
  })) as CartShape;

  return mapCart(cart);
};

export const addOrUpdateCartItem = async (guestToken: string, productId: string, quantity: number) => {
  const cart = await ensureCart(guestToken);
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    return null;
  }

  await prisma.cartItem.upsert({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    update: {
      quantity,
      unitPrice: product.price,
    },
    create: {
      cartId: cart.id,
      productId,
      quantity,
      unitPrice: product.price,
    },
  });

  return getCartByToken(guestToken);
};

export const replaceCartItems = async (
  guestToken: string,
  items: Array<{ productId: string; quantity: number }>
) => {
  const cart = await ensureCart(guestToken);

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  const productIds = items.map((item) => item.productId);
  const products = (await prisma.product.findMany({
    where: { id: { in: productIds } },
  })) as Array<{ id: string; price: unknown }>;

  const productMap = new Map(
    products.map((product: (typeof products)[number]) => [product.id, product])
  );

  await prisma.cartItem.createMany({
    data: items
      .filter((item) => productMap.has(item.productId))
      .map((item) => ({
        cartId: cart.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(productMap.get(item.productId)!.price ?? 0),
      })),
  });

  return getCartByToken(guestToken);
};

export const removeCartItem = async (guestToken: string, itemId: string) => {
  const cart = await ensureCart(guestToken);

  await prisma.cartItem.deleteMany({
    where: {
      id: itemId,
      cartId: cart.id,
    },
  });

  return getCartByToken(guestToken);
};
