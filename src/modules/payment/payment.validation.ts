import { z } from "zod";

export const createPaymentSchema = z.object({
  transactionKey: z.string().min(3), // client-provided idempotency key
  billId: z.uuid(),
  amount: z.number().positive(),
  note: z.string().optional()
});


export const paymentFilterSchema = z.object({
  billId: z.uuid().optional(),
  billerId:z.uuid().optional(),
  customerId: z.uuid().optional(),
  transactionKey: z.string().optional(),

  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});
