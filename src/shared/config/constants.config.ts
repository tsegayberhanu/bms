export const ACCESS_TOKEN_EXPIRES_IN = "15m";
export const REFRESH_TOKEN_EXPIRES_IN = "7d";
export const BCRYPT_SALT_ROUNDS = 10;
export const CRON_SCHEDULES = {
  REMINDER_GENERATION: "0 0 * * *", // default: daily at midnight
  REMINDER_SENDING: "0 * * * *",    // default: hourly
};