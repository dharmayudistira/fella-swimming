/**
 * Normalize a WhatsApp number to digits-only with Indonesia country code.
 *
 * Accepts common parent input shapes: "08123456789", "+62 812-3456-7890",
 * "62812 3456 789". Strips spaces, dashes, dots, plus. Converts leading `0`
 * to `62`. Returns null if the final value is not `^62\d{9,13}$`.
 */
export function normalizeWhatsApp(input: string): string | null {
  if (!input) return null;
  const cleaned = input.replace(/[\s\-+().]/g, "");
  if (!/^\d+$/.test(cleaned)) return null;

  let normalized = cleaned;
  if (normalized.startsWith("0")) {
    normalized = "62" + normalized.slice(1);
  } else if (!normalized.startsWith("62")) {
    // Bare number like "8123456789" — assume Indonesia and prefix 62.
    normalized = "62" + normalized;
  }

  return /^62\d{9,13}$/.test(normalized) ? normalized : null;
}

/**
 * Build a wa.me deep-link with a pre-filled message.
 *
 * `phone` must already be normalized digits-only (use `normalizeWhatsApp`).
 */
export function buildWhatsAppLink(phone: string, message?: string): string {
  const base = `https://wa.me/${phone}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
