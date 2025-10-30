import express from "express";
import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { notFoundHandler } from "./shared/middlewares/index.js";
import { errorHandlerMiddleware } from "./shared/middlewares/index.js";
import authRouter from "./modules/auth/auth.route.js";
import { AuthRepository } from "./modules/auth/auth.repository.js";
import { billRouter } from "./modules/bill/index.js";
const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/bills", billRouter);



app.use("/api/health", async (_req: Request, res: Response) => {
  res.json({
    status:"success",
    message:"server running healthy"
  })
});

app.use("/api/users", async (_req: Request, res: Response) => {
  const users = await AuthRepository.getAllUsers()
  res.status(200).json(users)
});

app.use(notFoundHandler);
app.use(errorHandlerMiddleware)
export default app;
