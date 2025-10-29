import type { NextFunction, Request, Response } from "express";
import { AuthService } from "./auth.service.js";

import type {
  AuthSignInResponseData,
  AuthSignUpResponse,
  SignInInput,
  SignUpInput,
} from "./auth.types.js";
import {
  APIResponder,
  parseExpiry,
  type APIResponse,
} from "../../shared/utils/index.js";
import { REFRESH_TOKEN_EXPIRES_IN } from "../../shared/config/index.js";
import {
  UnauthorizedError,
  ValidationError,
} from "../../shared/errors/index.js";
import { loginSchema, registerSchema } from "./auth.validation.js";

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: parseExpiry(REFRESH_TOKEN_EXPIRES_IN),
};

export class AuthController {
  static async signup(
    req: Request<object, object, SignUpInput>,
    res: Response<APIResponse<AuthSignUpResponse>>,
    next: NextFunction
  ) {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError("Invalid Data", parsed.error);
      }

      const data = parsed.data;
      const result = await AuthService.signup(data);
      APIResponder.created(
        res,
        result,
        "USER_CREATED",
        "User account created successfully."
      );
    } catch (error) {
      next(error);
    }
  }

  static async signin(
    req: Request<unknown, unknown, SignInInput>,
    res: Response<APIResponse<AuthSignInResponseData>>,
    next: NextFunction
  ) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError("Invalid Data", parsed.error);
      }
      const { email, password } = parsed.data;
      const result = await AuthService.signin({ email, password });

      const { refreshToken, ...withoutRefreshToken } = result;

      res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

      APIResponder.ok(
        res,
        withoutRefreshToken,
        "SIGNEDIN",
        "User signed in successfully."
      );
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(
    req: Request,
    res: Response<APIResponse<AuthSignInResponseData>>,
    next: NextFunction
  ) {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        return next(new UnauthorizedError("Refresh token is missing"));
      }

      const result = await AuthService.refreshToken(refreshToken);
      const { refreshToken: newRefreshToken, ...withoutRefreshToken } = result;

      res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);

      APIResponder.ok(
        res,
        withoutRefreshToken,
        "ACCESS_TOKEN_REFRESHED",
        "Access token refreshed successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  static async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const refreshToken = req.cookies.refreshToken;

      console.log(refreshToken, "refresh token")

      if (!refreshToken) {
        return next(new UnauthorizedError("Refresh token is missing"));
      }
      const { userId } = req.user;
      await AuthService.logout(userId);
      res.clearCookie("refreshToken");
      APIResponder.ok(
        res,
        null,
        "LOGGED_OUT",
        "User logged out and all refresh tokens revoked successfully"
      );
    } catch (error) {
      next(error);
    }
  }
}
