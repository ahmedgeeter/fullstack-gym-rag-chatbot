import { ZodError } from "zod";
import { respondError } from "./response";

export const handleApiError = (error: unknown) => {
  if (error instanceof ZodError) {
    return respondError(
      {
        message: "Validation failed.",
        code: "VALIDATION_ERROR",
        issues: error.flatten(),
      },
      422
    );
  }

  if (error instanceof Error) {
    return respondError({ message: error.message, code: "SERVER_ERROR" }, 500);
  }

  return respondError({ message: "Unexpected error.", code: "SERVER_ERROR" }, 500);
};
