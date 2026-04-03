import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const CART_COOKIE = "coremont_cart";

export const getOrCreateCartToken = async () => {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_COOKIE)?.value;

  if (existing) {
    return { token: existing, isNew: false };
  }

  const token = randomUUID();
  cookieStore.set(CART_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return { token, isNew: true };
};

export const getCartToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE)?.value ?? null;
};
