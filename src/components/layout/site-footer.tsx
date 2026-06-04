import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-bg)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3 max-w-md">
          <p className="font-display text-3xl text-[var(--color-ink)]">
            Shoply <span className="text-[var(--color-muted)]">— the edit</span>
          </p>
          <p className="text-sm text-[var(--color-muted)]">
            A curated catalog of essentials. Built as a frontend tech showcase
            with Next.js, TypeScript, Tailwind, TanStack Query, and the
            DummyJSON open commerce API.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-[var(--color-ink)]">Shop</p>
            <Link href="/" className="block hover:text-[var(--color-ink)]">
              All products
            </Link>
            <Link href="/favorites" className="block hover:text-[var(--color-ink)]">
              Favorites
            </Link>
          </div>
          <div className="space-y-2">
            <p className="text-[var(--color-ink)]">Account</p>
            <Link href="/login" className="block hover:text-[var(--color-ink)]">
              Sign in
            </Link>
            <Link href="/register" className="block hover:text-[var(--color-ink)]">
              Create account
            </Link>
          </div>
          <div className="space-y-2">
            <p className="text-[var(--color-ink)]">Source</p>
            <a
              href="https://dummyjson.com"
              target="_blank"
              rel="noreferrer"
              className="block hover:text-[var(--color-ink)]"
            >
              DummyJSON API
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="block hover:text-[var(--color-ink)]"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--color-line)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
          <span>© {new Date().getFullYear()} Shoply Studio</span>
          <span>Spring &apos;26</span>
        </div>
      </div>
    </footer>
  );
}
