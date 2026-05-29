import { cn } from "@/lib/utils";
import type { ArticleStatus } from "@/lib/queries/articles";

const STATUS_META: Record<
  ArticleStatus,
  { label: string; className: string; dotClassName: string }
> = {
  published: {
    label: "Terbit",
    className: "bg-success-tint text-success-dark",
    dotClassName: "bg-success",
  },
  draft: {
    label: "Draf",
    className: "bg-sun-tint text-sun-dark",
    dotClassName: "bg-sun",
  },
};

export const ARTICLE_STATUS_OPTIONS: ReadonlyArray<{
  value: ArticleStatus;
  label: string;
}> = (Object.keys(STATUS_META) as ArticleStatus[]).map((value) => ({
  value,
  label: STATUS_META[value].label,
}));

export function ArticleStatusBadge({
  status,
  className,
}: {
  status: ArticleStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.74rem] font-bold leading-none",
        meta.className,
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("h-1.5 w-1.5 rounded-full", meta.dotClassName)}
      />
      {meta.label}
    </span>
  );
}
