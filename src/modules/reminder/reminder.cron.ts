import cron from "node-cron";
import { ReminderService } from "./reminder.service.js";
import { ReminderSender } from "./reminder.sender.js";
import { logger } from "../../shared/utils/index.js";
import { CRON_SCHEDULES } from "../../shared/config/index.js";

// ---------- GENERATE REMINDERS ----------
cron.schedule(CRON_SCHEDULES.REMINDER_GENERATION, async () => {
  try {
    logger.info("Starting reminder generation job...");
    await ReminderService.generateReminders();
    logger.info("Reminder generation job completed.");
  } catch (err: any) {
    logger.error(`Reminder generation job failed: ${err.message}`);
  }
});

// ---------- SEND PENDING REMINDERS ----------
cron.schedule(CRON_SCHEDULES.REMINDER_SENDING, async () => {
  try {
    logger.info("Starting reminder sending job...");
    await ReminderSender.sendAllPending();
    logger.info("Reminder sending job completed.");
  } catch (err: any) {
    logger.error(`Reminder sending job failed: ${err.message}`);
  }
});
