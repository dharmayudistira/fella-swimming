"use server";

import "server-only";

import { redirect } from "next/navigation";

import { createServerClient } from "@/lib/supabase/server";
import {
  RequestPasswordResetSchema,
  ResetPasswordSchema,
  SignInSchema,
  type RequestPasswordResetInput,
  type ResetPasswordInput,
  type SignInInput,
} from "@/lib/validation/auth.schema";

export type AuthActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Sign in admin user. Generic "Email atau password salah" on any failure so
 * we don't leak whether the email exists.
 *
 * Redirects to /admin on success (per FR-012 — handled by Next's `redirect`
 * which throws and short-circuits this action).
 */
export async function signIn(input: SignInInput): Promise<AuthActionResult> {
  const parsed = SignInSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Email atau password salah.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { success: false, error: "Email atau password salah." };
  }

  redirect("/admin");
}

/**
 * Sign out the current admin. Always redirects to /login.
 */
export async function signOut(): Promise<never> {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Request a password reset email. Per FR-013, always returns success even
 * when the email doesn't exist — do not leak account existence.
 */
export async function requestPasswordReset(
  input: RequestPasswordResetInput,
): Promise<AuthActionResult> {
  const parsed = RequestPasswordResetSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Format email tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const supabase = await createServerClient();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });

  // Always success: do not leak whether the email is registered.
  return { success: true };
}

/**
 * Set a new password for the authenticated recovery session.
 *
 * Assumes the user already exchanged the recovery code on /reset-password —
 * see `app/(auth)/reset-password/page.tsx`. On success redirects to /admin.
 */
export async function resetPassword(
  input: ResetPasswordInput,
): Promise<AuthActionResult> {
  const parsed = ResetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Password tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      error: "Sesi reset password tidak ditemukan. Minta reset baru, ya.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      error: "Gagal mengubah password. Coba lagi sebentar.",
    };
  }

  redirect("/admin");
}
