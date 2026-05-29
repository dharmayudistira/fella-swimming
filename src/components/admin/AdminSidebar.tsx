"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Newspaper,
} from "lucide-react";
import type { ReactNode } from "react";

import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/actions/auth";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  match: (pathname: string) => boolean;
};

const OPERATIONAL: ReadonlyArray<NavItem> = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-[18px] w-[18px]" strokeWidth={2} />,
    match: (p) => p === "/admin",
  },
  {
    label: "Pendaftaran",
    href: "/admin/pendaftaran",
    icon: <ClipboardList className="h-[18px] w-[18px]" strokeWidth={2} />,
    match: (p) => p.startsWith("/admin/pendaftaran"),
  },
];

const CONTENT: ReadonlyArray<NavItem> = [
  {
    label: "Artikel",
    href: "/admin/artikel",
    icon: <Newspaper className="h-[18px] w-[18px]" strokeWidth={2} />,
    match: (p) => p.startsWith("/admin/artikel"),
  },
  {
    label: "Testimoni",
    href: "/admin/testimoni",
    icon: <MessageSquareQuote className="h-[18px] w-[18px]" strokeWidth={2} />,
    match: (p) => p.startsWith("/admin/testimoni"),
  },
];

export type AdminUser = {
  email: string;
  displayName: string;
  initials: string;
  role: string;
};

export function AdminSidebar({ user }: { user: AdminUser }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen w-[240px] flex-col bg-sidebar text-sidebar-foreground",
        "px-4 py-5 md:flex",
      )}
    >
      <div className="px-2 pb-2">
        <Logo size="sm" href="/admin" className="!text-white" />
      </div>

      <SidebarSection label="Operasional" items={OPERATIONAL} pathname={pathname} />
      <SidebarSection label="Konten" items={CONTENT} pathname={pathname} />

      <div className="mt-auto rounded-[12px] bg-white/[0.04] p-3">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="inline-flex h-9 w-9 items-center justify-center rounded-full font-heading text-[0.84rem] font-bold text-white"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.14 15), oklch(0.78 0.12 30))",
            }}
          >
            {user.initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[0.86rem] font-bold leading-tight text-white">
              {user.displayName}
            </div>
            <div className="truncate text-[0.72rem] text-sidebar-foreground-muted">
              {user.role}
            </div>
          </div>
        </div>
        <form action={signOut} className="mt-2.5">
          <button
            type="submit"
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-[10px] border border-white/10",
              "bg-white/[0.03] px-3 py-2 text-[0.82rem] font-semibold text-white/85 transition-colors",
              "hover:bg-white/10 hover:text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
            )}
          >
            <LogOut className="h-4 w-4" strokeWidth={2.2} />
            Keluar
          </button>
        </form>
      </div>
    </aside>
  );
}

function SidebarSection({
  label,
  items,
  pathname,
}: {
  label: string;
  items: ReadonlyArray<NavItem>;
  pathname: string;
}) {
  return (
    <>
      <div className="px-3 pb-1.5 pt-3.5 font-mono text-[0.62rem] font-bold uppercase tracking-[0.12em] text-sidebar-foreground-muted">
        {label}
      </div>
      <nav className="flex flex-col gap-0.5">
        {items.map((item) => {
          const isActive = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[0.92rem] font-medium",
                "text-sidebar-foreground transition-colors",
                "hover:bg-white/[0.06] hover:text-white",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                isActive &&
                  "bg-sidebar-accent text-white font-bold shadow-[inset_0_0_0_1px_oklch(0.71_0.14_230_/_0.4)]",
              )}
            >
              <span className="inline-flex h-[22px] w-[22px] items-center justify-center">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
