import { SignJWT, jwtVerify } from "jose";
import type { JWTPayload } from "@/types/auth";

const SECRET = process.env.JWT_SECRET ?? "dev-only-secret-please-change-1234567890";
const key = new TextEncoder().encode(SECRET);

export async function signToken(payload: JWTPayload, expiresIn = "24h"): Promise<string> {
  return new SignJWT({
    username: payload.username,
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    image: payload.image,
    provider: payload.provider,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setSubject(payload.sub)
    .setIssuer("shoply")
    .setExpirationTime(expiresIn)
    .sign(key);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, { issuer: "shoply" });
    return {
      sub: String(payload.sub ?? ""),
      username: String(payload.username ?? ""),
      email: String(payload.email ?? ""),
      firstName: payload.firstName as string | undefined,
      lastName: payload.lastName as string | undefined,
      image: payload.image as string | undefined,
      provider: (payload.provider as "dummyjson" | "local") ?? "local",
    };
  } catch {
    return null;
  }
}
