import { z } from "zod";

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const optionalText = (max: number) =>
  z
    .union([z.literal(""), z.string().trim().max(max, `Maksimal ${max} karakter.`)])
    .optional();

/* ------------------------------------------------------------------ *
 * Testimonial input — shared by the admin modal (RHF) and CRUD actions.
 * `display_order` is assigned server-side (max + 1 on create), not here.
 * ------------------------------------------------------------------ */
export const TestimonialInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama minimal 2 huruf.")
    .max(120, "Maksimal 120 karakter."),
  role: optionalText(120),
  rating: z
    .number({ error: "Pilih rating bintang." })
    .int("Rating tidak valid.")
    .min(1, "Minimal 1 bintang.")
    .max(5, "Maksimal 5 bintang."),
  text: z
    .string()
    .trim()
    .min(10, "Isi testimoni minimal 10 huruf.")
    .max(300, "Maksimal 300 karakter."),
  photo_url: optionalText(2048),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("draft"),
});
export type TestimonialInput = z.infer<typeof TestimonialInputSchema>;

/* ------------------------------------------------------------------ *
 * Drag-reorder payload — ordered list of testimonial ids; the action
 * writes each id's index back to `display_order`.
 * ------------------------------------------------------------------ */
export const ReorderTestimonialsSchema = z.object({
  orderedIds: z
    .array(z.uuid("ID testimoni tidak valid."))
    .min(1, "Tidak ada testimoni untuk diurutkan."),
});
export type ReorderTestimonialsInput = z.infer<typeof ReorderTestimonialsSchema>;
