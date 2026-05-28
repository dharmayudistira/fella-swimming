import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { classes, type ClassInfo } from "@/data/classes";
import { cn } from "@/lib/utils";

import { SectionHead } from "./SectionHead";

const cardByAccent: Record<
  ClassInfo["accent"],
  {
    border: string;
    icon: string;
    cta: string;
  }
> = {
  secondary: {
    border: "border-b-secondary",
    icon: "bg-secondary-soft text-secondary-dark",
    cta: "text-secondary-dark",
  },
  primary: {
    border: "border-primary border-b-primary-dark",
    icon: "bg-primary text-primary-foreground shadow-sm",
    cta: "text-primary-dark",
  },
  accent: {
    border: "border-b-accent",
    icon: "bg-accent-soft text-accent-dark",
    cta: "text-accent-dark",
  },
};

function PrivatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  );
}
function SemiIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]">
      <circle cx="8" cy="8" r="3.5" />
      <circle cx="16" cy="8" r="3.5" />
      <path d="M2 20c0-3 3-5 6-5s6 2 6 5M10 20c0-3 3-5 6-5s6 2 6 5" />
    </svg>
  );
}
function GrupIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-[22px] w-[22px]">
      <circle cx="6" cy="8" r="3" />
      <circle cx="12" cy="6" r="3" />
      <circle cx="18" cy="8" r="3" />
      <path d="M2 20c0-3 2-5 4-5M22 20c0-3-2-5-4-5M8 20c0-3 2-5 4-5s4 2 4 5" />
    </svg>
  );
}

const iconBySlug: Record<ClassInfo["slug"], React.ReactNode> = {
  privat: <PrivatIcon />,
  semi_privat: <SemiIcon />,
  grup: <GrupIcon />,
};

const ctaLabelBySlug: Record<ClassInfo["slug"], string> = {
  privat: "Daftar Privat",
  semi_privat: "Daftar Semi-Privat",
  grup: "Daftar Grup",
};

export function KelasSection() {
  return (
    <section
      id="jenis-kelas"
      className="relative scroll-mt-24 overflow-hidden py-16 lg:py-26"
    >
      <span
        aria-hidden
        className="absolute -right-10 top-20 h-[140px] w-[140px] rounded-full"
        style={{ border: "5px dashed oklch(0.85 0.08 230 / 0.6)" }}
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-16">
        <SectionHead
          eyebrow="Jenis Kelas"
          title="Tiga kelas — pilih yang paling pas untuk anak kamu."
          sub="Tiap tipe punya tujuan dan pace yang berbeda. Belum yakin? Tim kami bantu tentukan via WhatsApp."
        />

        <ul className="grid items-stretch gap-4 md:grid-cols-3 md:gap-5">
          {classes.map((c) => {
            const styles = cardByAccent[c.accent];
            const isPopular = !!c.popular;
            return (
              <li key={c.slug} className="flex">
                <article
                  className={cn(
                    "relative flex w-full flex-col rounded-[24px] border-2 bg-surface p-7 pb-7",
                    "border-border border-b-[6px] transition-[transform,box-shadow] duration-200",
                    "hover:-translate-y-1 hover:shadow-md",
                    styles.border,
                    isPopular &&
                      "z-10 -rotate-[0.6deg] scale-[1.02] hover:translate-y-0 hover:-rotate-[0.6deg] hover:scale-[1.02]",
                  )}
                  style={
                    isPopular
                      ? {
                          background:
                            "linear-gradient(180deg, var(--color-primary-tint), var(--color-surface) 80%)",
                          boxShadow:
                            "0 24px 48px -16px oklch(0.71 0.14 230 / 0.28)",
                        }
                      : undefined
                  }
                >
                  {isPopular ? (
                    <span
                      className="absolute -top-4 right-5 z-20 rounded-full bg-accent px-3.5 py-2 text-[0.74rem] font-extrabold uppercase tracking-[0.06em] text-accent-foreground"
                      style={{
                        transform: "rotate(6deg)",
                        boxShadow:
                          "0 3px 0 var(--color-accent-dark), 0 6px 16px -6px rgba(26,35,50,0.18)",
                      }}
                    >
                      ⭐ Paling Populer
                    </span>
                  ) : null}

                  <span
                    aria-hidden
                    className={cn(
                      "mb-4 inline-flex h-11 w-11 items-center justify-center rounded-[14px]",
                      styles.icon,
                    )}
                  >
                    {iconBySlug[c.slug]}
                  </span>

                  <div className="mb-1 flex items-baseline justify-between gap-3">
                    <h3 className="text-[1.55rem] font-bold tracking-[-0.01em]">
                      {c.name}
                    </h3>
                    <span className="font-mono text-[0.78rem] text-foreground-subtle">
                      {c.ratio}
                    </span>
                  </div>

                  <p className="mb-5 text-pretty text-[0.95rem] text-foreground-muted">
                    {c.shortDescription}
                  </p>

                  <div className="mb-5 flex items-baseline gap-1.5 border-y border-dashed border-border py-3.5">
                    <span className="font-heading text-[1.7rem] font-bold tracking-[-0.02em]">
                      {c.priceAmount}
                    </span>
                    <span className="text-[0.85rem] text-foreground-muted">
                      {c.priceUnit}
                    </span>
                  </div>

                  <ul className="mb-6 flex flex-col gap-2.5 text-[0.94rem] text-foreground">
                    {c.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <span
                          aria-hidden
                          className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                          style={{
                            background: "oklch(0.92 0.10 150)",
                            color: "oklch(0.36 0.16 150)",
                          }}
                        >
                          <Check className="h-3 w-3" strokeWidth={2.4} />
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-1">
                    <Link
                      href={`/daftar?kelas=${c.slug}`}
                      className={cn(
                        "group inline-flex items-center gap-1.5 text-[0.95rem] font-bold transition-[gap]",
                        styles.cta,
                      )}
                    >
                      {ctaLabelBySlug[c.slug]}
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        strokeWidth={2.5}
                      />
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
