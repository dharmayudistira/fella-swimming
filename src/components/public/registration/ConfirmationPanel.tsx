"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ChunkyButton } from "@/components/shared/ChunkyButton";

type NextStep = {
  title: string;
  body: string;
};

const NEXT_STEPS: NextStep[] = [
  {
    title: "Kami WhatsApp balik dalam 24 jam",
    body: "Tim Fellaswimming konfirmasi pilihan kelas dan tawarkan 2-3 slot jadwal trial.",
  },
  {
    title: "Anak ikut trial gratis di kolam kami",
    body: "Pelatih asesmen langsung. Bunda/Ayah boleh menunggu di pinggir kolam.",
  },
  {
    title: "Cocok? Lanjut daftar. Belum cocok? Bisa coba pelatih lain.",
    body: "Pembayaran setelah trial pertama. Kami tidak pernah minta DP.",
  },
];

export function ConfirmationPanel({
  displayId,
  parentName,
}: {
  displayId: string;
  parentName: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayId);
      setCopied(true);
      toast.success("Nomor referensi disalin.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Browser tidak mendukung salin otomatis.");
    }
  };

  const firstName = parentName.trim().split(/\s+/)[0] ?? parentName;

  return (
    <section
      aria-live="polite"
      className="mx-auto flex w-full max-w-[520px] flex-col gap-4 pb-12"
    >
      {/* Hero card */}
      <div
        className="relative overflow-hidden rounded-[24px] border border-border border-b-[5px] border-b-success bg-surface px-6 py-8 text-center shadow-md"
      >
        <span
          aria-hidden
          className="absolute left-5 top-5 h-2.5 w-2.5 rounded-full bg-sun"
        />
        <span
          aria-hidden
          className="absolute right-6 top-7 h-3.5 w-3.5 rounded-full bg-secondary"
        />

        <div
          className="mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-success bg-success-tint text-success"
          style={{ boxShadow: "0 4px 0 var(--color-success)" }}
        >
          <Check className="h-9 w-9" strokeWidth={3} />
        </div>

        <h1 className="mb-2 text-balance text-[1.7rem] font-bold tracking-[-0.02em]">
          Pendaftaran terkirim, Bunda {firstName}!
        </h1>
        <p className="mx-auto mb-5 max-w-[36ch] text-pretty text-foreground-muted">
          Tim Fellaswimming akan WhatsApp kamu dalam 1×24 jam untuk atur jadwal
          trial.
        </p>

        <p className="mb-1.5 font-mono text-[0.78rem] font-medium uppercase tracking-[0.1em] text-foreground-subtle">
          Nomor referensi
        </p>
        <div className="inline-flex items-center gap-2">
          <span
            className="inline-block rounded-[14px] border border-dashed border-border bg-background px-5 py-2.5 font-mono text-[1.2rem] font-semibold tracking-[0.06em] text-primary"
          >
            {displayId}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Salin nomor referensi"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-border bg-surface text-foreground-muted transition-colors hover:bg-surface-muted"
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" strokeWidth={2.6} />
            ) : (
              <Copy className="h-4 w-4" strokeWidth={2.2} />
            )}
          </button>
        </div>
      </div>

      {/* Next steps */}
      <div className="rounded-[24px] border border-border bg-surface px-6 py-6">
        <h2 className="mb-4 flex items-center gap-2 text-[1.05rem] font-bold">
          <span aria-hidden className="h-2 w-2 rounded-full bg-secondary" />
          Yang akan terjadi selanjutnya
        </h2>
        <ol className="flex flex-col gap-3.5">
          {NEXT_STEPS.map((step, i) => {
            const numClass =
              i === 0
                ? "bg-primary-tint text-primary-dark"
                : i === 1
                  ? "bg-secondary-tint text-secondary-dark"
                  : "bg-accent-tint text-accent-dark";
            return (
              <li key={step.title} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-heading text-[0.86rem] font-bold ${numClass}`}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="font-bold leading-snug text-foreground">
                    {step.title}
                  </p>
                  <p className="mt-0.5 text-[0.88rem] leading-snug text-foreground-muted">
                    {step.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2.5">
        <ChunkyButton asChild variant="primary" size="md" href="/artikel">
          Baca artikel sambil menunggu
        </ChunkyButton>
        <ChunkyButton asChild variant="ghost" size="md" href="/">
          Kembali ke beranda
        </ChunkyButton>
      </div>
    </section>
  );
}
