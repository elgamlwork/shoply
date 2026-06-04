export function HeroBand() {
  return (
    <section className="border-b border-[var(--color-line)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-16 md:flex-row md:items-end md:justify-between md:py-24">
        <div className="space-y-4 max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--color-muted)]">
            The Edit · Spring &apos;26
          </p>
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-[var(--color-ink)] md:text-7xl">
            Curated essentials,
            <br />
            quietly considered.
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-[var(--color-muted)] md:text-base">
            A small, opinionated index of products from the DummyJSON open commerce
            catalog — searchable, sortable, and built to feel like a magazine.
          </p>
        </div>
        <div className="flex items-end gap-6 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
          <div>
            <span className="block text-[10px]">Issue</span>
            <span className="font-display text-3xl text-[var(--color-ink)]">N°01</span>
          </div>
          <div className="hairline h-12 border-l" aria-hidden />
          <div>
            <span className="block text-[10px]">Style</span>
            <span className="font-display text-3xl text-[var(--color-ink)]">Editorial</span>
          </div>
        </div>
      </div>
    </section>
  );
}
