import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-[var(--color-ink)]"
          aria-label="Shoply home"
        >
          Shoply
          <span className="ml-2 align-super text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">
            edit
          </span>
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-12">{children}</main>
      <footer className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 text-[11px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
        <span>© {new Date().getFullYear()} Shoply Studio</span>
        <span>Spring &apos;26</span>
      </footer>
    </div>
  );
}
