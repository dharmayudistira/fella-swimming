import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronLeft } from "lucide-react";

import { ChunkyButton } from "@/components/shared/ChunkyButton";
import { ArticleRenderer } from "@/components/public/article/ArticleRenderer";
import {
  getArticleBySlug,
  getPublishedArticleSlugs,
} from "@/lib/queries/articles";
import { SITE } from "@/lib/constants/seo";
import { formatDateID } from "@/lib/utils/format";

export const revalidate = 300;

// Prerender every published article at build (FR-009 ISR). New slugs published
// later are rendered on-demand and cached for `revalidate` (dynamicParams).
export async function generateStaticParams() {
  const slugs = await getPublishedArticleSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

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
      title: "Artikel tidak ditemukan",
    };
  }

  const title = article.seo_title ?? article.title;
  const description = article.seo_description ?? article.excerpt;
  const path = `/artikel/${article.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} — ${SITE.name}`,
      description,
      url: path,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "article",
      images: [{ url: article.cover_image_url, alt: article.cover_image_alt }],
      publishedTime: article.published_at ?? undefined,
      modifiedTime: article.updated_at,
      authors: [article.author_name],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${SITE.name}`,
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
  const canonical = `${SITE.url}/artikel/${article.slug}`;

  // Article structured data (FR / TASK-069) — validates in Google Rich Results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: [article.cover_image_url],
    datePublished: article.published_at ?? article.created_at,
    dateModified: article.updated_at,
    author: { "@type": "Organization", name: article.author_name },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        // Escape "<" so an admin-entered title/excerpt can never close the
        // <script> tag (XSS-safe serialization of trusted DB fields).
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
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
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ChunkyButton asChild variant="primary" href="/#jenis-kelas" className="w-full sm:w-auto">
                Lihat jenis kelas
                <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
              </ChunkyButton>
              <ChunkyButton asChild variant="secondary" href="/artikel" className="w-full sm:w-auto">
                Baca artikel lainnya
              </ChunkyButton>
            </div>
          </div>
        </aside>
      </section>
    </article>
  );
}
