import { envConfig } from "./env.config.js";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "./constants.config.js";
import type { Secret } from "jsonwebtoken";

export const jwtConfig = {
  access: {
    secret: envConfig.jwt.accessSecret as Secret,
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  },
  refresh: {
    secret: envConfig.refreshSecret as Secret,
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  },
};
