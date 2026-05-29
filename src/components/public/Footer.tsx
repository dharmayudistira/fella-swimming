import Link from "next/link";

import { Logo } from "@/components/shared/Logo";

type FooterCol = {
  heading: string;
  links: { label: string; href: string; external?: boolean }[];
};

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? "628000000000";
const WA_LINK = `https://wa.me/${WA_NUMBER}`;

// Placeholder handles — swap for the real accounts before launch.
const SOCIALS: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/fellaswimming",
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@fellaswimming",
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-[18px] w-[18px]"
        fill="currentColor"
      >
        <path d="M16.5 3c.26 2.07 1.46 3.36 3.5 3.55v2.43c-1.18.05-2.27-.23-3.5-.83v5.7c0 3.2-2.3 5.65-5.4 5.65-3.1 0-5.4-2.13-5.4-5.23 0-3.02 2.32-5.23 5.23-5.23.3 0 .58.02.87.07v2.62a3.1 3.1 0 0 0-.87-.13c-1.5 0-2.6 1.18-2.6 2.67 0 1.5 1.1 2.7 2.6 2.7 1.6 0 2.73-1.22 2.73-3.12V3h2.84z" />
      </svg>
    ),
  },
];

const COLS: FooterCol[] = [
  {
    heading: "Kelas",
    links: [
      { label: "Privat", href: "/daftar?kelas=privat" },
      { label: "Semi-Privat", href: "/daftar?kelas=semi_privat" },
      { label: "Grup", href: "/daftar?kelas=grup" },
      { label: "Jadwal", href: "/#jenis-kelas" },
    ],
  },
  {
    heading: "Belajar",
    links: [
      { label: "Artikel", href: "/artikel" },
      { label: "Profil pelatih", href: "/#pelatih" },
      { label: "Testimoni", href: "/#testimoni" },
    ],
  },
  {
    heading: "Hubungi",
    links: [
      { label: `WhatsApp · ${formatWa(WA_NUMBER)}`, href: WA_LINK, external: true },
      { label: "Lokasi", href: "/#lokasi" },
    ],
  },
];

function formatWa(num: string) {
  if (!num.startsWith("62")) return num;
  const body = num.slice(2);
  return `+62 ${body.slice(0, 3)}-${body.slice(3, 7)}-${body.slice(7)}`;
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-14 md:py-16">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-16">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-10">
          <div>
            <Logo />
            <p className="mt-3 max-w-[28ch] text-[0.92rem] text-foreground-muted">
              Sekolah renang Sidoarjo yang menulis dulu, baru jualan. Untuk anak 4–12 tahun.
            </p>
            <div className="mt-4 flex items-center gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground-muted transition-colors hover:border-primary hover:text-primary"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          {COLS.map((col) => (
            <div key={col.heading}>
              <h5 className="mb-3.5 font-body text-[0.82rem] font-bold uppercase tracking-[0.08em] text-foreground-subtle">
                {col.heading}
              </h5>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-[0.94rem] font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-11 flex flex-col gap-3 border-t border-dashed border-border pt-6 text-[0.85rem] text-foreground-muted md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Fellaswimming · Sidoarjo, Indonesia.</span>
          <span className="font-mono">v1.0 · soft aquatic, joyful</span>
        </div>
      </div>
    </footer>
  );
}
