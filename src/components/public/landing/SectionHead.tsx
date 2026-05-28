import { cn } from "@/lib/utils";

import { Eyebrow } from "./Eyebrow";

type SectionHeadProps = {
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  accent?: "primary" | "secondary" | "accent" | "sun";
  className?: string;
};

export function SectionHead({
  eyebrow,
  title,
  sub,
  accent = "primary",
  className,
}: SectionHeadProps) {
  return (
    <div className={cn("mb-9 max-w-[720px] lg:mb-14", className)}>
      <Eyebrow accent={accent} className="mb-4">
        {eyebrow}
      </Eyebrow>
      <h2 className="mb-3.5 text-balance text-3xl font-bold leading-[1.12] tracking-[-0.02em] md:text-[clamp(1.8rem,3vw+0.5rem,2.6rem)]">
        {title}
      </h2>
      {sub ? (
        <p className="text-pretty text-[1.05rem] text-foreground-muted">{sub}</p>
      ) : null}
    </div>
  );
}
