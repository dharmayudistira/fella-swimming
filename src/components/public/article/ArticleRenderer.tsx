import { sanitizeArticleHtml } from "@/lib/utils/sanitize";
import { cn } from "@/lib/utils";

type ArticleRendererProps = {
  html: string;
  className?: string;
};

/**
 * Sanitized prose body for /artikel/[slug].
 * Prose styles are hand-defined here so we don't depend on
 * @tailwindcss/typography in Phase 1.
 */
export function ArticleRenderer({ html, className }: ArticleRendererProps) {
  const safe = sanitizeArticleHtml(html);

  return (
    <div
      className={cn(
        "prose-fs mx-auto max-w-[65ch]",
        "text-[1.05rem] leading-[1.7] text-foreground",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
