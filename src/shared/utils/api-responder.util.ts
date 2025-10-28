import type { Response } from "express";
import type { AppError } from "../errors/index.js";

export type PaginationMeta = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
};

export type APIResponse<T = unknown> = {
  status: "success" | "error";
  code: string;
  message: string;
  data?: T;
  meta?: {
    [key: string]: unknown;
    pagination?: PaginationMeta;
  };
  error?: {
    details?: unknown;
    stack?: string;
  };
};

export class APIResponder {
  private static send<T>(res: Response, response: APIResponse<T>, statusCode = 200): Response {
    return res.status(statusCode).json(response);
  }

  private static success<T>(
    res: Response,
    params: {
      code: string;
      message: string;
      data?: T;
      meta?: Record<string, unknown>;
      statusCode?: number;
    }
  ): Response {
    const { code, message, data, meta, statusCode = 200 } = params;
    return this.send<T>(
      res,
      {
        status: "success",
        code,
        message,
        ...(data !== undefined && { data }),
        ...(meta && { meta }),
      },
      statusCode
    );
  }

  static ok<T>(res: Response, data: T, code = "SUCCESS", message = "Request successful"): Response {
    return this.success(res, { code, message, data });
  }

  static created<T>(res: Response, data: T, code = "CREATED", message = "Resource created successfully"): Response {
    return this.success(res, { code, message, data, statusCode: 201 });
  }

  static updated<T>(res: Response, data: T, code = "UPDATED", message = "Request updated successfully"): Response {
    return this.success(res, { code, message, data });
  }

  static deleted(res: Response): Response {
    return res.status(204).end();
  }

  static paginated<T>(
    res: Response,
    params: {
      data: T[];
      total: number;
      page: number;
      limit: number;
      code?: string;
      message?: string;
      meta?: Record<string, unknown>;
    }
  ): Response {
    const { data, total, page, limit, code = "PAGINATED_RESULT", message = "Paginated data fetched successfully", meta = {} } = params;
    const totalPages = Math.ceil(total / limit);
    const pagination: PaginationMeta = {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };

    return this.success(res, {
      code,
      message,
      data,
      meta: { ...meta, pagination },
    });
  }

  static error(res: Response, error: AppError): Response {
    const errorPayload: Record<string, unknown> = {
      ...(error.details && { details: error.details }),
      ...(process.env.NODE_ENV === "development" && error.stack && { stack: error.stack }),
    };

    return this.send(
      res,
      {
        status: "error",
        code: error.code,
        message: error.message,
        ...(Object.keys(errorPayload).length && { error: errorPayload }),
      },
      error.statusCode
    );
  }
}
