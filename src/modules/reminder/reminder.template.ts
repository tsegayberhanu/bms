import type { TemplateKeys } from "./reminder.type.js";

export const ReminderTemplates = {
  UPCOMING: "Hello dear {{customerName}}, your bill '{{billTitle}}' has an outstanding amount of {{unpaidAmount}} due on {{dueDate}}. Please ensure timely payment.",
  DUE: "Hello dear {{customerName}}, your bill '{{billTitle}}' is due today. Remaining unpaid amount: {{unpaidAmount}}. Kindly pay as soon as possible.",
  OVERDUE: "Hello dear {{customerName}}, your bill '{{billTitle}}' is overdue since {{dueDate}}. Outstanding amount: {{unpaidAmount}}. Please settle immediately.",
  ASSIGNED: "Hello dear {{customerName}}, a new bill '{{billTitle}}' has been assigned to you. Amount due: {{unpaidAmount}}, due on {{dueDate}}."
};


export function renderTemplate(template:TemplateKeys , variables: Record<string, string | number>) {
  return template.replace(/{{(.*?)}}/g, (_, key) => variables[key.trim()]?.toString() || "");
}