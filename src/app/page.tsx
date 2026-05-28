import { Button } from "@/components/ui/button";

/**
 * Phase 0 design-token swatch. Temporary verification surface — confirms
 * brand tokens, fonts, and shadcn primitives compose correctly through
 * Tailwind v4 `@theme` + `next/font` + `@base-ui/react`.
 *
 * Remove this page before the Phase 0 PR opens.
 */

type Swatch = {
  label: string;
  className: string;
  hint: string;
};

const brandSwatches: { name: string; tones: Swatch[] }[] = [
  {
    name: "Primary (Sky)",
    tones: [
      { label: "primary", className: "bg-primary text-primary-foreground", hint: "CTA, links" },
      { label: "primary-dark", className: "bg-primary-dark text-white", hint: "under-shadow, dark text on tint" },
      { label: "primary-soft", className: "bg-primary-soft text-primary-dark", hint: "badge bg" },
      { label: "primary-tint", className: "bg-primary-tint text-primary-dark", hint: "section fill" },
    ],
  },
  {
    name: "Secondary (Turquoise)",
    tones: [
      { label: "secondary", className: "bg-secondary text-secondary-foreground", hint: "accent CTA" },
      { label: "secondary-dark", className: "bg-secondary-dark text-white", hint: "under-shadow" },
      { label: "secondary-soft", className: "bg-secondary-soft text-secondary-dark", hint: "badge bg" },
      { label: "secondary-tint", className: "bg-secondary-tint text-secondary-dark", hint: "section fill" },
    ],
  },
  {
    name: "Accent (Coral)",
    tones: [
      { label: "accent", className: "bg-accent text-accent-foreground", hint: "warmth touches" },
      { label: "accent-dark", className: "bg-accent-dark text-white", hint: "under-shadow" },
      { label: "accent-soft", className: "bg-accent-soft text-accent-dark", hint: "badge bg" },
      { label: "accent-tint", className: "bg-accent-tint text-accent-dark", hint: "section fill" },
    ],
  },
  {
    name: "Sun (Warm yellow)",
    tones: [
      { label: "sun", className: "bg-sun text-foreground", hint: "stars, hero badge" },
      { label: "sun-dark", className: "bg-sun-dark text-white", hint: "dark text on tint" },
      { label: "sun-tint", className: "bg-sun-tint text-foreground", hint: "section fill" },
    ],
  },
];

const neutralSwatches: Swatch[] = [
  { label: "background", className: "bg-background text-foreground border border-border", hint: "page bg" },
  { label: "surface", className: "bg-surface text-foreground border border-border", hint: "card bg" },
  { label: "surface-muted", className: "bg-surface-muted text-foreground border border-border", hint: "muted card / panel" },
  { label: "border", className: "bg-border text-foreground", hint: "divider" },
  { label: "foreground", className: "bg-foreground text-background", hint: "body text" },
  { label: "foreground-muted", className: "bg-foreground-muted text-white", hint: "secondary text" },
  { label: "foreground-subtle", className: "bg-foreground-subtle text-white", hint: "tertiary text" },
];

const semanticSwatches: Swatch[] = [
  { label: "success", className: "bg-success text-white", hint: "confirm" },
  { label: "success-tint", className: "bg-success-tint text-success-dark", hint: "confirm bg" },
  { label: "warning", className: "bg-warning text-white", hint: "caution" },
  { label: "error", className: "bg-error text-white", hint: "error" },
  { label: "info", className: "bg-info text-white", hint: "info" },
];

const sidebarSwatches: Swatch[] = [
  { label: "sidebar", className: "bg-sidebar text-sidebar-foreground", hint: "admin nav bg" },
  { label: "sidebar-primary", className: "bg-sidebar-primary text-sidebar-primary-foreground", hint: "active nav" },
  { label: "sidebar-accent", className: "bg-sidebar-accent text-sidebar-accent-foreground", hint: "hover/active item" },
];

const typeScale = [
  { className: "text-display", label: "display 3.815rem" },
  { className: "text-4xl", label: "4xl 3.052rem" },
  { className: "text-3xl", label: "3xl 2.441rem" },
  { className: "text-2xl", label: "2xl 1.953rem" },
  { className: "text-xl", label: "xl 1.563rem" },
  { className: "text-lg", label: "lg 1.25rem" },
  { className: "text-base", label: "base 1rem" },
  { className: "text-sm", label: "sm 0.875rem" },
  { className: "text-xs", label: "xs 0.75rem" },
];

function SwatchTile({ label, className, hint }: Swatch) {
  return (
    <div className={`${className} rounded-lg p-4 min-h-[88px] flex flex-col justify-between`}>
      <code className="font-mono text-xs opacity-80">{label}</code>
      <span className="text-sm font-semibold">{hint}</span>
    </div>
  );
}

export default function DesignTokenSwatchPage() {
  return (
    <main className="px-5 md:px-10 lg:px-16 py-12 max-w-6xl">
      <header className="mb-12">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-foreground-muted mb-3">
          Phase 0 · verifikasi design tokens
        </p>
        <h1 className="text-3xl md:text-4xl mb-3">Fellaswimming Design Swatch</h1>
        <p className="text-foreground-muted max-w-prose">
          Sementara. Halaman ini buat ngecek brand tokens, font loading, dan shadcn primitives jalan
          dari Tailwind v4 `@theme`. Hapus sebelum PR Phase 0 dibuka.
        </p>
      </header>

      {brandSwatches.map((group) => (
        <section key={group.name} className="mb-10">
          <h2 className="text-xl mb-4">{group.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {group.tones.map((tone) => (
              <SwatchTile key={tone.label} {...tone} />
            ))}
          </div>
        </section>
      ))}

      <section className="mb-10">
        <h2 className="text-xl mb-4">Neutrals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {neutralSwatches.map((tone) => (
            <SwatchTile key={tone.label} {...tone} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl mb-4">Semantic</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {semanticSwatches.map((tone) => (
            <SwatchTile key={tone.label} {...tone} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl mb-4">Admin Sidebar Palette</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sidebarSwatches.map((tone) => (
            <SwatchTile key={tone.label} {...tone} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl mb-4">Type Scale (General Sans heading)</h2>
        <div className="space-y-2 bg-surface border border-border rounded-lg p-6">
          {typeScale.map((t) => (
            <div key={t.className} className="flex items-baseline gap-6 border-b border-border last:border-0 py-2">
              <code className="font-mono text-xs text-foreground-subtle w-32 shrink-0">{t.label}</code>
              <span className={t.className} style={{ fontFamily: "var(--font-heading)" }}>
                Belajar berenang yang aman, terstruktur, dan menyenangkan
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl mb-4">Font Families</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-surface border border-border rounded-lg p-5">
            <code className="font-mono text-xs text-foreground-subtle">font-heading</code>
            <p
              className="text-2xl mt-2"
              style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
            >
              General Sans
            </p>
            <p
              className="text-foreground-muted mt-1"
              style={{ fontFamily: "var(--font-heading)", fontWeight: 500 }}
            >
              Medium · Semibold · Bold
            </p>
          </div>
          <div className="bg-surface border border-border rounded-lg p-5">
            <code className="font-mono text-xs text-foreground-subtle">font-body</code>
            <p
              className="text-2xl mt-2"
              style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}
            >
              Nunito
            </p>
            <p className="text-foreground-muted mt-1" style={{ fontFamily: "var(--font-body)" }}>
              Body copy, instruksi, microcopy.
            </p>
          </div>
          <div className="bg-surface border border-border rounded-lg p-5">
            <code className="font-mono text-xs text-foreground-subtle">font-mono</code>
            <p className="text-2xl mt-2 font-mono">JetBrains Mono</p>
            <p className="text-foreground-muted mt-1 font-mono text-sm">
              PRIV-2026-0001
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl mb-4">shadcn Primitives</h2>
        <div className="flex flex-wrap gap-3 items-center bg-surface border border-border rounded-lg p-6">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>
    </main>
  );
}
