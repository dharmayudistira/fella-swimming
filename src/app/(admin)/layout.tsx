import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AdminMobileFallback } from "@/components/admin/AdminMobileFallback";
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
      {/* Desktop shell — admin is desktop-only (min 1024px / lg) */}
      <div className="hidden min-h-screen grid-cols-[240px_1fr] lg:grid">
        <AdminSidebar user={adminUser} />
        <div className="flex min-h-screen flex-col">{children}</div>
      </div>

      {/* Below 1024px: route the user to open /admin on a desktop instead. */}
      <div className="lg:hidden">
        <AdminMobileFallback />
      </div>
    </>
  );
}
