import { Clock, Home, MapPin } from "lucide-react";

import { ChunkyButton } from "@/components/shared/ChunkyButton";

import { SectionHead } from "./SectionHead";

const ADDRESS = "Jl. Anggrek Raya No. 12, Sidoarjo, Jawa Timur 61252";
const MAPS_QUERY = encodeURIComponent(ADDRESS);
const MAPS_EMBED = `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`;
const MAPS_OPEN = `https://www.google.com/maps?q=${MAPS_QUERY}`;
const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? "628000000000";
const WA_MESSAGE = encodeURIComponent(
  "Halo Fellaswimming, mau tanya soal lokasi dan jadwal kelas.",
);
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

type Detail = {
  icon: React.ReactNode;
  label: string;
  sub: string;
  accent: "primary" | "secondary" | "accent";
};

const DETAILS: Detail[] = [
  {
    icon: <Clock className="h-[18px] w-[18px]" strokeWidth={2} />,
    label: "Jam operasional",
    sub: "Sen–Sab 14:00–20:00 · Minggu 07:00–17:00",
    accent: "primary",
  },
  {
    icon: <MapPin className="h-[18px] w-[18px]" strokeWidth={2} />,
    label: "Akses",
    sub: "5 menit dari pintu tol Sidoarjo · 10 menit dari Lippo Plaza",
    accent: "secondary",
  },
  {
    icon: <Home className="h-[18px] w-[18px]" strokeWidth={2} />,
    label: "Fasilitas",
    sub: "Parkir luas · ruang tunggu ber-AC · kamar ganti · loker",
    accent: "accent",
  },
];

const accentToIcon: Record<Detail["accent"], string> = {
  primary: "text-primary border-b-primary",
  secondary: "text-secondary border-b-secondary",
  accent: "text-accent border-b-accent",
};

export function LokasiSection() {
  return (
    <section
      id="lokasi"
      className="relative scroll-mt-24 overflow-hidden bg-surface-muted py-16 lg:py-26"
    >
      <div className="relative mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-16">
        <SectionHead
          accent="secondary"
          eyebrow="Lokasi"
          title="Kolam yang aman, parkir luas, dekat tol."
        />

        <div className="grid items-center gap-7 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="overflow-hidden rounded-[24px] border-2 border-border border-b-[5px] border-b-primary">
            <iframe
              title="Peta lokasi Fellaswimming"
              src={MAPS_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[300px] w-full md:h-[400px]"
              style={{ border: 0 }}
              allowFullScreen
            />
          </div>

          <div>
            <h3 className="mb-3.5 text-[clamp(1.5rem,2vw+0.5rem,1.9rem)] font-bold tracking-[-0.01em]">
              Kolam Anggrek
            </h3>
            <p className="mb-6 text-pretty text-[1.02rem] text-foreground-muted">
              {ADDRESS}
            </p>

            <ul className="mb-7 flex flex-col gap-3.5">
              {DETAILS.map((d) => (
                <li key={d.label} className="flex items-start gap-3.5 text-[0.95rem]">
                  <span
                    aria-hidden
                    className={`inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] border-[1.5px] border-border bg-surface border-b-[3px] ${accentToIcon[d.accent]}`}
                  >
                    {d.icon}
                  </span>
                  <div>
                    <span className="mb-0.5 block font-bold">{d.label}</span>
                    <span className="text-[0.9rem] text-foreground-muted">{d.sub}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ChunkyButton asChild href={MAPS_OPEN} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                Buka di Google Maps
              </ChunkyButton>
              <ChunkyButton asChild variant="secondary" href={WA_LINK} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                Tanya via WhatsApp
              </ChunkyButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
