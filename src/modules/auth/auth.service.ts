import { AuthRepository } from "./auth.repository.js";
import { RefreshTokenService } from "../refresh-token/refresh-token.service.js";
import { BCRYPT_SALT_ROUNDS, jwtConfig, ACCESS_TOKEN_EXPIRES_IN } from "../../shared/config/index.js";
import { hashString, compareHash, signJwt } from "../../shared/utils/index.js";
import type { SignInInput, SignUpInput, AuthSignUpResponse, AuthSignInResponseData, RefreshTokenResponseData } from "./auth.types.js";
import { UnauthorizedError, NotFoundError, ForbiddenError } from "../../shared/errors/index.js";

export class AuthService {
  static async signup(data: SignUpInput): Promise<AuthSignUpResponse> {
    const { name, email, password, role = "CUSTOMER" } = data;
    const existing = await AuthRepository.findUserByEmail(email);
    if (existing) throw new UnauthorizedError("User already exists");

    const hashed = await hashString(password, BCRYPT_SALT_ROUNDS);
    const created = await AuthRepository.createUser({ name, email, password: hashed, role });

    return { id: created.id, name: created.name, email: created.email, role: created.role };
  }

  static async signin(credentials: SignInInput): Promise<AuthSignInResponseData> {
    const { email, password } = credentials;
    const user = await AuthRepository.findUserByEmail(email);
    if (!user) throw new UnauthorizedError("Invalid credentials");

    const isMatch = await compareHash(password, user.password);
    if (!isMatch) throw new UnauthorizedError("Invalid credentials");

    const accessToken = signJwt({ userId: user.id, role: user.role }, jwtConfig.access.secret, ACCESS_TOKEN_EXPIRES_IN);
    const refreshToken = await RefreshTokenService.issue(user.id);

    return { accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  static async refreshToken(token: string): Promise<RefreshTokenResponseData> {
    const { valid, userId } = await RefreshTokenService.verify(token);
    if (!valid || !userId) throw new ForbiddenError("Invalid or expired refresh token");

    const user = await AuthRepository.findUserById(userId);
    if (!user) throw new NotFoundError("User not found");

    const accessToken = signJwt({ userId: user.id, role: user.role }, jwtConfig.access.secret, ACCESS_TOKEN_EXPIRES_IN);
    const newRefreshToken = await RefreshTokenService.issue(user.id);

    return { accessToken, refreshToken: newRefreshToken};
  }

  static async logout(userId: string): Promise<void> {
    await RefreshTokenService.revokeAllForUser(userId);
  }
}
