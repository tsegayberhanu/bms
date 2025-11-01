import z from "zod";
import { Role } from "../../generated/prisma/enums.js";

export const getAllUsersQuerySchema = z.object({
  userId: z.string().optional(),
  role: z.enum(Role).optional(),
});