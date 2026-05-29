import type { Metadata } from "next";
import { Plus } from "lucide-react";

import { AdminPageHeader, AdminTopbar } from "@/components/admin/AdminPageHeader";
import { ArtikelTable } from "@/components/admin/artikel/ArtikelTable";
import { ChunkyButton } from "@/components/shared/ChunkyButton";
import { getAdminArticles, getCategories } from "@/lib/queries/articles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artikel — Fellaswimming Admin",
  robots: { index: false, follow: false },
};

export default async function AdminArtikelPage() {
  const [initialData, categories] = await Promise.all([
    getAdminArticles({ page: 1, pageSize: 10 }),
    getCategories(),
  ]);

  return (
    <>
      <AdminTopbar title="Artikel" subtitle={`${initialData.total} artikel`} />

      <main className="flex-1 px-7 pb-12 pt-6">
        <AdminPageHeader
          title="Kelola Artikel"
          subtitle="Konten edukasi yang jadi pintu masuk SEO Fellaswimming."
          actions={
            <ChunkyButton
              asChild
              href="/admin/artikel/new"
              variant="primary"
              size="sm"
            >
              <Plus className="h-4 w-4" strokeWidth={2.4} />
              Artikel Baru
            </ChunkyButton>
          }
        />
        <ArtikelTable initialData={initialData} categories={categories} />
      </main>
    </>
  );
}
