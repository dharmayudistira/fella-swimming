import type { Metadata } from "next";
import { Eye } from "lucide-react";

import { AdminPageHeader, AdminTopbar } from "@/components/admin/AdminPageHeader";
import { TestimoniTable } from "@/components/admin/testimoni/TestimoniTable";
import { ChunkyButton } from "@/components/shared/ChunkyButton";
import { getAdminTestimonials } from "@/lib/queries/testimonials";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Testimoni — Fellaswimming Admin",
  robots: { index: false, follow: false },
};

export default async function AdminTestimoniPage() {
  const initialData = await getAdminTestimonials();
  const liveCount = initialData.filter(
    (t) => t.featured && t.status === "published",
  ).length;

  return (
    <>
      <AdminTopbar
        title="Testimoni"
        subtitle={`${initialData.length} testimoni · ${liveCount} tampil di landing`}
      />

      <main className="flex-1 px-7 pb-12 pt-6">
        <AdminPageHeader
          title="Kelola Testimoni"
          subtitle="Cerita asli dari orang tua. Geser baris untuk atur urutan tampil di landing."
          actions={
            <ChunkyButton
              asChild
              href="/#testimoni"
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="sm"
            >
              <Eye className="h-4 w-4" strokeWidth={2.2} />
              Preview di Landing
            </ChunkyButton>
          }
        />
        <TestimoniTable initialData={initialData} />
      </main>
    </>
  );
}
