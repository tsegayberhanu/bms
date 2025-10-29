import { RefreshTokenRepository } from "./refresh-token.repository.js";
import {
  envConfig,
  REFRESH_TOKEN_EXPIRES_IN,
} from "../../shared/config/index.js";
import {
  generateRandomToken,
  computeTokenHash,
} from "../../shared/utils/index.js";
import { parseExpiry } from "../../shared/utils/index.js";

const HMAC_SECRET = envConfig.refreshSecret;

export class RefreshTokenService {
  static async issue(userId: string): Promise<string> {
    const rawToken = generateRandomToken();
    const tokenHash = computeTokenHash(rawToken, HMAC_SECRET);
    const expiresAt = new Date(
      Date.now() + parseExpiry(REFRESH_TOKEN_EXPIRES_IN)
    );
    await RefreshTokenRepository.rotate(userId, tokenHash, expiresAt); // revoke old & insert new
    return rawToken;
  }
  static async verify(
    token: string
  ): Promise<{ valid: boolean; userId?: string }> {
    const tokenHash = computeTokenHash(token, HMAC_SECRET);
    const record = await RefreshTokenRepository.findActiveByHash(tokenHash);
    if (!record) return { valid: false };
    return { valid: true, userId: record.userId };
  }
  static async revokeAllForUser(userId: string): Promise<void> {
    await RefreshTokenRepository.revokeAll(userId);
  }
}
