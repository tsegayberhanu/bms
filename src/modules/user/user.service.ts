import type { RequestUser } from "../auth/auth.types.js";
import { UserRepository } from "./user.repository.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../shared/errors/http-errors.js";
import { Role } from "../../generated/prisma/enums.js";

export class UserService {
  static async getAllUsers(filters?: { userId?: string; role?: Role }) {
    return UserRepository.getAllUsers(filters);
  }
  static async getUserById(authUser: RequestUser, id: string) {
    if(!id){
       throw new BadRequestError("id not provided")
    }
    if (authUser.role !== Role.ADMIN && authUser.userId !== id) {
      throw new ForbiddenError("Cannot view other user's details");
    }
    const user = await UserRepository.getUserById(id);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }
}
