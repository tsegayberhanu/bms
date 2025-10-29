import type { Role } from "../../generated/prisma/enums.js";
import { registerSchema, loginSchema } from "./auth.validation.js";
import { z } from "zod";

export type SignUpInput = z.infer<typeof registerSchema> 
export type SignInInput = z.infer<typeof loginSchema>;

export type AuthSignUpResponse = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type AuthSignInResponseData = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
};

export interface RequestUser {
  userId: string;
  role: Role;
}
export type RefreshTokenResponseData = {
  accessToken: string;
  refreshToken: string;
}
