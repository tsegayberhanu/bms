import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

export function signJwt(payload: object, secret: Secret, expiresIn: string): string {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
}

export function verifyJwt<T>(token: string, secret: string): T {
  return jwt.verify(token, secret) as T;
}

export function extractBearerToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  const [type, token] = authHeader.split(" ");
  return type === "Bearer" && token ? token : null;
}