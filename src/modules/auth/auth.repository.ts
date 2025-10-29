import type { Role } from "../../generated/prisma/enums.js";
import { prisma } from "../../shared/config/index.js";

export const AuthRepository = {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  async findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async createUser(input: {name:string, email:string, password:string, role:Role}) {
    return prisma.user.create({ data: input });
  },

};
