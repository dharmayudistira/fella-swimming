import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthCard, AuthHint } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Login — Fellaswimming",
  description: "Masuk ke dashboard admin Fellaswimming.",
  robots: { index: false, follow: false },
};

const CALLBACK_ERROR_COPY: Record<string, string> = {
  missing_code:
    "Tautan tidak lengkap. Coba minta kirim ulang dari halaman lupa password.",
  auth_exchange_failed:
    "Tautannya sudah kedaluwarsa atau dipakai sebelumnya. Minta tautan baru, ya.",
};

/**
 * /login — admin sign-in entry point.
 *
 * If a session is already active (cookies fresh via proxy.ts), short-circuit
 * to /admin per FR-012. Otherwise render the login card.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/admin");
  }

  const { error } = await searchParams;
  const callbackError = error ? CALLBACK_ERROR_COPY[error] : undefined;

  return (
    <AuthCard
      title="Selamat datang kembali."
      subtitle="Masuk untuk lihat pendaftaran terbaru dan kelola artikel."
      footer={
        <AuthHint>
          Akses admin hanya untuk tim Fellaswimming. Ortu yang mau daftar les
          renang,{" "}
          <Link
            href="/daftar"
            className="font-bold text-primary hover:underline"
          >
            daftar di sini
          </Link>
          .
        </AuthHint>
      }
    >
      {callbackError ? (
        <div
          role="alert"
          className="mb-4 rounded-[12px] border border-destructive/30 bg-destructive/10 px-4 py-3 text-[0.88rem] font-semibold text-destructive"
        >
          {callbackError}
        </div>
      ) : null}
      <LoginForm />
    </AuthCard>
  );
}
