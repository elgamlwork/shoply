"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Heart, LogOut, Search, X } from "lucide-react";
import { useAuthStore } from "@/lib/auth/store";
import { useFavoritesStore } from "@/lib/favorites/store";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils/cn";

export function SiteHeader() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const favoritesCount = useFavoritesStore((s) => s.ids.length);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target as Node)
      ) {
        setAccountOpen(false);
      }
    }
    if (accountOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [accountOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchValue.trim();
    const url = new URL(window.location.href);
    if (q) url.searchParams.set("q", q);
    else url.searchParams.delete("q");
    url.pathname = "/";
    router.push(`${url.pathname}${url.search}`);
    setSearchOpen(false);
  }

  async function handleLogout() {
    await logout();
    router.push("/login");
    router.refresh();
  }

  const initials = user
    ? (user.firstName?.[0] ?? user.username[0] ?? "").toUpperCase() +
      (user.lastName?.[0] ?? "").toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[var(--color-bg)]/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          aria-label="Shoply home"
          className="font-display text-2xl tracking-tight text-[var(--color-ink)]"
        >
          Shoply
          <span className="ml-2 align-super text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">
            edit
          </span>
        </Link>

        <nav
          className={cn(
            "flex flex-1 items-center justify-end gap-1 sm:gap-2",
          )}
          aria-label="Main"
        >
          {searchOpen ? (
            <form
              onSubmit={submitSearch}
              className="flex flex-1 items-center gap-2 border-b border-[var(--color-ink)] py-1 max-w-md ml-auto"
            >
              <Search className="size-4 text-[var(--color-muted)]" aria-hidden />
              <input
                ref={searchRef}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search products"
                className="flex-1 bg-transparent text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchValue("");
                }}
                className="text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              >
                <X className="size-4" aria-hidden />
              </button>
            </form>
          ) : (
            <button
              type="button"
              aria-label="Open search"
              onClick={() => setSearchOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-ink)] transition hover:border-[var(--color-ink)]"
            >
              <Search className="size-4" aria-hidden />
            </button>
          )}

          <Link
            href="/favorites"
            aria-label={`Favorites${favoritesCount ? ` (${favoritesCount})` : ""}`}
            className="relative hidden sm:inline-flex size-10 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-ink)] transition hover:border-[var(--color-ink)]"
          >
            <Heart className="size-4" aria-hidden />
            {favoritesCount > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-ink)] px-1 text-[10px] font-medium text-[var(--color-bg)]">
                {favoritesCount}
              </span>
            ) : null}
          </Link>

          <ThemeToggle className="hidden sm:inline-flex" />

          {user ? (
            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--color-line)] pl-1 pr-3 text-[var(--color-ink)] transition hover:border-[var(--color-ink)]"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--color-ink)] text-xs uppercase tracking-wider text-[var(--color-bg)]">
                  {initials || user.username[0]?.toUpperCase()}
                </span>
                <span className="hidden text-sm sm:inline">{user.firstName ?? user.username}</span>
              </button>
              {accountOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] py-1 shadow-lg"
                >
                  <div className="px-4 py-3 text-xs">
                    <p className="font-medium text-[var(--color-ink)]">
                      {user.firstName || user.username}
                    </p>
                    <p className="truncate text-[var(--color-muted)]">{user.email}</p>
                  </div>
                  <div className="border-t border-[var(--color-line)] sm:hidden">
                    <Link
                      role="menuitem"
                      href="/favorites"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-bg)]"
                    >
                      <Heart className="size-3.5" aria-hidden /> Favorites ({favoritesCount})
                    </Link>
                  </div>
                  <button
                    role="menuitem"
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-[var(--color-line)] px-4 py-3 text-left text-sm text-[var(--color-ink)] hover:bg-[var(--color-bg)]"
                  >
                    <LogOut className="size-3.5" aria-hidden /> Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[var(--color-ink)] px-4 text-xs uppercase tracking-[0.14em] text-[var(--color-ink)]"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
