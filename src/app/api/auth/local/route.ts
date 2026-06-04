import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/auth/cookies";
import { signToken } from "@/lib/auth/jwt";

const Schema = z.object({
  id: z.string().min(1).max(64),
  username: z.string().min(3).max(40),
  email: z.string().email(),
  firstName: z.string().max(40).optional(),
  lastName: z.string().max(40).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { message: first?.message ?? "Invalid payload." },
      { status: 400 },
    );
  }

  const { id, username, email, firstName, lastName } = parsed.data;
  const user = {
    id,
    username,
    email,
    firstName,
    lastName,
    provider: "local" as const,
  };
  const token = await signToken({ sub: id, ...user });

  const res = NextResponse.json({ user });
  res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
  return res;
}
