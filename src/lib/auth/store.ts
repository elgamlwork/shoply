"use client";

import { create } from "zustand";
import type { AuthUser } from "@/types/auth";

type AuthStatus = "unknown" | "authenticated" | "anonymous";

type AuthState = {
  user: AuthUser | null;
  status: AuthStatus;
  setUser: (user: AuthUser | null) => void;
  hydrateFromMe: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "unknown",
  setUser: (user) => set({ user, status: user ? "authenticated" : "anonymous" }),
  hydrateFromMe: async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) {
        set({ user: null, status: "anonymous" });
        return;
      }
      const data = (await res.json()) as { user: AuthUser | null };
      set({
        user: data.user,
        status: data.user ? "authenticated" : "anonymous",
      });
    } catch {
      set({ user: null, status: "anonymous" });
    }
  },
  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore: logout is best-effort
    }
    set({ user: null, status: "anonymous" });
  },
}));
