"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { ChunkyButton } from "@/components/shared/ChunkyButton";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

const noopSubscribe = () => () => {};
const useIsMounted = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

type NavLink = { label: string; href: string };

const NAV_LINKS: NavLink[] = [
  { label: "Kelas", href: "/#jenis-kelas" },
  { label: "Pelatih", href: "/#pelatih" },
  { label: "Galeri", href: "/#galeri" },
  { label: "Lokasi", href: "/#lokasi" },
  { label: "Artikel", href: "/artikel" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const mounted = useIsMounted();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-border",
          "supports-[backdrop-filter]:backdrop-blur-md supports-[backdrop-filter]:bg-background/85",
          "bg-background",
        )}
        style={{ backdropFilter: "saturate(140%) blur(8px)" }}
      >
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-5 py-3.5 md:px-10 md:py-4 lg:px-16 lg:py-[18px]">
          <Logo />

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigasi utama">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.95rem] font-semibold text-foreground-muted transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:inline-flex">
            <ChunkyButton asChild size="sm" variant="primary" href="/daftar">
              Daftar Sekarang
            </ChunkyButton>
          </div>

          <button
            type="button"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-[14px] border border-border bg-surface lg:hidden",
              "border-b-[3px] transition-colors",
            )}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {mounted &&
        createPortal(
          <MobileDrawer open={open} onClose={() => setOpen(false)} />,
          document.body,
        )}
    </>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[60] bg-foreground/40 transition-opacity duration-200 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu utama"
        className={cn(
          "fixed inset-y-0 right-0 z-[70] flex w-[78%] max-w-[320px] flex-col border-l border-border bg-surface",
          "transition-transform duration-200 ease-out lg:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <Logo />
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] border border-border bg-background text-foreground transition-colors hover:bg-surface-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-4 pt-4" aria-label="Navigasi mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-[14px] px-4 py-3 text-lg font-semibold text-foreground transition-colors hover:bg-surface-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-dashed border-border px-5 pb-8 pt-6">
          <ChunkyButton
            asChild
            size="lg"
            variant="primary"
            href="/daftar"
            onClick={onClose}
            className="w-full"
          >
            Daftar Sekarang
          </ChunkyButton>
          <p className="mt-4 text-center text-sm text-foreground-muted">
            Konsultasi gratis via WhatsApp · tanpa bayar di muka.
          </p>
        </div>
      </div>
    </>
  );
}
