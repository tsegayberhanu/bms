import type { Prisma } from "@prisma/client/scripts/default-index.js";
import type { PendingReminderWithBillAndPayments, ReminderFilter } from "./reminder.type.js";
import {
  ReminderStatus,
  ReminderType,
  type PrismaClient,
} from "../../generated/prisma/client.js";
import { prisma } from "../../shared/config/index.js";

export class ReminderRepository {
  static async createReminder(reminderData: {
    type: ReminderType;
    billId: string;
    customerId: string;
  },  tx?: Prisma.TransactionClient | PrismaClient) {
    const client = tx ?? prisma;
    return client.reminder.create({ data: { ...reminderData } });
  }
  static async cancelPendingReminders(
    billId: string,
    tx: Prisma.TransactionClient
  ): Promise<void> {
    await tx.reminder.updateMany({
      where: { billId, status: "PENDING" },
      data: { status: "CANCELLED" },
    });
  }
  static async getReminders(
    filters: ReminderFilter,
    tx?: Prisma.TransactionClient | PrismaClient
  ){
    const client = tx ?? prisma;

    return await client.reminder.findMany({
      where: {
        customerId: filters.customerId,
        billId: filters.billId,
        type: filters.type,
        status: filters.status,
        createdAt: {
          gte: filters.createdFromDate,
          lte: filters.createdToDate,
        },
        sentAt: {
          gte: filters.sentFromDate,
          lte: filters.sentToDate,
        },
      },
      include: {
        bill: true,
        customer: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
  static async markAsSent(
    reminderId: string,
    tx?: Prisma.TransactionClient | PrismaClient
  ) {
    const client = tx ?? prisma;
    return client.reminder.update({
      where: { id: reminderId },
      data: { status: ReminderStatus.SENT, sentAt: new Date() },
    });
  }
  static async getPendingReminders(
    tx?: Prisma.TransactionClient | PrismaClient
  ): Promise<PendingReminderWithBillAndPayments[]> {
    const client = tx ?? prisma;

    return await client.reminder.findMany({
      where: { status: ReminderStatus.PENDING },
      include: {
        bill: { include: { payments: true } },
        customer: true,
      },
      orderBy: { createdAt: "asc" }, // send oldest first
    });
  }
  static async findById(reminderId: string) {
    return prisma.reminder.findUnique({
      where: { id: reminderId },
      include: {
        bill: true,
        customer: true
      },
    });
  }
}
