"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { ChunkyButton } from "@/components/shared/ChunkyButton";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

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

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </header>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-foreground/30 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <div
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu utama"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-[340px] flex-col gap-1 border-l border-border bg-surface px-6 pb-8 pt-24",
          "transition-transform duration-200 ease-out lg:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <nav className="flex flex-col gap-1" aria-label="Navigasi mobile">
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
        <div className="mt-6 border-t border-dashed border-border pt-6">
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
