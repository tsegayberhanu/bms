import type { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.js";
import { APIResponder, parseWithSchema } from "../../shared/utils/index.js";
import { getAllUsersQuerySchema } from "./user.validation.js";

export class UserController {
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = parseWithSchema(getAllUsersQuerySchema, req.query);
      const users = await UserService.getAllUsers(filters);
      APIResponder.ok(res, users, "Users fetched successfully");
    } catch (error) {
      next(error);
    }
  }
  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(req.user, id);
      APIResponder.ok(res, user, "User fetched successfully");
    } catch (error) {
      next(error);
    }
  }
}
