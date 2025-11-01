import { Role } from "../../generated/prisma/enums.js";
import type { RequestUser } from "../auth/auth.types.js";
import { AnalyticsRepository } from "./analytics.repository.js";

export class AnalyticsService {
  static async getCollectionRate(authUser: RequestUser, range:{startDate?: Date, endDate?: Date}) {
    const isAdmin = authUser.role === Role.ADMIN;
    const billerId = !isAdmin ? authUser.userId : undefined;

    const { totalBillAmount, collectedAmount } =
      await AnalyticsRepository.getCollectionStats(billerId, range);

    if (totalBillAmount === 0) {
      return {
        collectionRatePercent: 0,
        totalBillAmount,
        collectedAmount,
      };
    }

    const collectionRate =
      (Number(collectedAmount) / Number(totalBillAmount)) * 100;

    return {
      collectionRatePercent: Number(collectionRate.toFixed(2)),
      totalBillAmount,
      collectedAmount,
    };
  }
  static async getBillStatusSummary(
    authUser: RequestUser,
    range:{startDate?: Date, endDate?: Date}
  ) {
    const isAdmin = authUser.role === Role.ADMIN;
    const billerId = !isAdmin ? authUser.userId : undefined;
    const dateRange = range.startDate || range.endDate ? range : undefined;
    const data = await AnalyticsRepository.getBillStatusSummary(billerId, dateRange);

    return data;
  }
  static async getOutstandingPayments(
   authUser: RequestUser,
    range:{startDate?: Date,
    endDate?: Date
    }
  ) {
    const isAdmin = authUser.role === Role.ADMIN;
    const billerId = !isAdmin ? authUser.userId : undefined;
    const dateRange = range.startDate || range.endDate ? range : undefined;
    const data = await AnalyticsRepository.getOutstandingPayments(billerId, dateRange);

    return data;
  }
  static async getCustomerSpending(
    authUser: RequestUser,
    range:{startDate?: Date,
    endDate?: Date
    }
  ) {
    const isAdmin = authUser.role === Role.ADMIN;
    const billerId = !isAdmin ? authUser.userId : undefined;
    const dateRange = range.startDate || range.endDate ? range : undefined;
    const data = await AnalyticsRepository.getCustomerSpending(billerId, dateRange);
    return data;
  }
  static async getReminderEffectiveness(
    authUser: RequestUser,
    range:{startDate?: Date,
    endDate?: Date
    }
  ) {
    const isAdmin = authUser.role === Role.ADMIN;
    const billerId = !isAdmin ? authUser.userId : undefined;
    const dateRange = range.startDate || range.endDate ? range : undefined;

    const reminders = await AnalyticsRepository.getReminderEffectiveness(billerId, dateRange);

    const result: {
      type: string;
      conversionRateFull: number;
      conversionRatePartial: number;
    }[] = [];

    const types: string[] = ["ASSIGNED", "UPCOMING", "DUE", "OVERDUE"];

    for (const type of types) {
      const remindersOfType = reminders.filter(r => r.type === type);
      const total = remindersOfType.length;

      let fullCount = 0;
      let partialCount = 0;

      remindersOfType.forEach(r => {
        const paymentsAfter = r.bill.payments.filter(p => p.createdAt > r.sentAt!);
        const totalPaid = paymentsAfter.reduce((sum, p) => sum + Number(p.amount), 0);
        const remaining = Number(r.bill.amount) - totalPaid;

        if (r.bill.status === "PAID" || remaining <= 0) fullCount++;
        else if (totalPaid > 0) partialCount++;
      });

      result.push({
        type,
        conversionRateFull: total ? parseFloat(((fullCount / total) * 100).toFixed(1)) : 0,
        conversionRatePartial: total ? parseFloat(((partialCount / total) * 100).toFixed(1)) : 0,
      });
    }

    return result;
  }
  static async getReminderStatusDistribution(
    authUser: RequestUser,
    range:{startDate?: Date,
    endDate?: Date
    }
  ) {
    const isAdmin = authUser.role === Role.ADMIN;
    const billerId = !isAdmin ? authUser.userId : undefined;
    const dateRange = range.startDate || range.endDate ? range : undefined;

    const reminders = await AnalyticsRepository.getReminderStatusDistribution(billerId, dateRange);

    const types: string[] = ["ASSIGNED", "UPCOMING", "DUE", "OVERDUE"];
    const result: any[] = [];

    for (const type of types) {
      const remindersOfType = reminders.filter(r => r.type === type);
      const pending = remindersOfType.filter(r => r.status === "PENDING").length;
      const sent = remindersOfType.filter(r => r.status === "SENT").length;
      const cancelled = remindersOfType.filter(r => r.status === "CANCELLED").length;

      result.push({ type, pending, sent, cancelled });
    }

    return result;
  }
  
}
