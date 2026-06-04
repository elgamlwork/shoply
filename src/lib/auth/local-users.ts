"use client";

import type { AuthUser } from "@/types/auth";

const STORE_KEY = "shoply:registered-users";

type StoredUser = AuthUser & { passwordHash: string };

async function hash(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function toPublicUser(stored: StoredUser): AuthUser {
  return {
    id: stored.id,
    username: stored.username,
    email: stored.email,
    firstName: stored.firstName,
    lastName: stored.lastName,
    image: stored.image,
    provider: stored.provider,
  };
}

function readAll(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeAll(users: StoredUser[]): void {
  window.localStorage.setItem(STORE_KEY, JSON.stringify(users));
}

export type LocalRegisterInput = {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export async function registerLocalUser(input: LocalRegisterInput): Promise<AuthUser> {
  const users = readAll();
  if (
    users.some(
      (u) =>
        u.username.toLowerCase() === input.username.toLowerCase() ||
        u.email.toLowerCase() === input.email.toLowerCase(),
    )
  ) {
    throw new Error("A user with that email or username already exists on this device.");
  }
  const passwordHash = await hash(input.password);
  const user: StoredUser = {
    id: `local-${Date.now().toString(36)}`,
    username: input.username,
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    provider: "local",
    passwordHash,
  };
  users.push(user);
  writeAll(users);
  return toPublicUser(user);
}

export async function authenticateLocalUser(
  identifier: string,
  password: string,
): Promise<AuthUser | null> {
  const users = readAll();
  const lookup = identifier.toLowerCase();
  const match = users.find(
    (u) =>
      u.username.toLowerCase() === lookup || u.email.toLowerCase() === lookup,
  );
  if (!match) return null;
  const pwHash = await hash(password);
  if (pwHash !== match.passwordHash) return null;
  return toPublicUser(match);
}
