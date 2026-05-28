import { z } from "zod";

import { normalizeWhatsApp } from "@/lib/utils/wa";

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

const optionalText = (max: number) =>
  z
    .union([z.literal(""), z.string().trim().max(max, `Maksimal ${max} karakter.`)])
    .optional();

// Native <input type="number"> with `valueAsNumber: true` gives NaN when the
// field is empty; `.int(...)` catches NaN (Number.isInteger(NaN) === false)
// so we surface a friendly "wajib diisi" message instead of "expected number,
// received nan".
const ageField = z
  .number({ error: "Umur anak wajib diisi." })
  .int("Umur anak wajib diisi.")
  .min(3, "Minimal umur 3 tahun.")
  .max(80, "Maksimal umur 80 tahun.");

/* ------------------------------------------------------------------ *
 * Step 1 — Info Anak
 * ------------------------------------------------------------------ */
export const StepStudentSchema = z.object({
  student_name: z
    .string()
    .trim()
    .min(2, "Nama anak minimal 2 huruf.")
    .max(100, "Nama anak maksimal 100 karakter."),
  student_age: ageField,
  student_gender: z.enum(["laki_laki", "perempuan"], {
    error: "Pilih jenis kelamin anak.",
  }),
  student_experience: z.enum(
    ["belum_bisa", "sedikit_bisa", "sudah_bisa_dasar", "mahir"],
    { error: "Pilih level pengalaman renang anak." },
  ),
});

/* ------------------------------------------------------------------ *
 * Step 2 — Kelas
 * ------------------------------------------------------------------ */
export const StepClassSchema = z.object({
  preferred_class_type: z.enum(
    ["privat", "semi_privat", "grup", "belum_yakin"],
    { error: "Pilih salah satu jenis kelas." },
  ),
  preferred_schedule: optionalText(200),
  preferred_location: optionalText(200),
});

/* ------------------------------------------------------------------ *
 * Step 3 — Kontak
 * ------------------------------------------------------------------ */
export const StepContactSchema = z.object({
  parent_name: z
    .string()
    .trim()
    .min(2, "Nama orang tua minimal 2 huruf.")
    .max(100, "Maksimal 100 karakter."),
  parent_whatsapp: z
    .string()
    .trim()
    .min(1, "Nomor WhatsApp wajib diisi.")
    .refine((val) => normalizeWhatsApp(val) !== null, {
      message: "Nomor WhatsApp tidak valid. Contoh: 812-3456-7890.",
    }),
  parent_email: z
    .union([z.literal(""), z.email("Format email tidak valid.")])
    .optional(),
  notes: optionalText(1000),
});

/* ------------------------------------------------------------------ *
 * Combined form schema (used by RegistrationWizard's useForm)
 * ------------------------------------------------------------------ */
export const RegistrationFormSchema = z.object({
  ...StepStudentSchema.shape,
  ...StepClassSchema.shape,
  ...StepContactSchema.shape,
});
export type RegistrationFormValues = z.infer<typeof RegistrationFormSchema>;

/* ------------------------------------------------------------------ *
 * Server-side payload (matches submitRegistration input).
 * `parent_whatsapp` is the normalized digits-only form; the wizard
 * normalizes the raw user input before calling the action.
 * ------------------------------------------------------------------ */
export const RegistrationSchema = z.object({
  student_name: StepStudentSchema.shape.student_name,
  student_age: StepStudentSchema.shape.student_age,
  student_gender: StepStudentSchema.shape.student_gender,
  student_experience: StepStudentSchema.shape.student_experience,
  preferred_class_type: StepClassSchema.shape.preferred_class_type,
  preferred_schedule: z
    .string()
    .max(200)
    .optional()
    .or(z.literal("")),
  preferred_location: z
    .string()
    .max(200)
    .optional()
    .or(z.literal("")),
  parent_name: StepContactSchema.shape.parent_name,
  parent_whatsapp: z
    .string()
    .regex(/^62\d{9,13}$/, "Format nomor WhatsApp tidak valid."),
  parent_email: z
    .union([z.literal(""), z.email()])
    .optional(),
  notes: z
    .string()
    .max(1000)
    .optional()
    .or(z.literal("")),
});
export type RegistrationInput = z.infer<typeof RegistrationSchema>;
