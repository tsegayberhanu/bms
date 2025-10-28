import type { Request, Response, NextFunction } from "express";
import { InternalServerError, AppError } from "../errors/index.js";
import { APIResponder } from "../utils/api-responder.util.js";

export const errorHandlerMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else {
    console.error("Unexpected error:", err);
    error = new InternalServerError("Something went wrong on the server");
  }

  return APIResponder.error(res, error);
};
