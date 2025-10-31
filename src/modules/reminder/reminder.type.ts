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