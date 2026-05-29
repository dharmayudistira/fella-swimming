import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi.")
    .pipe(z.email("Format email tidak valid.")),
  password: z.string().min(1, "Password wajib diisi."),
});
export type SignInInput = z.infer<typeof SignInSchema>;

export const RequestPasswordResetSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi.")
    .pipe(z.email("Format email tidak valid.")),
});
export type RequestPasswordResetInput = z.infer<
  typeof RequestPasswordResetSchema
>;

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password minimal 8 karakter.")
      .max(72, "Password maksimal 72 karakter."),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Konfirmasi password belum cocok.",
    path: ["confirm"],
  });
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
