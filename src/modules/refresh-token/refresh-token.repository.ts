import { prisma } from "../../shared/config/db.config.js";

export class RefreshTokenRepository {
  static async rotate(userId: string, tokenHash: string, expiresAt: Date) {
    const [_, createdToken] = await prisma.$transaction([
      prisma.refreshToken.updateMany({
        where: { userId, revoked: false },
        data: { revoked: true },
      }),
      prisma.refreshToken.create({
        data: { userId, token: tokenHash, expiresAt },
      }),
    ]);
    return createdToken;
  }

  static async findActiveByHash(tokenHash: string) {
    return prisma.refreshToken.findFirst({
      where: {
        token: tokenHash,
        revoked: false,
        expiresAt: { gt: new Date() },
      },
    });
  }

  static async revokeAll(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }
}
