import { z } from "zod";
import { Role } from "../../generated/prisma/enums.js";

const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[@$!%*?&]/, "Password must contain at least one special character (@$!%*?&)");

export const registerSchema = z.object({
  email: z.email(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: strongPassword,
  role: z.enum(Role).optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
