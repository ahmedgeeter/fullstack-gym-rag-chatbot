import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const CART_COOKIE = "coremont_cart";

export const getOrCreateCartToken = () => {
  const cookieStore = cookies();
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

export const getCartToken = () => {
  const cookieStore = cookies();
  return cookieStore.get(CART_COOKIE)?.value ?? null;
};
