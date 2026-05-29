/**
 * Deterministic gradient picker for admin row avatars (sky / coral / sun /
 * turquoise). Same `seed` → same gradient across renders so the visual
 * mapping for a given lead stays stable in tables.
 */

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, oklch(0.78 0.12 230), oklch(0.78 0.12 184))",
  "linear-gradient(135deg, oklch(0.80 0.14 15), oklch(0.80 0.10 30))",
  "linear-gradient(135deg, oklch(0.84 0.13 80), oklch(0.80 0.10 50))",
  "linear-gradient(135deg, oklch(0.78 0.12 184), oklch(0.82 0.10 200))",
] as const;

export function avatarFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}
