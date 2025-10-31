import z from "zod";
import { ReminderStatus, ReminderType } from "../../generated/prisma/enums.js";

export const reminderFilterSchema = z.object({
  customerId: z.uuid().optional(),
  billId: z.uuid().optional(),
  type: z.enum(ReminderType).optional(),
  status: z.enum(ReminderStatus).optional(),

  createdFromDate: z.coerce.date().optional(),
  createdToDate: z.coerce.date().optional(),

  sentFromDate: z.coerce.date().optional(),
  sentToDate: z.coerce.date().optional()
});