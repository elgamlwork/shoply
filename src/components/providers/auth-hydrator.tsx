"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth/store";

export function AuthHydrator() {
  const hydrate = useAuthStore((s) => s.hydrateFromMe);
  useEffect(() => {
    void hydrate();
  }, [hydrate]);
  return null;
}
