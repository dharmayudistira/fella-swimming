import { cn } from "@/lib/utils";

type EyebrowProps = {
  children: React.ReactNode;
  accent?: "primary" | "secondary" | "accent" | "sun";
  className?: string;
};

const dotByAccent: Record<NonNullable<EyebrowProps["accent"]>, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  sun: "bg-sun",
};

/**
 * Section-header eyebrow pill: pulsing accent dot + uppercase mono micro-label.
 * Signature device per .impeccable.md § Signature Patterns.
 */
export function Eyebrow({ children, accent = "primary", className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border-[1.5px] border-border bg-surface px-3.5 py-[7px]",
        "font-mono text-[0.74rem] font-medium uppercase tracking-[0.12em] text-foreground-muted",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("h-[7px] w-[7px] rounded-full eyebrow-pulse", dotByAccent[accent])}
      />
      {children}
    </span>
  );
}
