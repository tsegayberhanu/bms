import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { authenticateUser } from "../../shared/middlewares/index.js";

const authRouter = Router();

authRouter.post("/signup", AuthController.signup);
authRouter.post("/signin", AuthController.signin);
authRouter.post("/refresh-token", AuthController.refreshToken);
authRouter.post("/logout", authenticateUser, AuthController.logout);



export default authRouter;
