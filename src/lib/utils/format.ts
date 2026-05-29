const ID_LOCALE = "id-ID";
const JAKARTA_TZ = "Asia/Jakarta";

/**
 * Format an ISO date as Bahasa Indonesia long form (e.g. "12 Maret 2026").
 * Returns null if the input is null/undefined/invalid.
 */
export function formatDateID(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(ID_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Relative time in Indonesian: "2 menit lalu", "1 jam lalu",
 * "Kemarin · 19:42", "3 hari lalu", "12 Mei 2026". Designed for the admin
 * tables where freshness matters more than precision.
 */
export function formatRelativeID(input: string | Date): string {
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return "—";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;

  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startYesterday = new Date(startToday);
  startYesterday.setDate(startYesterday.getDate() - 1);

  if (date >= startYesterday && date < startToday) {
    const time = date.toLocaleTimeString(ID_LOCALE, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: JAKARTA_TZ,
    });
    return `Kemarin · ${time}`;
  }

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} hari lalu`;

  return date.toLocaleDateString(ID_LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Long-form date: "Kamis, 29 Mei 2026" — used in admin topbars.
 */
export function formatLongDateID(input: Date = new Date()): string {
  return input.toLocaleDateString(ID_LOCALE, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * WhatsApp number presentation: "62812345678901" → "+62 812-3456-78901".
 * Falls back to the raw value if the format doesn't match.
 */
export function formatWhatsAppDisplay(digits: string): string {
  if (!digits.startsWith("62")) return digits;
  const rest = digits.slice(2);
  const a = rest.slice(0, 3);
  const b = rest.slice(3, 7);
  const c = rest.slice(7);
  return `+62 ${a}${b ? `-${b}` : ""}${c ? `-${c}` : ""}`.trim();
}

const CLASS_TYPE_LABEL: Record<string, string> = {
  privat: "Privat",
  semi_privat: "Semi-Privat",
  grup: "Grup",
  belum_yakin: "Belum Yakin",
};

export function formatClassType(value: string): string {
  return CLASS_TYPE_LABEL[value] ?? value;
}

const GENDER_LABEL: Record<string, string> = {
  laki_laki: "Laki-laki",
  perempuan: "Perempuan",
};

export function formatGender(value: string): string {
  return GENDER_LABEL[value] ?? value;
}

const EXPERIENCE_LABEL: Record<string, string> = {
  belum_bisa: "Belum bisa, masih takut air",
  sedikit_bisa: "Sudah berani di air, belum bisa berenang",
  sudah_bisa_dasar: "Sudah bisa dasar (mengapung, freestyle)",
  mahir: "Mahir",
};

export function formatExperience(value: string): string {
  return EXPERIENCE_LABEL[value] ?? value;
}

/**
 * "Arif Pratama" → "AP". Falls back to first two chars on single-word names.
 */
export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
