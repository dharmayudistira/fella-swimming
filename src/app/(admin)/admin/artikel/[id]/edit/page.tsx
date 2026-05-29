import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleEditor } from "@/components/admin/artikel/ArticleEditor";
import { getArticleById, getCategories } from "@/lib/queries/articles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Artikel — Fellaswimming Admin",
  robots: { index: false, follow: false },
};

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    getArticleById(id),
    getCategories(),
  ]);
  if (!article) notFound();
  return <ArticleEditor article={article} categories={categories} />;
}
