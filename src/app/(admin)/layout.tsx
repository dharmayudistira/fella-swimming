import { Monitor } from "lucide-react";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminSidebar, type AdminUser } from "@/components/admin/AdminSidebar";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function deriveAdminUser(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
}): AdminUser {
  const email = user.email ?? "admin@fellaswimming.com";
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const displayName =
    (typeof meta.display_name === "string" && meta.display_name) ||
    (typeof meta.full_name === "string" && meta.full_name) ||
    email.split("@")[0];
  const initials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "A";
  // MVP has a single role (every authenticated user is admin staff). If
  // multi-role lands later, source this from `profiles.role` instead.
  const role =
    (typeof meta.role === "string" && meta.role === "owner"
      ? "Owner"
      : "Admin Staff");
  return { email, displayName, initials, role };
}

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const adminUser = deriveAdminUser(user);

  return (
    <>
      {/* Desktop shell */}
      <div className="hidden min-h-screen grid-cols-[240px_1fr] md:grid">
        <AdminSidebar user={adminUser} />
        <div className="flex min-h-screen flex-col">{children}</div>
      </div>

      {/* Mobile gate */}
      <div className="flex min-h-screen items-center justify-center px-6 py-12 md:hidden">
        <div className="flex max-w-[360px] flex-col items-center gap-4 rounded-[20px] border border-border border-b-[4px] border-b-primary bg-surface p-7 text-center shadow-md">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-tint text-primary-dark">
            <Monitor className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <h1 className="text-[1.2rem] font-bold leading-tight">
            Admin Fellaswimming hanya untuk desktop.
          </h1>
          <p className="text-[0.92rem] text-foreground-muted">
            Buka panel admin di laptop atau monitor minimal 768px. Kalau lagi di
            HP, simpan tab ini dan buka lagi nanti.
          </p>
        </div>
      </div>
    </>
  );
}
