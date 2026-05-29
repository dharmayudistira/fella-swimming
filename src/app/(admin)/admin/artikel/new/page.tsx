import type { Metadata } from "next";

import { ArticleEditor } from "@/components/admin/artikel/ArticleEditor";
import { getCategories } from "@/lib/queries/articles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artikel Baru — Fellaswimming Admin",
  robots: { index: false, follow: false },
};

export default async function NewArticlePage() {
  const categories = await getCategories();
  return <ArticleEditor categories={categories} />;
}
