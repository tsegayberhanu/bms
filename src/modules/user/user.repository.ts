import { prisma } from "../../shared/config/index.js";
import { Role } from "../../generated/prisma/enums.js";
import type { User } from "../../generated/prisma/client.js";

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
  static async findUserByEmail(email: string):Promise<User|null> {
    return await prisma.user.findUnique({ where: { email } });
  }
  static async findUserById(id: string):Promise<User|null> {
    return await prisma.user.findUnique({ where: { id } });
  }
  static async createUser(input: {name:string, email:string, password:string, role:Role}):Promise<User> {
    return await prisma.user.create({ data: input });
  }
  
}
