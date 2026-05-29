import type { Metadata } from "next";

import {
  AdminPageHeader,
  AdminTopbar,
} from "@/components/admin/AdminPageHeader";
import { PendaftaranTable } from "@/components/admin/pendaftaran/PendaftaranTable";
import {
  getOverviewStats,
  getRegistrationsList,
} from "@/lib/queries/registrations";

export const metadata: Metadata = {
  title: "Pendaftaran — Fellaswimming Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPendaftaranPage() {
  const [initialList, stats] = await Promise.all([
    getRegistrationsList({ page: 1, pageSize: 50 }),
    getOverviewStats(),
  ]);

  const subtitle =
    initialList.total === 0
      ? "Belum ada pendaftaran masuk."
      : `${initialList.total} total · ${stats.newToday} baru hari ini`;

  return (
    <>
      <AdminTopbar title="Pendaftaran" subtitle={subtitle} />

      <main className="flex-1 px-7 pb-12 pt-6">
        <AdminPageHeader
          title="Semua pendaftaran"
          subtitle="Triage lead per status. Klik baris untuk lihat detail & follow-up via WhatsApp."
        />
        <PendaftaranTable initialData={initialList} />
      </main>
    </>
  );
}
