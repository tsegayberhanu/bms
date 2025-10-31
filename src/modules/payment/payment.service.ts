import {
  BillStatus,
  Prisma,
  BillPaymentMode,
  Role,
} from "../../generated/prisma/client.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../shared/errors/http-errors.js";
import { prisma } from "../../shared/config/index.js";
import type {
  CreatePaymentClientInput,
  CreatePaymentResult,
  PaymentFilter,
} from "./payment.types.js";
import { PaymentRepository } from "./payment.repository.js";
import { ReminderRepository } from "../reminder/reminder.repository.js";
import type { RequestUser } from "../auth/auth.types.js";
import { BillRepository } from "../bill/bill.repository.js";
export class PaymentService {
  static async makePayment(
    authUser: RequestUser,
    input: CreatePaymentClientInput
  ): Promise<CreatePaymentResult> {
    return await prisma.$transaction(async (tx) => {
      const existingPayment =
        await PaymentRepository.findPaymentByTransactionKey(
          input.transactionKey,
          tx
        );
      if (existingPayment) {
        throw new BadRequestError("Duplicate transaction key");
      }

      const bill = await BillRepository.findBillWithPayments(input.billId, tx);
      if (!bill) {
        throw new BadRequestError("Bill not found");
      }

      if (bill.customerId !== authUser.userId) {
        throw new ForbiddenError(
          "you can't pay for a bill you are not assigned."
        );
      }
      const totalPaid = bill.payments.reduce(
        (sum, payment) => sum.plus(payment.amount),
        new Prisma.Decimal(0)
      );

      if (totalPaid.greaterThanOrEqualTo(bill.amount)) {
        throw new BadRequestError("Bill is already fully paid");
      }

      const paymentAmount = new Prisma.Decimal(input.amount);
      const remainingAmount = bill.amount.minus(totalPaid);

      if (paymentAmount.lessThanOrEqualTo(0)) {
        throw new BadRequestError("Payment amount must be greater than zero");
      }

      if (paymentAmount.greaterThan(remainingAmount)) {
        throw new BadRequestError(
          "Payment amount exceeds remaining bill amount"
        );
      }

      if (
        bill.paymentMode === BillPaymentMode.FULL_ONLY &&
        paymentAmount.lessThan(bill.amount)
      ) {
        throw new BadRequestError("This bill requires full payment only");
      }

      const newTotalPaid = totalPaid.plus(paymentAmount);

      const newStatus = this.calculateBillStatus(
        newTotalPaid,
        bill.amount,
        bill.dueDate
      );

      const payment = await PaymentRepository.createPayment(
        { ...input, customerId: authUser.userId },
        tx
      );

      await BillRepository.updateBillStatus(input.billId, newStatus, tx);

      if (newStatus === "PAID") {
        await ReminderRepository.cancelPendingReminders(input.billId, tx);
      }

      return {
        payment,
        billStatus: newStatus,
        amountPaid: paymentAmount,
        remainingAmount: bill.amount.minus(newTotalPaid),
        totalPaid: newTotalPaid,
      };
    });
  }
  private static calculateBillStatus(
    totalPaid: Prisma.Decimal,
    billAmount: Prisma.Decimal,
    dueDate: Date
  ): BillStatus {
    const isOverdue = new Date() > dueDate;

    if (totalPaid.equals(billAmount)) return BillStatus.PAID;
    if (totalPaid.greaterThan(0) && totalPaid.lessThan(billAmount)) {
      return isOverdue ? BillStatus.OVERDUE : BillStatus.PARTIAL;
    }
    return isOverdue ? BillStatus.OVERDUE : BillStatus.PENDING;
  }
  static async getPayments(authUser: RequestUser, filters: PaymentFilter) {
    if (authUser.role === Role.BILLER) {
      filters.billerId = authUser.userId;
    }
    if (authUser.role === Role.CUSTOMER) {
      filters.customerId = authUser.userId;
    }
    return await PaymentRepository.getPayments(filters);
  }
  static async getPaymentById(paymentId: string, authUser: RequestUser) {
    const payment = await PaymentRepository.findById(paymentId);

    if (!payment) throw new NotFoundError("Payment not found");

    if (authUser.role === Role.CUSTOMER) {
      if (payment.customerId !== authUser.userId) {
        throw new ForbiddenError("Access denied: cannot view this payment");
      }
    }

    if (authUser.role === Role.BILLER) {
      if (payment.bill.billerId !== authUser.userId) {
        throw new ForbiddenError("Access denied: cannot view this payment");
      }
    }
    return payment;
  }
}
