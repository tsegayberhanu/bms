import type { User } from "../../generated/prisma/client.js";
import type { Role } from "../../generated/prisma/enums.js";
import { prisma } from "../../shared/config/index.js";

export class AuthRepository{
  static async findUserByEmail(email: string):Promise<User|null> {
    return await prisma.user.findUnique({ where: { email } });
  }
  static async findUserById(id: string):Promise<User|null> {
    return await prisma.user.findUnique({ where: { id } });
  }
  static async createUser(input: {name:string, email:string, password:string, role:Role}):Promise<User> {
    return await prisma.user.create({ data: input });
  }
  static async getAllUsers():Promise<User[]>{
    return await prisma.user.findMany();
  }

};
