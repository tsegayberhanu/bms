import type { BillPaymentMode, BillStatus } from "../../generated/prisma/enums.js";

export type CreateBillInput = {
  title: string;
  description?: string; 
  amount: number;
  dueDate: Date;
  billerId: string;
  customerId: string;
  paymentMode?:BillPaymentMode,
};

export type UpdateBillInput = {
  title?: string;
  description?: string ;
  dueDate?: Date;
  status?:BillStatus
};

export type BillFilter = {
  billerId?: string;
  customerId?: string;
  status?: BillStatus | { not?: BillStatus };
  dueDateFrom?: Date; 
  dueDateTo?: Date;
};