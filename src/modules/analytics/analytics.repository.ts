import { BillStatus, Role } from "../../generated/prisma/enums.js";
import { prisma } from "../../shared/config/index.js";

export class AnalyticsRepository {
  static async getCollectionStats(
    billerId?: string,
    range?: {
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    const billWhere: any = {};
    if (billerId) billWhere.billerId = billerId;
    if (range?.startDate || range?.endDate) {
      billWhere.createdAt = {
        ...(range.startDate && { gte: range.startDate }),
        ...(range.endDate && { lte: range.endDate }),
      };
    }

    const totalBillAmountAgg = await prisma.bill.aggregate({
      where: billWhere,
      _sum: { amount: true },
    });

    const paymentWhere: any = {};
    if (billerId) paymentWhere.bill = { billerId };
    if (range?.startDate || range?.endDate) {
      paymentWhere.createdAt = {
        ...(range.startDate && { gte: range.startDate }),
        ...(range.endDate && { lte: range.endDate }),
      };
    }

    const collectedAmountAgg = await prisma.payment.aggregate({
      where: paymentWhere,
      _sum: { amount: true },
    });

    return {
      totalBillAmount: totalBillAmountAgg._sum.amount ?? 0,
      collectedAmount: collectedAmountAgg._sum.amount ?? 0,
    };
  }
  static async getBillStatusSummary(
    billerId?: string,
    range?: { startDate?: Date; endDate?: Date }
  ) {
    const where: any = {};
    if (billerId) where.billerId = billerId;
    if (range?.startDate || range?.endDate) {
      where.createdAt = {
        ...(range.startDate && { gte: range.startDate }),
        ...(range.endDate && { lte: range.endDate }),
      };
    }

    const counts: Record<string, number> = {};

    for (const status in BillStatus) {
      counts[status.toLowerCase()] = await prisma.bill.count({
        where: { ...where, status },
      });
    }

    return counts;
  }
  static async getOutstandingPayments(
    billerId?: string,
    range?: { startDate?: Date; endDate?: Date }
  ) {
    const billWhere: any = { status: { in: ["PENDING", "PARTIAL", "OVERDUE"] } };
    if (billerId) billWhere.billerId = billerId;
    if (range?.startDate || range?.endDate) {
      billWhere.createdAt = {
        ...(range.startDate && { gte: range.startDate }),
        ...(range.endDate && { lte: range.endDate }),
      };
    }

    const bills = await prisma.bill.findMany({
      where: billWhere,
      select: {
        amount: true,
        payments: { select: { amount: true } },
      },
    });

    let totalOutstanding = 0;
    let totalUnpaidBills = 0;

    for (const bill of bills) {
      const paid = bill.payments.reduce((sum, p) => sum + Number(p.amount), 0);
      const outstanding = Number(bill.amount) - paid;
      if (outstanding > 0) {
        totalOutstanding += outstanding;
        totalUnpaidBills++;
      }
    }

    return { totalOutstanding, totalUnpaidBills };
  }
  static async getCustomerSpending(
    billerId?: string,
    range?: { startDate?: Date; endDate?: Date }
  ) {
    const billWhere: any = {};
    if (billerId) billWhere.billerId = billerId;
    if (range?.startDate || range?.endDate) {
      billWhere.createdAt = {
        ...(range.startDate && { gte: range.startDate }),
        ...(range.endDate && { lte: range.endDate }),
      };
    }

    const bills = await prisma.bill.findMany({
      where: billWhere,
      select: {
        customerId: true,
        customer: { select: { name: true } },
        amount: true,
        payments: { select: { amount: true } },
      },
    });

    const customerMap: Record<
      string,
      { customerId: string; name: string; totalBilled: number; totalPaid: number }
    > = {};

    for (const bill of bills) {
      const paid = bill.payments.reduce((sum, p) => sum + Number(p.amount), 0);
      if (!customerMap[bill.customerId]) {
        customerMap[bill.customerId] = {
          customerId: bill.customerId,
          name: bill.customer.name,
          totalBilled: 0,
          totalPaid: 0,
        };
      }
      customerMap[bill.customerId].totalBilled += Number(bill.amount);
      customerMap[bill.customerId].totalPaid += paid;
    }

    return Object.values(customerMap).map((c) => ({
      ...c,
      totalBilled: c.totalBilled.toFixed(2),
      totalPaid: c.totalPaid.toFixed(2),
    }));
  }
  static async getReminderEffectiveness(
    billerId?: string,
    range?: { startDate?: Date; endDate?: Date }
  ) {
    const reminders = await prisma.reminder.findMany({
      where: {
        status: "SENT",
        ...(billerId && { bill: { billerId } }),
        ...(range?.startDate && { sentAt: { gte: range.startDate } }),
        ...(range?.endDate && { sentAt: { lte: range.endDate } }),
      },
      include: {
        bill: {
          select: {
            id: true,
            amount: true,
            status: true,
            payments: { select: { amount: true, createdAt: true } },
          },
        },
      },
    });

    return reminders;
  }
  static async getReminderStatusDistribution(
    billerId?: string,
    range?: { startDate?: Date; endDate?: Date }
  ) {
    const reminders = await prisma.reminder.findMany({
      where: {
        ...(billerId && { bill: { billerId } }),
        ...(range?.startDate && { createdAt: { gte: range.startDate } }),
        ...(range?.endDate && { createdAt: { lte: range.endDate } }),
      },
      select: {
        type: true,
        status: true,
      },
    });

    return reminders;
  }
  static async getUsersCountByRole() {
    const admins = await prisma.user.count({ where: { role: Role.ADMIN } });
    const billers = await prisma.user.count({ where: { role: Role.BILLER } });
    const customers = await prisma.user.count({ where: { role: Role.CUSTOMER } });
    return {
      ADMIN: admins,
      BILLER: billers,
      CUSTOMER: customers,
    };
  }
}

