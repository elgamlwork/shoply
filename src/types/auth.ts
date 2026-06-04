export type AuthProvider = "dummyjson" | "local";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  provider: AuthProvider;
};

export type JWTPayload = {
  sub: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  provider: AuthProvider;
};
