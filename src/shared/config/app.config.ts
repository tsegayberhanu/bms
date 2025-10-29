import { envConfig } from "./env.config.js";

export const appConfig = {
  nodeEnv: envConfig.nodeEnv,
  port: envConfig.port,
  isDev: envConfig.nodeEnv === "development",
  isProd: envConfig.nodeEnv === "production",
};
