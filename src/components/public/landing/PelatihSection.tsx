import { coaches, type Coach } from "@/data/coaches";
import { cn } from "@/lib/utils";

import { PlaceholderImage, type PlaceholderTone } from "./PlaceholderImage";
import { SectionHead } from "./SectionHead";

const accentToBorder: Record<Coach["accent"], string> = {
  primary: "border-b-primary",
  secondary: "border-b-secondary",
  accent: "border-b-accent",
  sun: "border-b-sun",
};

const accentToRole: Record<Coach["accent"], string> = {
  primary: "bg-primary-soft text-primary-dark",
  secondary: "bg-secondary-soft text-secondary-dark",
  accent: "bg-accent-soft text-accent-dark",
  sun: "bg-sun-tint text-sun-dark",
};

const accentToTone: Record<Coach["accent"], PlaceholderTone> = {
  primary: "sky",
  secondary: "turq",
  accent: "coral",
  sun: "sun",
};

const rotateByIndex = [-1, 0.6, -0.4];

export function PelatihSection() {
  return (
    <section
      id="pelatih"
      className="relative scroll-mt-24 overflow-hidden bg-surface-muted py-16 lg:py-26"
    >
      <span
        aria-hidden
        className="absolute -right-10 top-16 h-[200px] w-[200px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.92 0.04 184 / 0.7), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-16">
        <SectionHead
          accent="secondary"
          eyebrow="Tim Pelatih"
          title="Pelatih yang sabar, bersertifikat, dan terbiasa dengan anak."
          sub="Rata-rata 3+ tahun mengajar anak usia dini. Semua pelatih terdaftar di PRSI dan punya sertifikasi pertolongan pertama di kolam."
        />

        <ul className="grid gap-5 md:grid-cols-3 md:gap-6">
          {coaches.map((coach, i) => (
            <li key={coach.slug} className="flex">
              <article
                className={cn(
                  "group flex w-full flex-col overflow-hidden rounded-[24px] border-2 border-border bg-surface",
                  "border-b-[5px] transition-[transform,box-shadow] duration-200",
                  "hover:!rotate-0 hover:-translate-y-1 hover:shadow-md",
                  accentToBorder[coach.accent],
                )}
                style={{
                  transform: `rotate(${rotateByIndex[i % rotateByIndex.length]}deg)`,
                }}
              >
                <PlaceholderImage
                  caption={coach.photoCaption}
                  alt={`Foto ${coach.name}, ${coach.role}`}
                  tone={accentToTone[coach.accent]}
                  ratio="3/4"
                  blob="default"
                  className="!rounded-none border-x-0 border-t-0 border-b-2"
                />
                <div className="px-6 pb-7 pt-5.5">
                  <h3 className="mb-1 text-[1.3rem] font-bold tracking-[-0.01em]">
                    {coach.name}
                  </h3>
                  <span
                    className={cn(
                      "mb-3.5 inline-block rounded-full px-2.5 py-1 text-[0.78rem] font-bold uppercase tracking-[0.04em]",
                      accentToRole[coach.accent],
                    )}
                  >
                    {coach.role}
                  </span>
                  <p className="mb-4 text-pretty text-[0.93rem] text-foreground-muted">
                    {coach.bio}
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {coach.certifications.map((cert, idx) => (
                      <li
                        key={cert}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.72rem] font-bold",
                          idx === 0
                            ? "bg-secondary-soft text-secondary-dark"
                            : "bg-surface-muted text-foreground-muted",
                        )}
                      >
                        {idx === 0 ? (
                          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
                        ) : null}
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
