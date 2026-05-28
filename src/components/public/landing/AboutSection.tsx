import { Eyebrow } from "./Eyebrow";

type Stat = {
  num: string;
  label: string;
  accent: "primary" | "secondary" | "accent";
  rotate: number;
};

const STATS: Stat[] = [
  {
    num: "3",
    label: "Jenis kelas — privat sampai grup",
    accent: "primary",
    rotate: -1.2,
  },
  {
    num: "6",
    label: "Pelatih bersertifikat PRSI",
    accent: "secondary",
    rotate: 0.6,
  },
  {
    num: "2×",
    label: "Sesi / minggu · jadwal fleksibel",
    accent: "accent",
    rotate: -0.4,
  },
];

const accentToBorder: Record<Stat["accent"], string> = {
  primary: "border-b-primary",
  secondary: "border-b-secondary",
  accent: "border-b-accent",
};

const accentToText: Record<Stat["accent"], string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
};

export function AboutSection() {
  return (
    <section
      id="tentang"
      className="relative scroll-mt-24 overflow-hidden bg-surface-muted py-16 lg:py-26"
    >
      <span
        aria-hidden
        className="absolute -left-[60px] -bottom-[60px] h-[220px] w-[220px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.92 0.05 15 / 0.5), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-16">
        <div className="grid items-center gap-7 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <Eyebrow accent="accent" className="mb-4">
              Tentang Fellaswimming
            </Eyebrow>
            <p className="font-heading text-[1.3rem] font-medium leading-[1.35] tracking-[-0.01em] text-pretty lg:text-[1.7rem]">
              Sekolah renang kecil yang sengaja dibuat berbeda:{" "}
              <strong className="font-bold text-primary">semua info terbuka</strong>,
              kurikulum jelas, dan pelatih yang sabar dengan anak yang masih takut
              air. <span className="block mt-3 text-foreground-muted font-body font-normal text-base lg:text-lg">5 tahun sudah ngajarin anak-anak Sidoarjo berenang dengan aman dan terstruktur.</span>
            </p>
          </div>

          <ul className="grid grid-cols-3 gap-3 sm:gap-4">
            {STATS.map((stat) => (
              <li
                key={stat.num}
                className={`rounded-[18px] border-2 border-border ${accentToBorder[stat.accent]} border-b-[5px] bg-surface p-4 transition-transform sm:p-5`}
                style={{ transform: `rotate(${stat.rotate}deg)` }}
              >
                <span
                  className={`block font-heading text-[2.1rem] font-bold leading-none tracking-[-0.02em] ${accentToText[stat.accent]}`}
                >
                  {stat.num}
                </span>
                <span className="mt-2.5 block text-[0.85rem] font-medium leading-[1.4] text-foreground-muted">
                  {stat.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
