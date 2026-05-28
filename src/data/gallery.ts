export type GalleryRatio = "1/1" | "3/2" | "3/4" | "4/3" | "16/9";
export type GalleryBlob = "blob-a" | "blob-b" | "blob-c" | "blob-d" | "circle";
export type GalleryTone = "sky" | "turq" | "coral" | "sand" | "sun";

export type GalleryItem = {
  id: string;
  caption: string;
  alt: string;
  ratio: GalleryRatio;
  blob: GalleryBlob;
  tone: GalleryTone;
  /** Mobile + desktop column span (each grid is 6 cols). */
  span?: { mobile: 3 | 6; desktop: 2 | 3 | 4 };
};

/**
 * Curated gallery shots on /#galeri.
 * Photos rendered as colored placeholder blocks until owner ships real assets.
 */
export const gallery: GalleryItem[] = [
  {
    id: "sesi-grup-pagi",
    caption: "foto · sesi grup pagi",
    alt: "Sesi kelas grup pagi di kolam Anggrek",
    ratio: "3/2",
    blob: "blob-c",
    tone: "sky",
    span: { mobile: 6, desktop: 4 },
  },
  {
    id: "pelatih-anak",
    caption: "foto · pelatih + anak",
    alt: "Pelatih memandu anak belajar mengapung",
    ratio: "3/4",
    blob: "blob-d",
    tone: "turq",
    span: { mobile: 6, desktop: 2 },
  },
  {
    id: "pemanasan",
    caption: "foto · pemanasan",
    alt: "Anak-anak melakukan pemanasan di tepi kolam",
    ratio: "1/1",
    blob: "blob-a",
    tone: "sand",
  },
  {
    id: "teknik",
    caption: "foto · teknik",
    alt: "Latihan teknik freestyle dasar",
    ratio: "1/1",
    blob: "blob-b",
    tone: "coral",
  },
  {
    id: "ruang-tunggu",
    caption: "foto · ruang tunggu",
    alt: "Ruang tunggu Fellaswimming yang ber-AC",
    ratio: "1/1",
    blob: "blob-c",
    tone: "turq",
  },
  {
    id: "selesai-latihan",
    caption: "foto · selesai latihan",
    alt: "Anak-anak ceria setelah selesai latihan",
    ratio: "1/1",
    blob: "blob-d",
    tone: "sun",
  },
  {
    id: "kakak-adik",
    caption: "foto · kakak adik semi-privat",
    alt: "Kakak adik latihan bersama di kelas semi-privat",
    ratio: "1/1",
    blob: "blob-a",
    tone: "sky",
  },
  {
    id: "pemanasan-lompat",
    caption: "foto · lompat awal",
    alt: "Anak berani mencoba lompat dari pinggir kolam",
    ratio: "1/1",
    blob: "blob-b",
    tone: "sand",
  },
];
