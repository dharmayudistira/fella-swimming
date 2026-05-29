import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "accent";

const VARIANT_BORDER: Record<Variant, string> = {
  primary: "border-b-primary",
  secondary: "border-b-secondary",
  accent: "border-b-accent",
};

const VARIANT_ICON: Record<Variant, string> = {
  primary: "bg-primary-tint text-primary-dark",
  secondary: "bg-secondary-tint text-secondary-dark",
  accent: "bg-accent-tint text-accent-dark",
};

export function StatCard({
  variant = "primary",
  icon,
  label,
  value,
  hint,
}: {
  variant?: Variant;
  icon: ReactNode;
  label: string;
  value: number | string;
  hint?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-border border-b-[4px] bg-surface p-5",
        "transition-transform hover:-translate-y-0.5",
        VARIANT_BORDER[variant],
      )}
    >
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-[11px]",
            VARIANT_ICON[variant],
          )}
          aria-hidden
        >
          {icon}
        </span>
        <span className="text-[0.84rem] font-semibold text-foreground-muted">
          {label}
        </span>
      </div>
      <div className="font-heading text-[2.2rem] font-bold leading-none tracking-[-0.025em] text-foreground">
        {value}
      </div>
      {hint ? (
        <div className="mt-2 text-[0.8rem] text-foreground-muted">{hint}</div>
      ) : null}
    </div>
  );
}
