import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  ClipboardList,
  Clock3,
  MessageSquareQuote,
  PlusCircle,
  Sparkles,
} from "lucide-react";

import { AdminTopbar } from "@/components/admin/AdminPageHeader";
import { RecentLeadsTable } from "@/components/admin/overview/RecentLeadsTable";
import { StatCard } from "@/components/admin/overview/StatCard";
import {
  getOverviewStats,
  getRecentLeads,
} from "@/lib/queries/registrations";
import { createServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { formatLongDateID } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Dashboard — Fellaswimming Admin",
  robots: { index: false, follow: false },
};

function greeting(now: Date) {
  const h = now.getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

export default async function AdminHomePage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const adminName =
    (typeof meta.display_name === "string" && meta.display_name) ||
    (typeof meta.full_name === "string" && meta.full_name) ||
    (user?.email?.split("@")[0] ?? "Bu Admin");

  const [stats, recent] = await Promise.all([
    getOverviewStats(),
    getRecentLeads(5),
  ]);

  const now = new Date();

  return (
    <>
      <AdminTopbar title="Dashboard" subtitle={formatLongDateID(now)} />

      <main className="flex-1 px-7 pb-12 pt-6">
        <WelcomeCard
          greeting={`${greeting(now)}, ${adminName}.`}
          pending={stats.pendingFollowUp}
        />

        <section
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-labelledby="overview-stats-heading"
        >
          <h2 id="overview-stats-heading" className="sr-only">
            Statistik pendaftaran
          </h2>
          <StatCard
            variant="primary"
            icon={<CalendarRange className="h-[18px] w-[18px]" strokeWidth={2} />}
            label="Pendaftaran bulan ini"
            value={stats.thisMonth}
            hint="Total lead masuk bulan berjalan."
          />
          <StatCard
            variant="secondary"
            icon={<Sparkles className="h-[18px] w-[18px]" strokeWidth={2} />}
            label="Lead baru hari ini"
            value={stats.newToday}
            hint="Masuk antara tengah malam dan sekarang."
          />
          <StatCard
            variant="accent"
            icon={<Clock3 className="h-[18px] w-[18px]" strokeWidth={2} />}
            label="Menunggu follow-up"
            value={stats.pendingFollowUp}
            hint="Status masih Baru atau Dihubungi."
          />
        </section>

        <section
          className="mt-6 overflow-hidden rounded-[18px] border border-border bg-surface"
          aria-labelledby="recent-leads-heading"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border px-6 py-5">
            <div>
              <h2
                id="recent-leads-heading"
                className="text-[1.05rem] font-bold tracking-[-0.01em] text-foreground"
              >
                Pendaftaran terbaru
              </h2>
              <p className="mt-0.5 text-[0.82rem] text-foreground-muted">
                {recent.length > 0
                  ? "5 lead paling baru · klik baris untuk detail."
                  : "Belum ada pendaftaran masuk."}
              </p>
            </div>
            <Link
              href="/admin/pendaftaran"
              className="inline-flex items-center gap-1.5 text-[0.84rem] font-bold text-primary hover:underline"
            >
              Lihat semua
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            </Link>
          </div>
          <RecentLeadsTable leads={recent} />
        </section>

        <section className="mt-10" aria-labelledby="quick-actions-heading">
          <div className="mb-5">
            <h2
              id="quick-actions-heading"
              className="text-[1.5rem] font-bold leading-tight tracking-[-0.02em] text-foreground"
            >
              Aksi cepat
            </h2>
            <p className="mt-1 text-[0.92rem] text-foreground-muted">
              Mulai dari sini kalau tidak ada lead yang perlu ditangani.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
          <QuickCard
            href="/admin/artikel/new"
            variant="primary"
            icon={<PlusCircle className="h-[18px] w-[18px]" strokeWidth={2} />}
            title="Artikel baru"
            sub="Tulis artikel edukasi untuk ortu."
          />
          <QuickCard
            href="/admin/testimoni"
            variant="secondary"
            icon={
              <MessageSquareQuote
                className="h-[18px] w-[18px]"
                strokeWidth={2}
              />
            }
            title="Kelola testimoni"
            sub="Atur urutan & toggle featured testimoni."
          />
          <QuickCard
            href="/admin/pendaftaran"
            variant="accent"
            icon={<ClipboardList className="h-[18px] w-[18px]" strokeWidth={2} />}
            title="Triage pendaftaran"
            sub={
              stats.pendingFollowUp > 0
                ? `${stats.pendingFollowUp} lead perlu dihubungi.`
                : "Semua lead sudah ditangani. Mantap."
            }
          />
          </div>
        </section>
      </main>
    </>
  );
}

function WelcomeCard({
  greeting,
  pending,
}: {
  greeting: string;
  pending: number;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[20px] border border-[oklch(0.86_0.06_200)] border-b-[4px] border-b-primary",
        "bg-[linear-gradient(135deg,var(--color-primary-tint),var(--color-secondary-tint))] px-7 py-6",
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-16 h-[200px] w-[200px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.85 0.10 200 / 0.4), transparent 70%)",
        }}
      />
      <div className="relative">
        <div className="mb-2 font-mono text-[0.74rem] font-bold uppercase tracking-[0.08em] text-primary-dark">
          {greeting.split(",")[0]}
        </div>
        <h2 className="text-[1.5rem] font-bold leading-tight tracking-[-0.02em] text-foreground">
          {pending > 0 ? (
            <>
              Ada <strong className="text-primary-dark">{pending} lead</strong>{" "}
              menunggu di-follow-up.
            </>
          ) : (
            <>Semua lead sudah ditangani. Mantap.</>
          )}
        </h2>
        <p className="mt-1 text-[0.94rem] text-foreground-muted">
          {pending > 0
            ? "Buka panel pendaftaran untuk triage. Status Baru & Dihubungi dihitung di sini."
            : "Mulai dari aksi cepat di bawah atau review artikel & testimoni."}
        </p>
      </div>
    </section>
  );
}

const QUICK_VARIANT: Record<
  "primary" | "secondary" | "accent",
  { border: string; icon: string }
> = {
  primary: {
    border: "border-b-primary",
    icon: "bg-primary-tint text-primary-dark",
  },
  secondary: {
    border: "border-b-secondary",
    icon: "bg-secondary-tint text-secondary-dark",
  },
  accent: {
    border: "border-b-accent",
    icon: "bg-accent-tint text-accent-dark",
  },
};

function QuickCard({
  href,
  variant,
  icon,
  title,
  sub,
}: {
  href: string;
  variant: "primary" | "secondary" | "accent";
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  const styles = QUICK_VARIANT[variant];
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3.5 rounded-[16px] border border-border border-b-[4px] bg-surface p-4",
        "transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_6px_14px_-6px_rgba(26,35,50,0.1)]",
        styles.border,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]",
          styles.icon,
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate font-bold text-foreground">{title}</div>
        <div className="truncate text-[0.82rem] text-foreground-muted">{sub}</div>
      </div>
      <ArrowRight
        className="h-4 w-4 text-foreground-subtle transition-transform group-hover:translate-x-0.5"
        strokeWidth={2.2}
      />
    </Link>
  );
}
