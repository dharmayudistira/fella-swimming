import Link from "next/link";

import type { ArticleListItem } from "@/lib/queries/articles";
import { cn } from "@/lib/utils";

import { ArticleCard } from "./ArticleCard";

type ArticleListProps = {
  articles: ArticleListItem[];
  page: number;
  totalPages: number;
};

export function ArticleList({ articles, page, totalPages }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-[24px] border-2 border-dashed border-border bg-surface px-6 py-12 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-foreground-subtle">
          belum ada artikel
        </p>
        <p className="mt-3 text-pretty text-base text-foreground-muted">
          Artikel baru sedang dipersiapkan. Cek lagi minggu depan, ya.
        </p>
        <Link
          href="/"
          className="mt-5 inline-block text-sm font-semibold text-primary underline-offset-2 hover:underline"
        >
          ← Kembali ke beranda
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
        {articles.map((article, idx) => (
          <li key={article.id} className="h-full">
            <ArticleCard article={article} index={idx} priority={idx === 0 && page === 1} />
          </li>
        ))}
      </ul>

      {totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} />
      ) : null}
    </>
  );
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;

  return (
    <nav
      aria-label="Pagination artikel"
      className="mt-12 flex items-center justify-between gap-4"
    >
      <PaginationLink page={prev} label="← Sebelumnya" />
      <span className="font-mono text-xs uppercase tracking-[0.12em] text-foreground-subtle">
        Halaman {page} dari {totalPages}
      </span>
      <PaginationLink page={next} label="Selanjutnya →" align="right" />
    </nav>
  );
}

function PaginationLink({
  page,
  label,
  align,
}: {
  page: number | null;
  label: string;
  align?: "right";
}) {
  const base =
    "inline-flex items-center gap-2 rounded-[14px] border-[1.5px] border-border bg-surface px-4 py-2.5 text-sm font-semibold transition-colors";
  const enabled = "hover:bg-surface-muted hover:text-primary";
  const disabled = "pointer-events-none opacity-50";

  if (page == null) {
    return <span className={cn(base, disabled, align === "right" && "ml-auto")}>{label}</span>;
  }
  return (
    <Link
      href={`/artikel?page=${page}`}
      className={cn(base, enabled, align === "right" && "ml-auto")}
    >
      {label}
    </Link>
  );
}
