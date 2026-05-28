import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  href?: string;
  className?: string;
  size?: "sm" | "md";
};

/**
 * Brand wordmark + bubble-glyph mark.
 * Mark composition matches docs/design/project/landing.html .logo__mark:
 * radial sky base + soft turquoise underlight + sun-yellow highlight.
 */
export function Logo({ href = "/", className, size = "md" }: LogoProps) {
  const isSmall = size === "sm";

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 font-heading font-bold tracking-tight text-foreground",
        isSmall ? "text-base" : "text-[1.1rem]",
        className,
      )}
      aria-label="Fellaswimming — beranda"
    >
      <span
        aria-hidden
        className={cn(
          "relative shrink-0 rounded-[12px]",
          isSmall ? "h-8 w-8" : "h-[34px] w-[34px]",
        )}
        style={{
          background:
            "radial-gradient(circle at 28% 28%, oklch(0.92 0.07 200), var(--color-primary) 70%)",
          boxShadow: "0 4px 10px -2px oklch(0.71 0.14 230 / 0.45)",
        }}
      >
        <span
          aria-hidden
          className="absolute left-[6px] right-[6px] top-[18px] h-[9px]"
          style={{
            borderRadius: "50% / 100%",
            background:
              "linear-gradient(180deg, oklch(0.85 0.10 184), oklch(0.73 0.13 184 / 0))",
          }}
        />
        <span
          aria-hidden
          className="absolute right-[5px] top-[5px] h-2 w-2 rounded-full"
          style={{ background: "oklch(0.95 0.04 80)" }}
        />
      </span>
      <span>Fellaswimming</span>
    </Link>
  );
}
