import { z } from "zod";

const REGISTRATION_STATUSES = [
  "baru",
  "dihubungi",
  "trial",
  "daftar",
  "tidak_lanjut",
] as const;

export const UpdateRegistrationStatusSchema = z.object({
  id: z.uuid("ID pendaftaran tidak valid."),
  status: z.enum(REGISTRATION_STATUSES, {
    error: "Pilih status pendaftaran.",
  }),
  internal_notes: z
    .string()
    .max(2000, "Catatan internal maksimal 2000 karakter.")
    .optional(),
});
export type UpdateRegistrationStatusInput = z.infer<
  typeof UpdateRegistrationStatusSchema
>;
