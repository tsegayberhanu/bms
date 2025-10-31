import type { Prisma } from "@prisma/client/scripts/default-index.js";
import type { ReminderFilter } from "./reminder.type.js";
import type { PrismaClient, Reminder } from "../../generated/prisma/client.js";
import { prisma } from "../../shared/config/index.js";

export class ReminderRepository {
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
  ): Promise<Reminder[]> {
    const client = tx ?? prisma;

    return await client.reminder.findMany({
      where: {
        customerId: filters.customerId,
        billId: filters.billId,
        type: filters.type,
        status: filters.status,
        createdAt: {
          gte: filters.createdFromDate,
          lte: filters.createdToDate
        },
        sentAt: {
          gte: filters.sentFromDate,
          lte: filters.sentToDate
        }
      },
      include: {
        bill: true,
        customer: true
      },
      orderBy: { createdAt: "desc" }
    });
  }
}
