import type { NextFunction, Request, Response } from "express";
import { PaymentService } from "./payment.service.js";
import {
  createPaymentSchema,
  paymentFilterSchema,
} from "./payment.validation.js";
import {
  APIResponder,
  parseWithSchema,
  type APIResponse,
} from "../../shared/utils/index.js";
import type { RequestUser } from "../auth/auth.types.js";
import type { CreatePaymentClientInput } from "./payment.types.js";

export class PaymentController {
  static async makePayment(
    req: Request<unknown, unknown, CreatePaymentClientInput>,
    res: Response<APIResponse>,
    next: NextFunction
  ) {
    try {
      const data = parseWithSchema(createPaymentSchema, req.body);
      const authUser = req.user as RequestUser;
      const payment = await PaymentService.makePayment(authUser, data);
      APIResponder.created(
        res,
        payment,
        "PAYMENT_CREATED",
        "Payment processed successfully."
      );
    } catch (error) {
      next(error);
    }
  }
  static async getPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = parseWithSchema(paymentFilterSchema, req.query);
      const payments = await PaymentService.getPayments(req.user, filters);
      APIResponder.ok(
        res,
        payments,
        "PAYMENTS_FETCHED",
        "Payments fetched successfully."
      );
    } catch (error) {
      next(error);
    }
  }
}
