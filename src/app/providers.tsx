"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthHydrator } from "@/components/providers/auth-hydrator";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthHydrator />
      {children}
    </QueryProvider>
  );
}
