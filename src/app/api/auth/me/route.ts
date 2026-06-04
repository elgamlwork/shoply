import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME } from "@/lib/auth/cookies";
import { verifyToken } from "@/lib/auth/jwt";

export async function GET() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ user: null });

  const payload = await verifyToken(token);
  if (!payload) {
    const res = NextResponse.json({ user: null });
    res.cookies.delete(COOKIE_NAME);
    return res;
  }

  return NextResponse.json({
    user: {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      image: payload.image,
      provider: payload.provider,
    },
  });
}
