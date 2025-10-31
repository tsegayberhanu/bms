import type { z } from "zod";
import type { createPaymentSchema } from "./payment.validation.js";
import type { Bill, BillStatus, Payment, Prisma } from "../../generated/prisma/client.js";

export type CreatePaymentClientInput = z.infer<typeof createPaymentSchema>;
export type CreatePaymentInput = CreatePaymentClientInput & {
    customerId:string;
}
export type PaymentWithBill = Payment & { bill: Bill };

export type CreatePaymentResult = {
  payment: Payment;
  billStatus: BillStatus;
  amountPaid: Prisma.Decimal;
  remainingAmount: Prisma.Decimal;
  totalPaid: Prisma.Decimal;
}

export type PaymentFilter = {
  billerId?:string;
  billId?: string;
  customerId?: string;
  transactionKey?: string;
  startDate?: Date;
  endDate?: Date;
}