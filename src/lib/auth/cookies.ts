export const COOKIE_NAME = "shoply_at";

export const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: COOKIE_MAX_AGE,
};
