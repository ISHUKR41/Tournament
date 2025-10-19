import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { randomBytes } from "crypto";

let JWT_SECRET: string;

if (process.env.SESSION_SECRET) {
  JWT_SECRET = process.env.SESSION_SECRET;
} else if (process.env.NODE_ENV === "production") {
  throw new Error("SESSION_SECRET environment variable must be set for production");
} else {
  JWT_SECRET = randomBytes(32).toString('hex');
  console.warn("⚠️  Generated temporary JWT secret for development. Set SESSION_SECRET in production!");
}

export interface JWTPayload {
  id: number;
  username: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const trimmed = cookie.trim();
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) return acc;
    const key = trimmed.substring(0, eqIndex);
    const value = trimmed.substring(eqIndex + 1);
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies.token || null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ message: "Invalid token" });
  }

  (req as any).admin = payload;
  next();
}

export function setTokenCookie(res: Response, token: string) {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = [
    `token=${token}`,
    `HttpOnly`,
    `Path=/`,
    `Max-Age=${7 * 24 * 60 * 60}`,
    `SameSite=Strict`,
    isProduction ? `Secure` : "",
  ]
    .filter(Boolean)
    .join("; ");

  res.setHeader("Set-Cookie", cookieOptions);
}

export function clearTokenCookie(res: Response) {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = [
    `token=`,
    `HttpOnly`,
    `Path=/`,
    `Max-Age=0`,
    `SameSite=Strict`,
    isProduction ? `Secure` : "",
  ]
    .filter(Boolean)
    .join("; ");

  res.setHeader("Set-Cookie", cookieOptions);
}
