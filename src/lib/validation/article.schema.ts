import { z } from "zod";

import { SLUG_PATTERN } from "@/lib/utils/slug";
import type { Json } from "@/types/database.types";

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const optionalText = (max: number) =>
  z
    .union([z.literal(""), z.string().trim().max(max, `Maksimal ${max} karakter.`)])
    .optional();

/* ------------------------------------------------------------------ *
 * Article FORM schema — the fields react-hook-form manages. The Tiptap
 * JSON `content` is deliberately NOT here: its recursive type breaks RHF's
 * path inference. The editor tracks `content` separately and the server
 * input schema below re-attaches it.
 *
 * `category` is the free-text category NAME; the server resolves it to a
 * `category_id` (creating the category if new). `slug` is optional and
 * auto-generated from the title when blank. `content_html` is re-sanitized
 * server-side before persistence.
 * ------------------------------------------------------------------ */
export const ArticleFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Judul minimal 3 huruf.")
    .max(160, "Judul maksimal 160 karakter."),
  slug: z
    .union([
      z.literal(""),
      z
        .string()
        .trim()
        .max(160, "Slug maksimal 160 karakter.")
        .regex(
          SLUG_PATTERN,
          "Slug hanya boleh huruf kecil, angka, dan tanda hubung.",
        ),
    ])
    .optional(),
  excerpt: z
    .string()
    .trim()
    .min(10, "Ringkasan minimal 10 huruf.")
    .max(160, "Ringkasan maksimal 160 karakter."),
  content_html: z.string().min(1, "Isi artikel belum ditulis."),
  cover_image_url: z
    .string()
    .trim()
    .min(1, "Cover artikel wajib diunggah.")
    .max(2048, "URL cover terlalu panjang."),
  cover_image_alt: z
    .string()
    .trim()
    .min(3, "Tulis deskripsi singkat untuk cover (alt text).")
    .max(280, "Maksimal 280 karakter."),
  category: optionalText(80),
  author_name: optionalText(120),
  seo_title: optionalText(70),
  seo_description: optionalText(200),
  status: z.enum(["draft", "published"]).default("draft"),
});
export type ArticleFormValues = z.infer<typeof ArticleFormSchema>;

/* ------------------------------------------------------------------ *
 * Server input — form fields + the Tiptap JSON document. Used by the
 * CRUD actions; never fed to react-hook-form.
 * ------------------------------------------------------------------ */
export const ArticleInputSchema = ArticleFormSchema.extend({
  content: z.custom<Json>(
    (val) => val !== null && typeof val === "object",
    { error: "Konten artikel belum lengkap." },
  ),
});
export type ArticleInput = z.infer<typeof ArticleInputSchema>;
