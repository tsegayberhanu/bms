import { Router } from "express";
import { ReminderController } from "./reminder.controller.js";
import { authenticateUser } from "../../shared/middlewares/auth.middleware.js";

const reminderRouter = Router();
reminderRouter.get("/", authenticateUser    , ReminderController.getReminders);

export default reminderRouter;
