import type { Request, Response, NextFunction } from "express";
import { reminderFilterSchema } from "./reminder.validation.js";
import { APIResponder, parseWithSchema } from "../../shared/utils/index.js";
import { ReminderService } from "./reminder.service.js";

export class ReminderController {
  static async getReminders(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = parseWithSchema(reminderFilterSchema, req.query);
      const data = await ReminderService.getReminders(req.user!, filters);
      APIResponder.ok(res, data, "REMINDERS_FETCHED", "Reminders retrieved successfully.");
    } catch (err) {
      next(err);
    }
  }
}
