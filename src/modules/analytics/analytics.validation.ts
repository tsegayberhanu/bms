import { z } from "zod";

const today = new Date();

const dateRangeSchema = z
  .object({
    startDate: z
      .coerce
      .date()
      .optional()
      .refine((val) => !val || val <= today, "startDate cannot be in the future"),

    endDate: z
      .coerce
      .date()
      .optional()
      .refine((val) => !val || val <= today, "endDate cannot be in the future"),
  })
  .refine(
    (data) => !data.startDate || !data.endDate || data.startDate < data.endDate,
    { message: "startDate must be before endDate", path: ["startDate"] }
  );

// Export per endpoint for clarity
export const collectionRateQuerySchema = dateRangeSchema;
export const billStatusQuerySchema = dateRangeSchema;
export const outstandingQuerySchema = dateRangeSchema;
export const reminderStatusQuerySchema = dateRangeSchema;
export const reminderEffectivenessQuerySchema = dateRangeSchema;
export const customerSpendingQuerySchema = dateRangeSchema