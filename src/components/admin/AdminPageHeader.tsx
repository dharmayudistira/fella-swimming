import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Sticky top bar shared across admin pages. Pages render this at the top of
 * their main content (the (admin) layout only owns the sidebar + the mobile
 * gate, so headings stay close to their data fetch).
 */
export function AdminTopbar({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex items-center gap-4 border-b border-border px-7 py-4",
        "bg-background/92 backdrop-blur-sm",
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[1.35rem] font-bold leading-tight tracking-[-0.02em] text-foreground">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-0.5 truncate text-[0.86rem] text-foreground-muted">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}

/**
 * Page intro: bigger heading + sub. Used below the topbar at the top of
 * content (Pendaftaran list, Artikel list, etc).
 */
export function AdminPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-[1.5rem] font-bold leading-tight tracking-[-0.02em] text-foreground">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-[0.92rem] text-foreground-muted">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
