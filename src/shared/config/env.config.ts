import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}`),
});

export const envConfig = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3000,
  refreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET!,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_TOKEN_SECRET!,
  },
};
