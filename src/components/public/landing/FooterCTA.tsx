import { ArrowRight } from "lucide-react";

import { ChunkyButton } from "@/components/shared/ChunkyButton";

export function FooterCTA() {
  return (
    <section
      id="daftar"
      className="relative scroll-mt-24 px-5 py-6 md:px-10 lg:px-16 lg:pb-24"
    >
      <div
        className="relative mx-auto w-full max-w-[1280px] overflow-hidden rounded-[32px] px-7 py-12 text-white md:px-12 md:py-16 lg:flex lg:items-center lg:justify-between lg:gap-14 lg:px-20 lg:py-20"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark) 80%)",
          boxShadow: "0 24px 48px -16px oklch(0.55 0.16 230 / 0.4)",
        }}
      >
        <span
          aria-hidden
          className="absolute -right-16 -top-16 h-[240px] w-[240px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.85 0.12 200 / 0.5), transparent 70%)",
          }}
        />
        <span
          aria-hidden
          className="absolute -bottom-20 -left-20 h-[280px] w-[280px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.78 0.16 80 / 0.35), transparent 70%)",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <span
            className="absolute h-3 w-3 rounded-full"
            style={{ left: "12%", top: "18%", background: "oklch(0.85 0.13 80)" }}
          />
          <span
            className="absolute h-2 w-2 rounded-full"
            style={{ left: "24%", top: "70%", background: "oklch(0.85 0.14 15)" }}
          />
          <span
            className="absolute h-4 w-4 rounded-full"
            style={{ right: "28%", top: "22%", background: "oklch(0.85 0.12 184)" }}
          />
          <span
            className="absolute h-2.5 w-2.5 rounded-full"
            style={{ right: "12%", top: "76%", background: "oklch(0.92 0.05 200)" }}
          />
          <span
            className="absolute h-[7px] w-[7px] rounded-full"
            style={{ left: "48%", top: "12%", background: "oklch(0.95 0.05 60)" }}
          />
        </div>

        <div className="relative z-10">
          <h2 className="mb-2.5 text-balance text-[clamp(1.7rem,2.5vw+0.5rem,2.4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
            Siap daftar? Cukup isi 3 langkah, Bunda/Ayah.
          </h2>
          <p className="text-pretty text-[1.05rem] text-white/85 lg:mb-0 lg:max-w-[36ch]">
            Kurang dari 3 menit di HP. Kami WhatsApp kembali dalam 1×24 jam untuk atur
            jadwal trial gratis.
          </p>
        </div>
        <div className="relative z-10 mt-7 flex flex-wrap gap-3 lg:mt-0">
          <ChunkyButton asChild size="lg" variant="invertedPrimary" href="/daftar">
            Daftar Sekarang
            <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
          </ChunkyButton>
          <ChunkyButton asChild size="lg" variant="invertedSecondary" href="/artikel">
            Baca Artikel Dulu
          </ChunkyButton>
        </div>
      </div>
    </section>
  );
}
