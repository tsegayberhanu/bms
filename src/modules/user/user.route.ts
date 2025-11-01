import { Router } from "express";
import { UserController } from "./user.controller.js";
import { authenticateUser, authorizeUser } from "../../shared/middlewares/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";

const userRouter = Router();

userRouter.get(
  "/",
  authenticateUser,
  authorizeUser([Role.ADMIN]),
  UserController.getAllUsers
);

userRouter.get(
  "/:id",
  authenticateUser,
  UserController.getUserById
);

export default userRouter;
