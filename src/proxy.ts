import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME } from "@/lib/auth/cookies";

const PUBLIC_PATHS = ["/login", "/register"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/og") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".png")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const hasValidLooking = token ? isWellFormedJwt(token) : false;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!isPublic && !hasValidLooking) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    if (pathname !== "/") url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (isPublic && hasValidLooking) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.delete("from");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

function isWellFormedJwt(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const padded = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(
      atob(padded + "===".slice((padded.length + 3) % 4)),
    ) as { exp?: number };
    if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
