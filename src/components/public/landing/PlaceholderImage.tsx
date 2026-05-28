import { cn } from "@/lib/utils";

export type PlaceholderTone = "sky" | "turq" | "coral" | "sand" | "sun";
export type PlaceholderBlob = "blob-a" | "blob-b" | "blob-c" | "blob-d" | "circle" | "default";
export type PlaceholderRatio = "1/1" | "3/2" | "3/4" | "4/3" | "16/9";

type PlaceholderImageProps = {
  caption: string;
  alt?: string;
  tone?: PlaceholderTone;
  blob?: PlaceholderBlob;
  ratio?: PlaceholderRatio;
  className?: string;
  rotateDeg?: number;
  hideCaption?: boolean;
};

const aspectByRatio: Record<PlaceholderRatio, string> = {
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
  "3/4": "aspect-[3/4]",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-video",
};

const toneByTone: Record<
  PlaceholderTone,
  { bg: string; stripe: string; stripeLight: string }
> = {
  sky: {
    bg: "oklch(0.92 0.02 230)",
    stripe: "oklch(0.92 0.03 230)",
    stripeLight: "oklch(0.96 0.01 230)",
  },
  turq: {
    bg: "oklch(0.92 0.03 184)",
    stripe: "oklch(0.92 0.03 184)",
    stripeLight: "oklch(0.96 0.01 184)",
  },
  coral: {
    bg: "oklch(0.93 0.03 15)",
    stripe: "oklch(0.93 0.03 15)",
    stripeLight: "oklch(0.97 0.02 15)",
  },
  sand: {
    bg: "oklch(0.93 0.02 80)",
    stripe: "oklch(0.93 0.02 80)",
    stripeLight: "oklch(0.97 0.01 80)",
  },
  sun: {
    bg: "oklch(0.94 0.04 80)",
    stripe: "oklch(0.94 0.05 80)",
    stripeLight: "oklch(0.97 0.02 80)",
  },
};

const blobRadius: Record<PlaceholderBlob, string> = {
  "blob-a": "40% 60% 60% 40% / 50% 40% 60% 50%",
  "blob-b": "60% 40% 50% 50% / 40% 60% 40% 60%",
  "blob-c": "32px 8px 32px 8px",
  "blob-d": "8px 32px 8px 32px",
  circle: "50%",
  default: "var(--radius-lg)",
};

/**
 * Photo placeholder block per .impeccable.md hard ban on stock photography.
 * Solid color + diagonal stripe pattern + mono caption tag.
 * Replace with Next/Image (or real <img>) when owner ships real photos.
 */
export function PlaceholderImage({
  caption,
  alt,
  tone = "sky",
  blob = "default",
  ratio = "4/3",
  className,
  rotateDeg,
  hideCaption,
}: PlaceholderImageProps) {
  const t = toneByTone[tone];

  return (
    <div
      role="img"
      aria-label={alt ?? caption}
      className={cn(
        "relative w-full overflow-hidden border-[1.5px] border-border",
        aspectByRatio[ratio],
        className,
      )}
      style={{
        backgroundColor: t.bg,
        backgroundImage: `repeating-linear-gradient(135deg, ${t.stripeLight} 0 14px, ${t.stripe} 14px 28px)`,
        borderRadius: blobRadius[blob],
        transform: rotateDeg != null ? `rotate(${rotateDeg}deg)` : undefined,
      }}
    >
      {!hideCaption ? (
        <span
          aria-hidden
          className="absolute bottom-3.5 left-3.5 rounded-md bg-foreground/80 px-3 py-1.5 font-mono text-[0.72rem] tracking-[0.04em] text-white"
        >
          {caption}
        </span>
      ) : null}
    </div>
  );
}
