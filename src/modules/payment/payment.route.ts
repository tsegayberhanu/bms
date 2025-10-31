import { Router } from "express";
import { PaymentController } from "./payment.controller.js";
import {
  authenticateUser,
  authorizeUser,
} from "../../shared/middlewares/auth.middleware.js";

const paymentRouter = Router();

paymentRouter.post(
  "/",
  authenticateUser,
  authorizeUser(["CUSTOMER"]),
  PaymentController.makePayment
);

paymentRouter.get("/",authenticateUser, PaymentController.getPayments)

export { paymentRouter as paymentRoutes };
