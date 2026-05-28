import { getFeaturedTestimonials } from "@/lib/queries/testimonials";
import { cn } from "@/lib/utils";

import { SectionHead } from "./SectionHead";

const cardStyles = [
  {
    bg: "bg-primary-tint",
    border: "border-b-primary",
    borderTone: "oklch(0.85 0.08 230)",
    rotate: -0.8,
    avatar: "from-[oklch(0.78_0.12_230)] to-[oklch(0.78_0.12_184)]",
  },
  {
    bg: "bg-surface",
    border: "border-b-secondary",
    borderTone: "var(--color-border)",
    rotate: 0.5,
    avatar: "from-[oklch(0.78_0.12_184)] to-[oklch(0.78_0.10_200)]",
  },
  {
    bg: "bg-accent-tint",
    border: "border-b-accent",
    borderTone: "oklch(0.87 0.06 15)",
    rotate: -0.4,
    avatar: "from-[oklch(0.80_0.14_15)] to-[oklch(0.80_0.10_30)]",
  },
  {
    bg: "bg-secondary-tint",
    border: "border-b-secondary",
    borderTone: "oklch(0.86 0.06 184)",
    rotate: 0.6,
    avatar: "from-[oklch(0.78_0.12_184)] to-[oklch(0.78_0.10_200)]",
  },
  {
    bg: "bg-surface",
    border: "border-b-accent",
    borderTone: "var(--color-border)",
    rotate: -0.5,
    avatar: "from-[oklch(0.80_0.14_15)] to-[oklch(0.80_0.10_30)]",
  },
  {
    bg: "bg-sun-tint",
    border: "border-b-sun",
    borderTone: "oklch(0.86 0.07 80)",
    rotate: 0.3,
    avatar: "from-[oklch(0.84_0.13_80)] to-[oklch(0.80_0.10_50)]",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function StarRow({ count }: { count: number }) {
  return (
    <div
      className="inline-flex gap-0.5 text-sun"
      role="img"
      aria-label={`${count} dari 5 bintang`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill={i < count ? "currentColor" : "var(--color-border)"}
        >
          <path d="M12 2l2.9 6.9L22 9.7l-5.3 4.6L18.2 22 12 18.3 5.8 22l1.5-7.7L2 9.7l7.1-.8L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export async function TestimoniSection() {
  const testimonials = await getFeaturedTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section
      id="testimoni"
      className="relative scroll-mt-24 overflow-hidden py-16 lg:py-26"
    >
      <span
        aria-hidden
        className="absolute -left-[60px] top-[120px] h-[180px] w-[180px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.93 0.04 15 / 0.6), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-16">
        <SectionHead
          accent="accent"
          eyebrow="Cerita Orang Tua"
          title="Apa kata Bunda & Ayah yang sudah daftar."
          sub="Cerita asli dari orang tua anak-anak kami. Kami tampilkan apa adanya."
        />

        <ul className="-mx-5 grid snap-x snap-mandatory auto-cols-[82%] grid-flow-col gap-4 overflow-x-auto scroll-pl-7 px-7 pb-2 md:mx-0 md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
          {testimonials.map((t, i) => {
            const s = cardStyles[i % cardStyles.length];
            return (
              <li
                key={t.id}
                className={cn("relative flex snap-start flex-col gap-3.5 rounded-[24px] border-2 border-border p-6", s.bg, s.border, "border-b-[4px]")}
                style={{
                  transform: `rotate(${s.rotate}deg)`,
                  borderColor: s.borderTone,
                }}
              >
                <span
                  aria-hidden
                  className="absolute -top-2 left-5 font-heading text-[3.5rem] font-bold leading-none text-foreground/10"
                >
                  &ldquo;
                </span>
                <StarRow count={t.rating} />
                <p className="text-pretty font-heading text-[1.04rem] font-medium leading-[1.45] text-foreground">
                  {t.text}
                </p>
                <div className="mt-auto flex items-center gap-3 border-t border-dashed border-border pt-3">
                  <span
                    aria-hidden
                    className={cn(
                      "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-heading text-[0.9rem] font-bold text-white shadow-sm",
                      s.avatar,
                    )}
                  >
                    {getInitials(t.name)}
                  </span>
                  <div className="leading-tight">
                    <div className="text-[0.92rem] font-bold">{t.name}</div>
                    {t.role ? (
                      <div className="text-[0.82rem] text-foreground-muted">
                        {t.role}
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
