import type { ReactNode } from "react";

import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

/**
 * Surface card shared by all auth screens (login, lupa-password, reset-password).
 * Sky bottom-color stripe matches docs/design/project/admin-login.html. The
 * brand logo lives inside the card top (not above) per the prototype's
 * `.login__logo` placement.
 */
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
  className,
}: {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[24px] border border-border bg-surface px-7 pb-7 pt-8",
        "border-b-[6px] border-b-primary",
        "shadow-[0_24px_48px_-20px_rgba(26,35,50,0.12),0_8px_16px_-8px_rgba(26,35,50,0.06)]",
        className,
      )}
    >
      <div className="mb-7 flex items-center gap-2">
        <Logo size="sm" />
        <span className="ml-auto rounded-md bg-surface-muted px-2 py-0.5 font-mono text-[0.68rem] font-medium uppercase tracking-[0.10em] text-foreground-subtle">
          Admin
        </span>
      </div>
      <h1 className="text-[1.55rem] font-bold leading-tight tracking-[-0.02em]">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-1.5 text-[0.94rem] text-foreground-muted">{subtitle}</p>
      ) : null}
      <div className="mt-6">{children}</div>
      {footer ? <div className="mt-5">{footer}</div> : null}
    </section>
  );
}

export function AuthHint({
  icon = "i",
  children,
}: {
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-[14px] bg-surface-muted px-4 py-3.5 text-[0.86rem] text-foreground-muted">
      <span
        aria-hidden
        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-secondary-tint font-heading text-[0.78rem] font-extrabold text-secondary-dark"
      >
        {icon}
      </span>
      <div>{children}</div>
    </div>
  );
}
