import { Prisma } from "../../generated/prisma/client.js";
import { ReminderRepository } from "./reminder.repository.js";
import { renderTemplate } from "./reminder.template.js";
import type { TemplateKeys } from "./reminder.type.js";

export class ReminderSender {
  static async sendAllPending() {
    const reminders = await ReminderRepository.getPendingReminders();

    for (const r of reminders) {
      try {
        const totalPaid = r.bill.payments?.reduce(
          (acc, p) => acc.plus(new Prisma.Decimal(p.amount)),
          new Prisma.Decimal(0)
        ) ?? new Prisma.Decimal(0);
        const unpaidAmount = new Prisma.Decimal(r.bill.amount).minus(totalPaid);

        // Render message from template
        const reminderType = r.type as TemplateKeys;
        const message = renderTemplate(reminderType, {
          customerName: r.customer?.name || "Customer",
          billTitle: r.bill?.title || "Your Bill",
          unpaidAmount: unpaidAmount.toFixed(2),
          dueDate: r.bill?.dueDate.toISOString().split("T")[0],
        });

        const customerEmail = r.customer?.email || "";

        await this.send(r, message, customerEmail);
        await ReminderRepository.markAsSent(r.id);

        console.log(`Reminder SENT for bill ${r.billId} to ${customerEmail}`);

      } catch (err: any) {
        // Log failures (send or DB update) for retry
        console.error(
          `Failed to send reminder ${r.type} for bill ${r.billId} to ${r.customerId}: ${err.message}`
        );
      }
    }
  }
  // Simulated email send
  private static async send(reminder: any, message: string, email: string) {
    console.log("[SIMULATED SEND]");
    console.log(`To: ${email}`);
    console.log(`Customer: ${reminder.customer?.name}`);
    console.log(`Bill: ${reminder.bill?.title}`);
    console.log(`[MESSAGE] ${message}`);

    // Random success/failure for simulation
    const success = Math.random() > 0.05;
    if (!success) throw new Error("Simulated sending failure");

    // Simulate async delay
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
