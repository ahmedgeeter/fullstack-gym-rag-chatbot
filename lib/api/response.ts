import { NextResponse } from "next/server";

export type ApiMeta = {
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
};

export type ApiError = {
  message: string;
  code?: string;
  issues?: unknown;
};

export type ApiResponse<T> = {
  data: T | null;
  meta: ApiMeta | null;
  error: ApiError | null;
};

export const respondSuccess = <T>(data: T, meta: ApiMeta | null = null, status = 200) => {
  const payload: ApiResponse<T> = { data, meta, error: null };
  return NextResponse.json(payload, { status });
};

export const respondError = (error: ApiError, status = 400) => {
  const payload: ApiResponse<null> = { data: null, meta: null, error };
  return NextResponse.json(payload, { status });
};
