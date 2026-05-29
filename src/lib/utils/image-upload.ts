/**
 * Shared image-upload constraints. Imported by both the server upload action
 * (uploads.ts) and the client pickers so the rules stay in one place.
 * No "server-only" guard — safe on both sides.
 *
 * ⚠️ Client-bundle eligible: never add secrets or server-only values here.
 */

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

/** Allowed MIME type -> file extension. */
export const IMAGE_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Accept attribute for <input type="file">. */
export const IMAGE_ACCEPT = Object.keys(IMAGE_EXT).join(",");

/**
 * Client-side pre-check that mirrors the server guard. Returns a
 * Bahasa Indonesia error message, or null when the file is acceptable.
 */
export function validateImageFile(file: File): string | null {
  if (!IMAGE_EXT[file.type]) {
    return "Format file tidak didukung. Pakai JPG, PNG, atau WebP.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Ukuran maksimal 5MB.";
  }
  return null;
}
