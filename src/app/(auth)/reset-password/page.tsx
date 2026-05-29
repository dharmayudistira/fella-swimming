import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { ChunkyButton } from "@/components/shared/ChunkyButton";
import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Atur Password Baru — Fellaswimming",
  description: "Atur ulang password admin Fellaswimming.",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{
  code?: string;
  error?: string;
  error_description?: string;
}>;

/**
 * /reset-password — landing page after the user clicks the recovery email.
 *
 * Supabase Auth with @supabase/ssr uses PKCE: the email link redirects here
 * with `?code=...`. We exchange the code for a session (cookies are written
 * via the server client) so the user can call the resetPassword action.
 *
 * If `code` is missing/invalid or already used, render the "invalid link" state.
 */
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const supabase = await createServerClient();

  let recoverySessionActive = false;

  if (params.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code);
    if (!error) {
      recoverySessionActive = true;
    }
  } else {
    // No code in URL — check if a recovery session was already exchanged on a
    // previous render in this tab (cookies still fresh).
    const {
      data: { user },
    } = await supabase.auth.getUser();
    recoverySessionActive = !!user;
  }

  if (!recoverySessionActive || params.error) {
    return (
      <AuthCard
        title="Tautan reset tidak valid."
        subtitle="Tautannya sudah kedaluwarsa atau pernah dipakai sebelumnya. Minta tautan baru, ya."
        footer={
          <p className="text-center text-[0.86rem] text-foreground-muted">
            Atau{" "}
            <Link
              href="/login"
              className="font-semibold text-foreground hover:text-primary"
            >
              kembali ke login
            </Link>
          </p>
        }
      >
        <ChunkyButton
          asChild
          href="/lupa-password"
          variant="primary"
          size="md"
          className="w-full"
        >
          Minta tautan reset baru
        </ChunkyButton>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Atur password baru."
      subtitle="Pilih password yang panjang dan tidak kamu pakai di tempat lain. Minimal 8 karakter."
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
