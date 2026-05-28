import Image from "next/image";
import Link from "next/link";

import type { ArticleListItem } from "@/lib/queries/articles";
import { formatDateID } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

type ArticleCardProps = {
  article: ArticleListItem;
  index?: number;
  priority?: boolean;
};

const accentByIndex = [
  "border-b-primary",
  "border-b-secondary",
  "border-b-accent",
];

export function ArticleCard({ article, index = 0, priority = false }: ArticleCardProps) {
  const accent = accentByIndex[index % accentByIndex.length];
  const date = formatDateID(article.published_at);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[24px] border-[1.5px] border-border bg-surface",
        "border-b-[5px] transition-[transform,box-shadow] duration-200",
        "hover:-translate-y-1 hover:shadow-md",
        accent,
      )}
    >
      <Link
        href={`/artikel/${article.slug}`}
        className="absolute inset-0 z-10"
        aria-label={article.title}
      >
        <span className="sr-only">Baca: {article.title}</span>
      </Link>

      <div className="relative aspect-[4/3] overflow-hidden border-b-[1.5px] border-border bg-surface-muted">
        <Image
          src={article.cover_image_url}
          alt={article.cover_image_alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-1 flex-col px-5.5 pb-5.5 pt-5">
        <h3 className="mb-2 text-balance text-[1.18rem] font-bold leading-[1.25] tracking-[-0.015em]">
          {article.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-pretty text-[0.92rem] leading-[1.5] text-foreground-muted">
          {article.excerpt}
        </p>

        <div className="mt-auto flex items-center gap-2.5 border-t border-dashed border-border pt-3.5 text-[0.8rem] text-foreground-muted">
          {date ? <span className="font-mono">{date}</span> : null}
          {date ? (
            <span aria-hidden className="h-[3.5px] w-[3.5px] rounded-full bg-border" />
          ) : null}
          <span>{article.reading_time_minutes} menit baca</span>
        </div>
      </div>
    </article>
  );
}
