import type { Prisma } from "../../generated/prisma/client.js";

export type BillWithPayments = {
    billerId: string;
    amount: Prisma.Decimal;
    payments: {
        amount: Prisma.Decimal;
    }[];
};

export type AggregatedData = {
    [billerId: string]: {
        totalBilled: number;
        totalPaid: number;
    };
}
export type BillerCollections = {
  billerId: string;
  totalBilled: Prisma.Decimal;
  totalPaid: Prisma.Decimal;
  collectionRate: number; 
}
export type DateRange ={
  startDate: Date;
  endDate: Date;
}