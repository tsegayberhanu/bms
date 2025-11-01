import { Router } from "express";
import {
  authenticateUser,
  authorizeUser,
} from "../../shared/middlewares/auth.middleware.js";
import { AnalyticsController } from "./analytics.controller.js";
import { Role } from "../../generated/prisma/enums.js";

const analyticsRouter = Router();

analyticsRouter.get(
  "/collection-rate",
  authenticateUser,
  authorizeUser(["ADMIN", "BILLER"]),
  AnalyticsController.getCollectionRate
);
analyticsRouter.get(
  "/bills-status-summary",
  authenticateUser,
  authorizeUser([Role.ADMIN, Role.BILLER]),
  AnalyticsController.getBillStatusSummary
);

analyticsRouter.get(
  "/payments-outstanding",
  authenticateUser,
  authorizeUser([Role.ADMIN, Role.BILLER]),
  AnalyticsController.getOutstandingPayments
);
analyticsRouter.get(
  "/customers-spending",
  authenticateUser,
  authorizeUser([Role.ADMIN, Role.BILLER]),
  AnalyticsController.getCustomerSpending
);

analyticsRouter.get(
  "/reminders-effectiveness",
  authenticateUser,
  authorizeUser([Role.ADMIN, Role.BILLER]),
  AnalyticsController.getReminderEffectiveness
);

analyticsRouter.get(
  "/reminders-status",
  authenticateUser,
  authorizeUser([Role.ADMIN, Role.BILLER]),
  AnalyticsController.getReminderStatusDistribution
);

export default analyticsRouter;
