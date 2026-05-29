import { ArticleList } from "@/components/public/article/ArticleList";
import { Eyebrow } from "@/components/public/landing/Eyebrow";
import { getPublishedArticles } from "@/lib/queries/articles";
import { pageMetadata } from "@/lib/constants/seo";

export const revalidate = 60;

const PAGE_SIZE = 12;

export const metadata = pageMetadata({
  title: "Artikel",
  description:
    "Tulisan ringan tentang belajar renang anak: usia ideal, beda jenis kelas, tips persiapan trial, dan mitos seputar berenang.",
  path: "/artikel",
});

type SearchParams = Promise<{ page?: string }>;

export default async function ArtikelIndexPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const requested = Number(params.page ?? "1");
  const page = Number.isFinite(requested) && requested > 0 ? Math.floor(requested) : 1;
  const offset = (page - 1) * PAGE_SIZE;

  const { items, total } = await getPublishedArticles({
    limit: PAGE_SIZE,
    offset,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <section className="border-b border-dashed border-border py-14 md:py-20">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-16">
          <Eyebrow accent="secondary" className="mb-4">
            Artikel Fellaswimming
          </Eyebrow>
          <h1 className="mb-3 max-w-3xl text-balance text-[clamp(2rem,4vw+0.4rem,3.2rem)] font-bold leading-[1.06] tracking-[-0.02em]">
            Bacaan singkat untuk Bunda &amp; Ayah sebelum daftar.
          </h1>
          <p className="max-w-[56ch] text-pretty text-[1.08rem] text-foreground-muted md:text-[1.18rem]">
            Tulisan asli tim Fellaswimming — usia ideal anak mulai les, beda kelas, sampai
            tips trial pertama. Kami menulis dulu, baru jualan.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto w-full max-w-[1280px] px-5 md:px-10 lg:px-16">
          <div className="mb-6 flex items-baseline justify-between gap-3">
            <h2 className="text-[1.3rem] font-bold tracking-[-0.01em]">Semua Artikel</h2>
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-foreground-muted">
              {total} {total === 1 ? "artikel" : "artikel"}
            </span>
          </div>

          <ArticleList articles={items} page={page} totalPages={totalPages} />
        </div>
      </section>
    </>
  );
}
