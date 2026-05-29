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
 * Base fields — intentionally LENIENT so a draft can be saved with just a
 * title. Only `title` is always required. The stricter requirements for
 * PUBLISHED articles (excerpt, body, cover, alt) are enforced by
 * `publishRefine` below, which runs only when status === "published".
 *
 * The Tiptap JSON `content` is deliberately NOT in the form schema (its
 * recursive type breaks react-hook-form path inference) — the editor tracks
 * it via a ref and the server input schema re-attaches it.
 * ------------------------------------------------------------------ */
const articleFields = {
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
  excerpt: optionalText(160),
  content_html: z.string().optional(),
  cover_image_url: optionalText(2048),
  cover_image_alt: optionalText(280),
  category: optionalText(80),
  author_name: optionalText(120),
  seo_title: optionalText(70),
  seo_description: optionalText(200),
  status: z.enum(["draft", "published"]).default("draft"),
};

type ArticleFieldsShape = {
  status: "draft" | "published";
  excerpt?: string;
  content_html?: string;
  cover_image_url?: string;
  cover_image_alt?: string;
};

/** Publish-only requirements; drafts skip these so they save freely. */
function publishRefine(data: ArticleFieldsShape, ctx: z.RefinementCtx) {
  if (data.status !== "published") return;
  if (!data.excerpt || data.excerpt.trim().length < 10) {
    ctx.addIssue({
      code: "custom",
      path: ["excerpt"],
      message: "Ringkasan minimal 10 huruf untuk diterbitkan.",
    });
  }
  if (!data.content_html || data.content_html.trim().length === 0) {
    ctx.addIssue({
      code: "custom",
      path: ["content_html"],
      message: "Isi artikel belum ditulis.",
    });
  }
  if (!data.cover_image_url || data.cover_image_url.trim().length === 0) {
    ctx.addIssue({
      code: "custom",
      path: ["cover_image_url"],
      message: "Cover wajib diunggah untuk diterbitkan.",
    });
  }
  if (!data.cover_image_alt || data.cover_image_alt.trim().length < 3) {
    ctx.addIssue({
      code: "custom",
      path: ["cover_image_alt"],
      message: "Tulis deskripsi cover (alt) untuk diterbitkan.",
    });
  }
}

/* The form schema (react-hook-form). */
export const ArticleFormSchema = z
  .object(articleFields)
  .superRefine(publishRefine);
export type ArticleFormValues = z.infer<typeof ArticleFormSchema>;

/* Server input — form fields + Tiptap JSON. Never fed to react-hook-form. */
export const ArticleInputSchema = z
  .object({
    ...articleFields,
    content: z
      .custom<Json>((val) => val === null || typeof val === "object")
      .nullable()
      .optional(),
  })
  .superRefine(publishRefine);
export type ArticleInput = z.infer<typeof ArticleInputSchema>;
