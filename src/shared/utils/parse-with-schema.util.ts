import { z } from "zod";
import { ValidationError } from "../errors/index.js";

export function parseWithSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    const details = formatZodError(parsed.error);
    throw new ValidationError("Invalid Data", details);
  }

  return parsed.data;
}

const formatZodError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  }
  return [{ field: "unknown", message: "Unknown validation error" }];
};
