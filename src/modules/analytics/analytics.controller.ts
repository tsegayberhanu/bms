import type { NextFunction, Request, Response } from "express";
import { AnalyticsService } from "./analytics.service.js";
import { APIResponder, parseWithSchema } from "../../shared/utils/index.js";
import {
  billStatusQuerySchema,
  collectionRateQuerySchema,
  customerSpendingQuerySchema,
  outstandingQuerySchema,
  reminderEffectivenessQuerySchema,
  reminderStatusQuerySchema,
} from "./analytics.validation.js";

export class AnalyticsController {
  static async getCollectionRate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const parsed = parseWithSchema(collectionRateQuerySchema, req.query);
      const data = await AnalyticsService.getCollectionRate(req.user, parsed);

      APIResponder.ok(res, data, "Collection rate fetched successfully");
    } catch (error) {
      next(error);
    }
  }
  static async getBillStatusSummary(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const parsed = parseWithSchema(billStatusQuerySchema, req.query);
      const data = await AnalyticsService.getBillStatusSummary(
        req.user,
        parsed
      );

      APIResponder.ok(res, data, "Bill status summary fetched successfully");
    } catch (error) {
      next(error);
    }
  }
  static async getOutstandingPayments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const parsed = parseWithSchema(outstandingQuerySchema, req.query);

      const data = await AnalyticsService.getOutstandingPayments(
        req.user,
        parsed
      );

      APIResponder.ok(res, data, "Outstanding payments fetched successfully");
    } catch (error) {
      next(error);
    }
  }
  static async getCustomerSpending(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const parsed = parseWithSchema(customerSpendingQuerySchema, req.query);

      const data = await AnalyticsService.getCustomerSpending(req.user, parsed);

      APIResponder.ok(res, data, "Customer spending fetched successfully");
    } catch (error) {
      next(error);
    }
  }
  static async getReminderEffectiveness(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const parsed = parseWithSchema(reminderEffectivenessQuerySchema, req.query);
      const data = await AnalyticsService.getReminderEffectiveness(
        req.user,
        parsed
      );
      APIResponder.ok(res, data, "Reminder effectiveness fetched successfully");
    } catch (error) {
      next(error);
    }
  }
  static async getReminderStatusDistribution(req: Request, res: Response, next:NextFunction) {
    try {
      const parsed = parseWithSchema(reminderStatusQuerySchema, req.query);
      const data = await AnalyticsService.getReminderStatusDistribution(
        req.user,
        parsed
      );
      APIResponder.ok(res, data, "Reminder status distribution fetched successfully");
    } catch (error) {
      next(error);
    }
  }
}
