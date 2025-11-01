import { prisma } from "../../shared/config/index.js";
import { Role } from "../../generated/prisma/enums.js";

export class UserRepository {
  static async getAllUsers(filters?: { userId?: string; role?: Role }) {
    const where: any = {};
    if (filters?.userId) where.id = filters.userId;
    if (filters?.role) where.role = filters.role;

    return prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }
  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name:true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
