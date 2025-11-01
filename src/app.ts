import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { notFoundHandler } from "./shared/middlewares/index.js";
import { errorHandlerMiddleware } from "./shared/middlewares/index.js";
import authRouter from "./modules/auth/auth.route.js";
import { billRouter } from "./modules/bill/index.js";
import { paymentRoutes } from "./modules/payment/payment.route.js";
import reminderRouter from "./modules/reminder/reminder.route.js";
import analyticsRouter from "./modules/analytics/analytics.route.js";
import setupSwagger from "./swagger.js";
import userRouter from "./modules/user/user.route.js";
import { APIResponder } from "./shared/utils/api-responder.util.js";

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(hpp());

app.use("/api/auth", authRouter);
app.use("/api/bills", billRouter);
app.use("/api/payments", paymentRoutes);
app.use("/api/reminders", reminderRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/users", userRouter);

app.use("/api/health", async (_req: Request, res: Response) => {
  APIResponder.ok(res, {
    time:new Date().toISOString(),
  });
});

setupSwagger(app);

app.use(notFoundHandler);
app.use(errorHandlerMiddleware);
export default app;
