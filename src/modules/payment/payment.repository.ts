import type {
  Payment,
  Prisma,
  PrismaClient,
} from "../../generated/prisma/client.js";
import { prisma } from "../../shared/config/index.js";
import type { CreatePaymentInput, PaymentFilter, PaymentWithBill } from "./payment.types.js";
export class PaymentRepository {
  static async findPaymentByTransactionKey(
    transactionKey: string,
    tx: Prisma.TransactionClient
  ): Promise<Payment | null> {
    return await tx.payment.findUnique({ where: { transactionKey } });
  }
  static async createPayment(
    data: CreatePaymentInput,
    tx: Prisma.TransactionClient
  ): Promise<Payment> {
    return await tx.payment.create({ data });
  }
  static async getPaymentsByBillId(
    billId: string,
    prismaInstance?: PrismaClient
  ): Promise<Payment[]> {
    const client = prismaInstance || prisma;
    return await client.payment.findMany({
      where: { billId },
      orderBy: { createdAt: "desc" },
    });
  }
  static async getPayments(filter: PaymentFilter) {
    return await prisma.payment.findMany({
      where: {
        billId: filter.billId,
        customerId: filter.customerId,
        transactionKey: filter.transactionKey,
        createdAt: {
          gte: filter.startDate,
          lte: filter.endDate,
        },
        bill: filter.billerId ? { billerId: filter.billerId } : undefined,
      },
      orderBy: { createdAt: "desc" },
    });
  }
  static async findById(
    paymentId: string,
    tx?: PrismaClient
  ): Promise<PaymentWithBill | null> {
    const client = tx ?? prisma;
    return client.payment.findUnique({
      where: { id: paymentId },
      include: {
        bill: true,
      },
    });
  }
}
