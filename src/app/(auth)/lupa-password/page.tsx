import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthCard } from "@/components/auth/AuthCard";
import { LupaPasswordForm } from "@/components/auth/LupaPasswordForm";
import { createServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Lupa Password — Fellaswimming",
  description: "Minta tautan reset password dashboard admin Fellaswimming.",
  robots: { index: false, follow: false },
};

export default async function LupaPasswordPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/admin");
  }

  return (
    <AuthCard
      title="Reset password."
      subtitle="Masukkan email admin yang kamu pakai. Tautan reset password akan dikirim ke inbox kamu."
      footer={
        <p className="text-center text-[0.86rem] text-foreground-muted">
          Sudah ingat passwordnya?{" "}
          <Link
            href="/login"
            className="font-semibold text-foreground hover:text-primary"
          >
            Kembali ke login
          </Link>
        </p>
      }
    >
      <LupaPasswordForm />
    </AuthCard>
  );
}
