import { ArrowRight, Check } from "lucide-react";

import { ChunkyButton } from "@/components/shared/ChunkyButton";
import { PlaceholderImage } from "./PlaceholderImage";

const SQUIGGLE_TURQ = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 14' preserveAspectRatio='none'><path d='M2 8 Q 25 0, 50 7 T 100 7 T 150 7 T 198 7' stroke='%2314b8a6' stroke-width='3.5' fill='none' stroke-linecap='round'/></svg>`;
const SQUIGGLE_CORAL = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 14' preserveAspectRatio='none'><path d='M2 8 Q 25 0, 50 7 T 100 7 T 150 7 T 198 7' stroke='%23fb7185' stroke-width='3.5' fill='none' stroke-linecap='round'/></svg>`;

function AccentWord({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "turq" | "coral";
}) {
  const squiggle = tone === "turq" ? SQUIGGLE_TURQ : SQUIGGLE_CORAL;
  return (
    <span
      className="relative whitespace-nowrap"
      style={{ color: tone === "turq" ? "var(--color-primary)" : "var(--color-accent)" }}
    >
      {children}
      <span
        aria-hidden
        className="absolute -left-[2%] -right-[2%] -bottom-1.5 h-3.5"
        style={{
          backgroundImage: `url("${squiggle}")`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
    </span>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-16 pt-8 lg:pb-28 lg:pt-16">
      <div
        aria-hidden
        className="absolute -right-[120px] -top-[120px] z-0 h-[480px] w-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.92 0.05 184 / 0.55), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <span
              className="mb-5 inline-flex items-center gap-2 rounded-full border-[1.5px] px-3.5 py-2 text-[0.82rem] font-bold"
              style={{
                background: "oklch(0.94 0.05 80)",
                borderColor: "oklch(0.88 0.08 80)",
                color: "oklch(0.40 0.13 80)",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="oklch(0.84 0.13 80)"
                className="h-4 w-4"
                aria-hidden
              >
                <path d="M12 2l2.9 6.9L22 9.7l-5.3 4.6L18.2 22 12 18.3 5.8 22l1.5-7.7L2 9.7l7.1-.8L12 2z" />
              </svg>
              Sekolah renang Sidoarjo · 5 tahun
            </span>

            <h1 className="mb-5 text-pretty text-[clamp(2.1rem,5vw+0.4rem,3.6rem)] font-bold leading-[1.06] tracking-[-0.025em]">
              Belajar berenang dengan{" "}
              <AccentWord tone="turq">tenang</AccentWord>, terstruktur, dan{" "}
              <AccentWord tone="coral">menyenangkan</AccentWord>.
            </h1>

            <p className="mb-7 max-w-[42ch] text-pretty text-[1.1rem] text-foreground-muted lg:text-[1.2rem]">
              Untuk anak 4–12 tahun. Lihat dulu kelas, pelatih, harga, dan jadwal di sini —
              baru daftar dengan yakin.
            </p>

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <ChunkyButton asChild size="lg" variant="primary" href="/daftar" className="w-full sm:w-auto">
                Daftar Sekarang
                <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
              </ChunkyButton>
              <ChunkyButton asChild size="lg" variant="secondary" href="#jenis-kelas" className="w-full sm:w-auto">
                Lihat Kelas
              </ChunkyButton>
            </div>

            <div className="mb-8 flex w-full items-center justify-center gap-2 text-center text-[0.92rem] text-foreground-muted sm:inline-flex sm:w-auto sm:justify-start sm:text-left">
              <span
                aria-hidden
                className="hidden h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full sm:inline-flex"
                style={{
                  background: "oklch(0.92 0.10 150)",
                  color: "oklch(0.40 0.15 150)",
                }}
              >
                <Check className="h-[13px] w-[13px]" strokeWidth={2.5} />
              </span>
              Tanpa bayar di muka · konsultasi gratis via WhatsApp
            </div>

            <dl className="grid grid-cols-3 gap-4 border-t-[1.5px] border-dashed border-border pt-5 text-center sm:flex sm:flex-wrap sm:gap-7 sm:text-left">
              <div>
                <dt className="block font-heading text-[1.6rem] font-bold leading-none tracking-[-0.01em] text-primary">
                  5 tahun
                </dt>
                <dd className="mt-1 text-[0.85rem] font-medium text-foreground-muted">
                  Mengajar di Sidoarjo
                </dd>
              </div>
              <div>
                <dt className="block font-heading text-[1.6rem] font-bold leading-none tracking-[-0.01em] text-secondary">
                  320+
                </dt>
                <dd className="mt-1 text-[0.85rem] font-medium text-foreground-muted">
                  Anak sudah lulus
                </dd>
              </div>
              <div>
                <dt className="block font-heading text-[1.6rem] font-bold leading-none tracking-[-0.01em] text-accent">
                  4.9 / 5
                </dt>
                <dd className="mt-1 text-[0.85rem] font-medium text-foreground-muted">
                  Rata-rata rating ortu
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <span
              aria-hidden
              className="absolute -left-3.5 top-[8%] h-14 w-14 rounded-full shadow-sm"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #fff, oklch(0.85 0.12 230 / 0.55) 70%)",
              }}
            />
            <span
              aria-hidden
              className="absolute left-[20%] -top-4 h-[26px] w-[26px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #fff, oklch(0.85 0.10 184) 70%)",
              }}
            />
            <span
              aria-hidden
              className="absolute -right-5 top-[20%] h-[84px] w-[84px] rounded-full deco-spin"
              style={{ border: "4px dashed oklch(0.78 0.12 80 / 0.55)" }}
            />
            <span
              aria-hidden
              className="absolute bottom-[4%] left-[8%] h-[18px] w-[18px] rounded-full bg-accent shadow-sm"
            />
            <PlaceholderImage
              caption="foto · anak belajar di kolam"
              tone="sky"
              ratio="3/4"
              rotateDeg={-2}
              className="!aspect-[4/5] shadow-lg"
              blob="default"
            />
            <div className="absolute -bottom-5 -right-2 w-[46%] lg:-bottom-9 lg:-right-8 lg:w-[42%]">
              <PlaceholderImage
                caption="foto · pelatih"
                tone="turq"
                ratio="1/1"
                blob="blob-a"
                rotateDeg={4}
                className="border-[4px] shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
