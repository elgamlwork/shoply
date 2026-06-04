import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth/cookies";
import { signToken } from "@/lib/auth/jwt";

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "https://dummyjson.com";

export async function POST(req: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = (await req.json()) as { username?: string; password?: string };
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const { username, password } = body;
  if (!username || !password) {
    return NextResponse.json(
      { message: "Username and password are required." },
      { status: 400 },
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    return NextResponse.json(
      { message: "Could not reach the authentication service." },
      { status: 503 },
    );
  }

  if (!upstream.ok) {
    const err = (await upstream.json().catch(() => null)) as { message?: string } | null;
    return NextResponse.json(
      { message: err?.message ?? "Invalid credentials." },
      { status: upstream.status === 400 ? 401 : upstream.status },
    );
  }

  const data = (await upstream.json()) as {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    image?: string;
  };

  const user = {
    id: String(data.id),
    username: data.username,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    image: data.image,
    provider: "dummyjson" as const,
  };

  const token = await signToken({ sub: user.id, ...user });

  const res = NextResponse.json({ user });
  res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
  return res;
}
