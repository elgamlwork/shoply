import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--color-muted)]">404</p>
      <h1 className="font-display text-5xl text-[var(--color-ink)]">Page not found.</h1>
      <p className="text-sm text-[var(--color-muted)]">
        We couldn&apos;t find that page. Let&apos;s head back to the edit.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-[var(--color-ink)] px-6 text-xs uppercase tracking-[0.16em] text-[var(--color-ink)] transition hover:bg-[var(--color-ink)] hover:text-[var(--color-bg)]"
      >
        Back home
      </Link>
    </div>
  );
}
