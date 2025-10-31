import { Prisma, PrismaClient, type Bill } from "../../generated/prisma/client.js";
import { BillStatus, ReminderType } from "../../generated/prisma/enums.js";
import { prisma } from "../../shared/config/index.js";
import { NotFoundError } from "../../shared/errors/index.js";
import type {
  BillFilter,
  CreateBillInput,
  UpdateBillInput,
} from "./bill.types.js";

export class BillRepository {
  static async create(data: CreateBillInput): Promise<Bill> {
    try {
      return await prisma.bill.create({
        data: {
          ...data,
          reminders: {
            create: {
              type: ReminderType.ASSIGNED,
              customerId: data.customerId,
            },
          },
        },
      });
    } catch (error: any) {
      // Prisma foreign key violation
      if (
        error.code === "P2003" &&
        error.meta?.constraint === "Bill_customerId_fkey"
      ) {
        throw new NotFoundError(
          `Customer with ID ${data.customerId} does not exist.`
        );
      }
      throw error;
    }
  }
  static async findById(id: string): Promise<Bill | null> {
    return await prisma.bill.findUnique({ where: { id } });
  }
  static async getBills(filter: BillFilter = {}): Promise<Bill[]> {
    const { billerId, customerId, status, dueDateFrom, dueDateTo } = filter;
    return await prisma.bill.findMany({
      where: {
        ...(billerId && { billerId }),
        ...(customerId && { customerId }),
        ...(status && { status }),
        ...(dueDateFrom || dueDateTo
          ? {
              dueDate: {
                ...(dueDateFrom && { gte: dueDateFrom }),
                ...(dueDateTo && { lte: dueDateTo }),
              },
            }
          : {}),
      },
      orderBy: { createdAt: "asc" },
    });
  }
  static async updateById(id: string, data: UpdateBillInput): Promise<Bill> {
    return await prisma.bill.update({
      where: { id },
      data,
    });
  }
  static async deleteById(id: string): Promise<Bill> {
    try {
      return prisma.bill.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundError(`Bill with id ${id} not found`);
      }
      throw error;
    }
  }
  static async findBillWithPayments(
    billId: string, 
    client?: Prisma.TransactionClient | PrismaClient 
  ) {
    const prsma = client || prisma;
    
    return await prsma.bill.findUnique({
      where: { id: billId },
      include: { payments: { select: { amount: true } } }
    });
  }
  static async updateBillStatus(
      billId: string,
      status: BillStatus,
      client?: Prisma.TransactionClient | PrismaClient 
    ): Promise<void> {
      const prsma = client || prisma;
      await prsma.bill.update({
        where: { id: billId },
        data: { status },
      });
    }

}
