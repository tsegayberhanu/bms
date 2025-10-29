import type { Request, Response, NextFunction } from "express";
import { extractBearerToken, verifyJwt } from "../utils/index.js";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../errors/index.js";
import { AuthRepository } from "../../modules/auth/auth.repository.js";
import type { Role } from "../../generated/prisma/enums.js";
import { envConfig } from "../config/env.config.js";

export const authenticateUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = extractBearerToken(req.headers["authorization"]);
    if (!token) return next(new UnauthorizedError("Authentication token missing"));

    const decoded = verifyJwt<{ userId: string; role: Role }>(
      token,
      envConfig.jwt.accessSecret
    );

    const user = await AuthRepository.findUserById(decoded.userId);
    if (!user) return next(new NotFoundError("User not found"));

    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") return next(new UnauthorizedError("Token expired"));
    if (error.name === "JsonWebTokenError") return next(new UnauthorizedError("Invalid token"));
    next(error);
  }
};
export const authorizeUser = (allowedRoles: Role[])=> {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;
    if (!allowedRoles.includes(user.role)) {
      return next(new ForbiddenError("You do not have permission to perform this action."));
    }
    next();
  };
}