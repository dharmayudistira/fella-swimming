/**
 * Format an ISO date as Bahasa Indonesia long form (e.g. "12 Maret 2026").
 * Returns null if the input is null/undefined/invalid.
 */
export function formatDateID(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
