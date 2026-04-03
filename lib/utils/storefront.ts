import { headers } from "next/headers";
import type { ApiResponse } from "@/lib/api/response";

const resolveBaseUrl = async () => {
  const headerList = await headers();
  const host = headerList.get("host");

  if (host) {
    const protocol = host.includes("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https";
    return `${protocol}://${host}`;
  }

  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
};

export const fetchStorefront = async <T>(path: string) => {
  const baseUrl = await resolveBaseUrl();
  const response = await fetch(`${baseUrl}${path}`, { cache: "no-store" });

  if (!response.ok) {
    return { data: null, meta: null, error: { message: "Request failed" } } as ApiResponse<T>;
  }

  return (await response.json()) as ApiResponse<T>;
};
