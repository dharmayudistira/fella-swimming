import type { ClassType } from "@/types/database.types";

export type ClassSlug = Exclude<ClassType, "belum_yakin">;

export type ClassAccent = "secondary" | "primary" | "accent";

export type ClassInfo = {
  slug: ClassSlug;
  name: string;
  ratio: string;
  shortDescription: string;
  idealFor: string;
  priceAmount: string;
  priceUnit: string;
  bullets: string[];
  accent: ClassAccent;
  popular?: boolean;
};

/**
 * Three class types displayed on /#jenis-kelas.
 * `slug` is the value used in the /daftar?kelas=... deep-link.
 * Pricing placeholders — replace with owner-confirmed numbers in Phase 5.
 */
export const classes: ClassInfo[] = [
  {
    slug: "privat",
    name: "Privat",
    ratio: "1 : 1",
    shortDescription:
      "Satu anak, satu pelatih. Cocok untuk anak yang masih takut air atau perlu adaptasi pelan-pelan.",
    idealFor: "Anak yang baru pertama belajar atau butuh perhatian penuh.",
    priceAmount: "Rp 250rb",
    priceUnit: "/ sesi · 60 menit",
    bullets: [
      "Pace 100% mengikuti anak",
      "Jadwal paling fleksibel",
      "Cocok mulai dari usia 4 tahun",
    ],
    accent: "secondary",
  },
  {
    slug: "semi_privat",
    name: "Semi-Privat",
    ratio: "1 : 2–3",
    shortDescription:
      "Dua sampai tiga anak, satu pelatih. Cocok untuk kakak-adik atau teman sebaya yang mau belajar bareng.",
    idealFor: "Kakak-adik atau anak yang punya teman sebaya.",
    priceAmount: "Rp 150rb",
    priceUnit: "/ sesi / anak",
    bullets: [
      "Tetap dapat perhatian individu",
      "Ada teman untuk memotivasi",
      "Pilihan paling banyak diambil",
    ],
    accent: "primary",
    popular: true,
  },
  {
    slug: "grup",
    name: "Grup",
    ratio: "1–2 : 4–6",
    shortDescription:
      "Empat sampai enam anak, satu sampai dua pelatih. Cocok untuk anak yang sudah berani di air.",
    idealFor: "Anak yang sudah nyaman di air dan suka suasana ramai.",
    priceAmount: "Rp 100rb",
    priceUnit: "/ sesi / anak",
    bullets: [
      "Suasana sosial, banyak teman",
      "Paling hemat untuk progres rutin",
      "Disesuaikan kelompok usia",
    ],
    accent: "accent",
  },
];
