import { cn } from "@/lib/utils";

type WaveDirection = "sand-to-muted" | "muted-to-sand" | "sand-to-primary";

const dividerByDirection: Record<
  WaveDirection,
  { bg: string; pathFill: string }
> = {
  "sand-to-muted": {
    bg: "var(--color-surface-muted)",
    pathFill: "var(--color-background)",
  },
  "muted-to-sand": {
    bg: "var(--color-background)",
    pathFill: "var(--color-surface-muted)",
  },
  "sand-to-primary": {
    bg: "linear-gradient(180deg, var(--color-primary), var(--color-primary-dark))",
    pathFill: "var(--color-background)",
  },
};

/**
 * Single quadratic-bezier wave divider between major landing sections.
 * Background = the next section's bg; fill = the previous section's bg.
 */
export function WaveDivider({
  direction,
  className,
}: {
  direction: WaveDirection;
  className?: string;
}) {
  const config = dividerByDirection[direction];
  return (
    <div
      aria-hidden
      className={cn("block h-14 w-full", className)}
      style={{ background: config.bg }}
    >
      <svg
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
        className="block h-full w-full"
      >
        <path
          d="M0,0 L0,28 Q 180,56 360,28 T 720,28 T 1080,28 T 1440,28 L 1440,0 Z"
          fill={config.pathFill}
        />
      </svg>
    </div>
  );
}
