import { z } from "zod";

export const createBillSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  amount: z.number().positive(),
  dueDate: z
    .string()
    .refine((str) => !isNaN(Date.parse(str)), { message: "Invalid date" })
    .transform((str) => new Date(str))
    .refine((date) => date > new Date(), {
      message: "Due date must be in the future",
    }),
  customerId: z.uuid(),
}).strict();

export const updateBillSchema = z
  .object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    dueDate: z
    .string()
    .refine((str) => !isNaN(Date.parse(str)), { message: "Invalid date" })
    .transform((str) => new Date(str))
    .refine((date) => date > new Date(), {
      message: "Due date must be in the future",
    })
      .optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (!data.title && !data.description && !data.dueDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "At least one field (title, description, or dueDate) must be provided for update.",
        path: ["_error"],
      });
    }
  });
