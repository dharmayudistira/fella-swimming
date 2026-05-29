"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Check, Copy, Home, Link2 } from "lucide-react";
import { toast } from "sonner";

import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

const ADMIN_URL =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://fellaswimming.com").replace(
    /\/+$/,
    "",
  ) + "/admin";
const ADMIN_HOST = ADMIN_URL.replace(/^https?:\/\//, "").replace(/\/admin$/, "");

/**
 * Full-screen takeover shown when /admin is opened below the desktop
 * breakpoint (lg / 1024px). The dashboard tables + Tiptap editor need a wide
 * viewport, so on phones/tablets we route the user to copy the link and open
 * it on a laptop instead. Visual source: docs/design/project/admin-mobile-fallback.html.
 */
export function AdminMobileFallback() {
  const [copied, setCopied] = useState(false);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copyLink() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(ADMIN_URL);
      } else {
        // Legacy fallback (older mobile Safari): hidden textarea + execCommand.
        const ta = document.createElement("textarea");
        ta.value = ADMIN_URL;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      toast.success("Link disalin ke clipboard");
      if (resetRef.current) clearTimeout(resetRef.current);
      resetRef.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Gagal menyalin link. Salin manual dari address bar, ya.");
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden px-5 pb-7 pt-[22px]">
      {/* Soft corner glows — same palette as the landing hero */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-[120px] -top-[140px] h-[360px] w-[360px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.92 0.06 230 / 0.5), transparent 70%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-[150px] -right-[120px] h-[360px] w-[360px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.92 0.06 80 / 0.45), transparent 70%)",
        }}
      />

      {/* Top brand bar */}
      <header className="relative z-[1] flex items-center gap-2.5">
        <Logo size="sm" />
        <span className="ml-auto rounded-[6px] bg-surface-muted px-2.5 py-1 font-mono text-[0.66rem] font-medium uppercase tracking-[0.08em] text-foreground-subtle">
          Admin
        </span>
      </header>

      {/* Centered card */}
      <div className="relative z-[1] flex flex-1 items-center justify-center py-[26px]">
        <div
          className="w-full max-w-[380px] rounded-[26px] border-[1.5px] border-b-[6px] border-border border-b-primary bg-surface px-[26px] pb-[26px] pt-[30px] text-center"
          style={{
            boxShadow:
              "0 24px 48px -20px rgba(26,35,50,.14), 0 8px 16px -8px rgba(26,35,50,.06)",
          }}
        >
          <DesktopScene />

          <p className="mb-2.5 font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-primary-dark">
            Khusus desktop
          </p>
          <h1 className="mb-2.5 text-balance text-[1.45rem] tracking-[-0.02em]">
            Dashboard-nya butuh layar lebih besar
          </h1>
          <p className="mb-[22px] text-pretty text-[0.96rem] text-foreground-muted">
            Halaman admin Fellaswimming dirancang untuk laptop atau komputer,
            supaya tabel pendaftaran dan editor artikel nyaman dikelola. Buka
            link ini di desktop, ya, Bunda.
          </p>

          {/* URL chip */}
          <div className="mb-[18px] flex items-center gap-2.5 rounded-[13px] border-[1.5px] border-border bg-surface-muted px-[13px] py-[11px] text-left">
            <span className="inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] bg-secondary-tint text-secondary-dark">
              <Link2 className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[0.82rem] font-medium text-foreground">
              {ADMIN_HOST}
              <b className="text-primary-dark">/admin</b>
            </span>
          </div>

          {/* Copy-link button */}
          <button
            type="button"
            onClick={copyLink}
            className={cn(
              "inline-flex h-[50px] w-full items-center justify-center gap-2.5 rounded-[14px] font-body text-[0.98rem] font-bold text-white transition-[filter,transform,box-shadow] duration-100 active:translate-y-[3px]",
              copied ? "bg-success" : "bg-primary hover:brightness-[1.04]",
            )}
            style={{
              boxShadow: copied
                ? "0 4px 0 0 oklch(0.45 0.16 150), 0 8px 16px -6px oklch(0.66 0.16 150 / 0.4)"
                : "0 4px 0 0 var(--color-primary-dark), 0 8px 16px -6px oklch(0.71 0.14 230 / 0.4)",
            }}
          >
            {copied ? (
              <Check className="h-[18px] w-[18px]" strokeWidth={2.4} />
            ) : (
              <Copy className="h-[18px] w-[18px]" strokeWidth={2.2} />
            )}
            {copied ? "Tersalin!" : "Salin link untuk desktop"}
          </button>

          {/* Ghost — back to the public site */}
          <Link
            href="/"
            className="mt-2.5 inline-flex h-[50px] w-full items-center justify-center gap-2.5 rounded-[14px] border-[1.5px] border-b-[3px] border-border bg-surface text-[0.98rem] font-bold text-foreground transition-colors hover:border-primary hover:text-primary-dark active:translate-y-[2px]"
          >
            <Home className="h-[18px] w-[18px]" strokeWidth={2.2} />
            Kembali ke halaman utama
          </Link>

          {/* Hint */}
          <div className="mt-[22px] flex items-start gap-2.5 border-t-[1.5px] border-dashed border-border pt-[18px] text-left">
            <span className="inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[8px] bg-sun-tint font-heading text-[0.78rem] font-extrabold text-sun-dark">
              !
            </span>
            <p className="text-[0.85rem] text-foreground-muted">
              Tip: kirim link ini ke laptop lewat WhatsApp atau email kamu
              sendiri, lalu buka dari sana. Layar minimal{" "}
              <b className="font-bold text-foreground">1024px</b>.
            </p>
          </div>
        </div>
      </div>

      {/* Footnote */}
      <p className="relative z-[1] text-center text-[0.84rem] text-foreground-muted">
        Bukan tim admin?{" "}
        <Link href="/daftar" className="font-bold text-foreground hover:text-primary">
          Daftar les renang di sini
        </Link>
      </p>
    </div>
  );
}

/** Monitor-vs-phone illustration (decorative). */
function DesktopScene() {
  return (
    <div aria-hidden className="relative mx-auto mb-[22px] mt-1 h-[138px] w-[168px]">
      {/* Monitor */}
      <div
        className="absolute left-[18px] top-[6px] h-[92px] w-[132px] overflow-hidden rounded-[14px] border-[2.5px] border-foreground bg-primary-tint"
        style={{ boxShadow: "0 10px 22px -10px oklch(0.55 0.16 230 / 0.5)" }}
      >
        <div className="flex h-[18px] items-center gap-1 bg-foreground px-[7px]">
          <span className="h-[5px] w-[5px] rounded-full bg-white/55" />
          <span className="h-[5px] w-[5px] rounded-full bg-white/55" />
          <span className="h-[5px] w-[5px] rounded-full bg-white/55" />
        </div>
        <div className="flex flex-col gap-1.5 px-2.5 py-[9px]">
          <div className="h-[7px] w-[70%] rounded-[4px] bg-secondary-tint" />
          <div className="h-[7px] w-full rounded-[4px] bg-primary-soft" />
          <div className="h-[7px] w-[84%] rounded-[4px] bg-primary-soft" />
        </div>
      </div>
      {/* Stand + base */}
      <div className="absolute left-1/2 top-[92px] h-5 w-[26px] -translate-x-1/2 bg-foreground" />
      <div className="absolute left-1/2 top-[110px] h-[9px] w-16 -translate-x-1/2 rounded-[5px] bg-foreground" />
      {/* Phone with an "×" — admin not available here */}
      <div
        className="absolute bottom-0 right-[2px] flex h-20 w-[46px] items-center justify-center rounded-[12px] border-[2.5px] border-foreground bg-surface"
        style={{ boxShadow: "0 8px 18px -8px rgba(26,35,50,.35)" }}
      >
        <span className="absolute left-1/2 top-[7px] h-[3px] w-3.5 -translate-x-1/2 rounded-[3px] bg-border" />
        <span className="font-heading text-[1.5rem] font-extrabold leading-none text-accent">
          ×
        </span>
      </div>
    </div>
  );
}
