/**
 * URL-safe slug from arbitrary text.
 *
 * Lowercases, strips diacritics, and collapses every run of non-alphanumeric
 * characters into a single hyphen.
 *
 *   slugify("Usia Ideal Anak")      -> "usia-ideal-anak"
 *   slugify("Bedanya Privat & Grup") -> "bedanya-privat-grup"
 */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "") // strip combining diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumerics -> hyphen
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

/** Pattern a finished slug must match (used by validation schemas). */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
