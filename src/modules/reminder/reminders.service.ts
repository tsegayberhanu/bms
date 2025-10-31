import { ReminderRepository } from "./reminder.repository.js";
import { Role, ReminderStatus } from "../../generated/prisma/client.js";
import type { RequestUser } from "../auth/auth.types.js";
import type { ReminderFilter } from "./reminder.type.js";
import { BadRequestError, ForbiddenError } from "../../shared/errors/http-errors.js";

export class ReminderService {
  static async getReminders(
    authUser: RequestUser,
    filters: ReminderFilter
  ) {
    const filter: ReminderFilter = { ...filters };

    if (authUser.role === Role.CUSTOMER) {
      filter.customerId = authUser.userId; 
    }

    if (filters.customerId && authUser.role === Role.CUSTOMER && filters.customerId !== authUser.userId) {
      throw new ForbiddenError("Forbidden: Cannot view other customer's reminders");
    }

    if (filter.createdFromDate && filter.createdToDate && filter.createdFromDate > filter.createdToDate) {
      throw new BadRequestError("fromDate must be before toDate");
    }

    if (filter.sentFromDate && filter.sentToDate && filter.sentFromDate > filter.sentToDate) {
      throw new BadRequestError("sentFromDate must be before sentToDate");
    }

    if (filter.status === ReminderStatus.SENT && !filter.sentFromDate && !filter.sentToDate) {
      throw new BadRequestError("Must provide sent date range when filtering SENT reminders");
    }


    return ReminderRepository.getReminders(filter);
  }
}
