import { ReminderRepository } from "./reminder.repository.js";
import {
  Role,
  ReminderStatus,
  BillStatus,
  ReminderType,
} from "../../generated/prisma/client.js";
import type { RequestUser } from "../auth/auth.types.js";
import type { ReminderFilter } from "./reminder.type.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../shared/errors/http-errors.js";
import { BillRepository } from "../bill/index.js";

export class ReminderService {
  static async getReminders(authUser: RequestUser, filters: ReminderFilter) {
    const filter: ReminderFilter = { ...filters };

    if (authUser.role === Role.CUSTOMER) {
      filter.customerId = authUser.userId;
    }

    if (
      filters.customerId &&
      authUser.role === Role.CUSTOMER &&
      filters.customerId !== authUser.userId
    ) {
      throw new ForbiddenError(
        "Forbidden: Cannot view other customer's reminders"
      );
    }

    if (
      filter.createdFromDate &&
      filter.createdToDate &&
      filter.createdFromDate > filter.createdToDate
    ) {
      throw new BadRequestError("fromDate must be before toDate");
    }

    if (
      filter.sentFromDate &&
      filter.sentToDate &&
      filter.sentFromDate > filter.sentToDate
    ) {
      throw new BadRequestError("sentFromDate must be before sentToDate");
    }

    if (
      filter.status === ReminderStatus.SENT &&
      !filter.sentFromDate &&
      !filter.sentToDate
    ) {
      throw new BadRequestError(
        "Must provide sent date range when filtering SENT reminders"
      );
    }

    return ReminderRepository.getReminders(filter);
  }
  static async generateReminders() {
    const today = new Date();

    const bills = await BillRepository.getBills({
      status: { not: BillStatus.PAID },
    });

    for (const bill of bills) {
      let type: ReminderType | null = null;
      const diffDays = Math.ceil(
        (bill.dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays > 3) type = ReminderType.UPCOMING;
      else if (diffDays >= 0) type = ReminderType.DUE;
      else type = ReminderType.OVERDUE;

      if (type) {
        await ReminderRepository.createReminder({
          type,
          billId: bill.id,
          customerId: bill.customerId,
        });

        // logger.info(`Generated ${type} reminder for bill ${bill.id}`);
      }
    }
  }
  static async getReminderById(authUser: RequestUser, reminderId: string) {
    if (!reminderId) {
      throw new BadRequestError("reminderId is required");
    }

    const reminder = await ReminderRepository.findById(reminderId);

    if (!reminder) {
      throw new NotFoundError("Reminder not found");
    }

    if (
      authUser.role === Role.CUSTOMER &&
      reminder.customerId !== authUser.userId
    ) {
      throw new ForbiddenError("Cannot access this reminder");
    }

    if (
      authUser.role === Role.BILLER &&
      reminder.bill.billerId !== authUser.userId
    ) {
      throw new ForbiddenError("Cannot access this reminder");
    }

    return reminder;
  }
}
