export type CoachAccent = "secondary" | "primary" | "accent" | "sun";

export type Coach = {
  slug: string;
  name: string;
  role: string;
  yearsExperience: number;
  bio: string;
  certifications: string[];
  accent: CoachAccent;
  photoCaption: string;
};

/**
 * Coaches displayed on /#pelatih.
 * Photos are rendered as placeholder blocks per .impeccable.md hard ban on stock photography.
 * When real photos arrive, add `photoUrl: string` and switch the section to <Image>.
 */
export const coaches: Coach[] = [
  {
    slug: "coach-rendra",
    name: "Coach Rendra",
    role: "Kepala Pelatih",
    yearsExperience: 4,
    bio: "4 tahun mengajar anak usia 4–10. Spesialis kelas privat untuk anak yang masih beradaptasi dengan air.",
    certifications: ["PRSI Lvl 2", "CPR · First Aid"],
    accent: "secondary",
    photoCaption: "foto · coach rendra",
  },
  {
    slug: "coach-anis",
    name: "Coach Anis",
    role: "Pelatih Senior",
    yearsExperience: 5,
    bio: "5 tahun mengajar. Pendekatan lembut untuk anak perempuan dan kelas kakak-adik. Disukai anak yang shy di awal.",
    certifications: ["PRSI Lvl 2", "Lifeguard"],
    accent: "primary",
    photoCaption: "foto · coach anis",
  },
  {
    slug: "coach-bayu",
    name: "Coach Bayu",
    role: "Pelatih",
    yearsExperience: 3,
    bio: "3 tahun mengajar. Fokus kelas grup dan teknik dasar. Mantan atlet renang regional Jawa Timur.",
    certifications: ["PRSI Lvl 1", "CPR · First Aid"],
    accent: "accent",
    photoCaption: "foto · coach bayu",
  },
];
