import crypto from "crypto";

export function generateRandomToken(length = 64): string {
  return crypto.randomBytes(length).toString("hex");
}

export function computeTokenHash(token: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(token).digest("hex");
}
