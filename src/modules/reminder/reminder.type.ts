import type { Bill, Payment, Reminder, User } from "../../generated/prisma/client.js";
import type { ReminderStatus, ReminderType } from "../../generated/prisma/enums.js";

export type ReminderFilter = {
  customerId?: string;
  billId?: string;
  type?: ReminderType;
  status?: ReminderStatus;

  createdFromDate?: Date;
  createdToDate?: Date;

  sentFromDate?: Date;
  sentToDate?: Date;
}

export type TemplateKeys = "UPCOMING"|"DUE"|"OVERDUE"|"ASSIGNED"
export type PendingReminderWithBillAndPayments = Reminder & {
  bill: Bill & { payments: Payment[] };
  customer: User;
};
