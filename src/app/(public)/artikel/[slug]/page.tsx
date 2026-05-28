import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronLeft } from "lucide-react";

import { ChunkyButton } from "@/components/shared/ChunkyButton";
import { ArticleRenderer } from "@/components/public/article/ArticleRenderer";
import { getArticleBySlug } from "@/lib/queries/articles";
import { formatDateID } from "@/lib/utils/format";

export const revalidate = 300;

type RouteParams = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: RouteParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artikel tidak ditemukan — Fellaswimming",
    };
  }

  const title = article.seo_title ?? article.title;
  const description = article.seo_description ?? article.excerpt;

  return {
    title: `${title} — Fellaswimming`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: article.cover_image_url, alt: article.cover_image_alt }],
      publishedTime: article.published_at ?? undefined,
      authors: [article.author_name],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [article.cover_image_url],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: RouteParams;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const date = formatDateID(article.published_at);

  return (
    <article>
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-muted md:hidden">
        <Image
          src={article.cover_image_url}
          alt={article.cover_image_alt}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>

      <header className="mx-auto w-full max-w-[820px] px-5 pt-8 md:px-8 md:pt-14 lg:px-0">
        <Link
          href="/artikel"
          className="mb-7 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.1em] text-foreground-muted transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          Semua artikel
        </Link>

        <h1 className="mb-5 text-balance text-[clamp(2rem,3.5vw+0.4rem,3rem)] font-bold leading-[1.08] tracking-[-0.02em]">
          {article.title}
        </h1>

        <p className="mb-6 max-w-[60ch] text-pretty text-[1.05rem] text-foreground-muted md:text-[1.18rem]">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-[0.88rem] text-foreground-muted">
          <span className="font-semibold text-foreground">{article.author_name}</span>
          {date ? (
            <>
              <span aria-hidden className="h-1 w-1 rounded-full bg-border" />
              <span className="font-mono">{date}</span>
            </>
          ) : null}
          <span aria-hidden className="h-1 w-1 rounded-full bg-border" />
          <span>{article.reading_time_minutes} menit baca</span>
        </div>

        <div className="relative mt-9 hidden aspect-[16/9] overflow-hidden rounded-[24px] border-2 border-border bg-surface-muted md:block">
          <Image
            src={article.cover_image_url}
            alt={article.cover_image_alt}
            fill
            sizes="(min-width: 1024px) 820px, 100vw"
            priority
            className="object-cover"
          />
        </div>
      </header>

      <section className="mx-auto w-full max-w-[820px] px-5 py-12 md:px-8 md:py-16 lg:px-0">
        <ArticleRenderer html={article.content_html} />
      </section>

      <section className="px-5 pb-20 md:px-10 lg:px-16">
        <aside
          className="relative mx-auto w-full max-w-[820px] overflow-hidden rounded-[28px] border-2 border-border border-b-[6px] border-b-primary bg-primary-tint p-7 md:p-10"
          aria-label="Ajakan menuju jenis kelas"
        >
          <span
            aria-hidden
            className="absolute -right-12 -top-12 h-[180px] w-[180px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.85 0.12 230 / 0.45), transparent 70%)",
            }}
          />
          <div className="relative">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.12em] text-primary-dark">
              Langkah berikut
            </p>
            <h2 className="mb-3 text-balance text-[clamp(1.4rem,2vw+0.4rem,1.9rem)] font-bold leading-[1.15] tracking-[-0.015em] text-foreground">
              Lihat kelas Fellaswimming yang fit untuk anak kamu.
            </h2>
            <p className="mb-6 max-w-[52ch] text-pretty text-foreground-muted">
              Sudah dapat gambaran dari artikel ini? Lihat tiga jenis kelas — Privat,
              Semi-Privat, Grup — dengan harga dan ratio yang transparan.
            </p>
            <div className="flex flex-wrap gap-3">
              <ChunkyButton asChild variant="primary" href="/#jenis-kelas">
                Lihat jenis kelas
                <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
              </ChunkyButton>
              <ChunkyButton asChild variant="secondary" href="/artikel">
                Baca artikel lainnya
              </ChunkyButton>
            </div>
          </div>
        </aside>
      </section>
    </article>
  );
}
