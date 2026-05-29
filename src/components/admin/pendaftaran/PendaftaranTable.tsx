"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { PendaftaranModal } from "./PendaftaranModal";
import { StatusBadge } from "./StatusBadge";
import { avatarFor } from "@/components/admin/shared/avatar";
import { TableSkeletonRows } from "@/components/admin/shared/skeletons";
import { registrationsListKey } from "@/hooks/pendaftaranKeys";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getAdminRegistrationsList } from "@/lib/actions/registration";
import type {
  GetRegistrationsListResult,
  RegistrationListItem,
} from "@/lib/queries/registrations";
import { cn } from "@/lib/utils";
import {
  formatClassType,
  formatRelativeID,
  formatWhatsAppDisplay,
  getInitials,
} from "@/lib/utils/format";
import type { RegistrationStatus } from "@/types/database.types";

type StatusFilter = RegistrationStatus | "all";

type TabDef = {
  value: StatusFilter;
  label: string;
};

const TABS: ReadonlyArray<TabDef> = [
  { value: "all", label: "Semua" },
  { value: "baru", label: "Baru" },
  { value: "dihubungi", label: "Dihubungi" },
  { value: "trial", label: "Trial" },
  { value: "daftar", label: "Daftar" },
  { value: "tidak_lanjut", label: "Tidak Lanjut" },
];

const PAGE_SIZE = 50;

export function PendaftaranTable({
  initialData,
}: {
  initialData: GetRegistrationsListResult;
}) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput, 300);
  const [page, setPage] = useState(1);
  const [openLeadId, setOpenLeadId] = useState<string | null>(null);

  // Reset to page 1 whenever a filter or search changes.
  const queryKeyFilters = useMemo(
    () => ({ status, search, page, pageSize: PAGE_SIZE }),
    [status, search, page],
  );

  const isInitialState =
    status === "all" && search === "" && page === 1;

  const query = useQuery({
    queryKey: registrationsListKey(queryKeyFilters),
    queryFn: async (): Promise<GetRegistrationsListResult> => {
      const result = await getAdminRegistrationsList({
        status,
        search,
        page,
        pageSize: PAGE_SIZE,
      });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    initialData: isInitialState ? initialData : undefined,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });

  const list = query.data;
  const items: ReadonlyArray<RegistrationListItem> = list?.items ?? [];
  const total = list?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <>
      <div
        role="tablist"
        aria-label="Filter status pendaftaran"
        className={cn(
          "mb-4 flex flex-wrap gap-1 rounded-[14px] border border-border bg-surface-muted p-1",
        )}
      >
        {TABS.map((tab) => {
          const active = tab.value === status;
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={active}
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-[0.86rem] font-bold",
                "transition-colors",
                active
                  ? "bg-surface text-foreground shadow-[0_2px_0_var(--color-border),0_1px_2px_rgba(26,35,50,0.04)]"
                  : "text-foreground-muted hover:bg-surface/60 hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label
          className={cn(
            "flex min-w-[260px] flex-1 items-center gap-2 rounded-[12px] border border-border border-b-[3px] bg-surface px-3.5 py-2.5",
            "focus-within:border-primary focus-within:border-b-primary",
          )}
        >
          <Search
            className="h-4 w-4 shrink-0 text-foreground-subtle"
            strokeWidth={2}
          />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            placeholder="Cari nama anak, orang tua, atau nomor WhatsApp..."
            aria-label="Cari pendaftaran"
            className="w-full bg-transparent text-[0.92rem] text-foreground outline-none placeholder:text-foreground-subtle"
          />
        </label>
        {query.isFetching ? (
          <span className="inline-flex items-center gap-1.5 text-[0.82rem] text-foreground-muted">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Memuat&hellip;
          </span>
        ) : null}
      </div>

      <section className="overflow-hidden rounded-[16px] border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[0.88rem]">
            <thead>
              <tr>
                <Th>Display ID</Th>
                <Th>Anak / Orang Tua</Th>
                <Th>Kelas</Th>
                <Th>WhatsApp</Th>
                <Th>Jadwal</Th>
                <Th>Status</Th>
                <Th>Masuk</Th>
              </tr>
            </thead>
            <tbody>
              {query.isLoading ? (
                <TableSkeletonRows columns={7} />
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-[0.92rem] text-foreground-muted"
                  >
                    {search || status !== "all"
                      ? "Tidak ada lead dengan filter ini."
                      : "Belum ada pendaftaran masuk."}
                  </td>
                </tr>
              ) : (
                items.map((lead) => (
                  <tr
                    key={lead.id}
                    tabIndex={0}
                    role="button"
                    aria-label={`Buka detail pendaftaran ${lead.display_id}`}
                    onClick={() => setOpenLeadId(lead.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOpenLeadId(lead.id);
                      }
                    }}
                    className={cn(
                      "cursor-pointer border-b border-border last:border-b-0",
                      "transition-colors hover:bg-surface-muted",
                      "focus-visible:bg-primary-tint focus-visible:outline-none",
                    )}
                  >
                    <Td className="font-mono text-[0.82rem] text-foreground-muted">
                      {lead.display_id}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <span
                          aria-hidden
                          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-heading text-[0.72rem] font-bold text-white"
                          style={{ background: avatarFor(lead.id) }}
                        >
                          {getInitials(lead.student_name)}
                        </span>
                        <div className="min-w-0">
                          <div className="truncate font-bold text-foreground">
                            {lead.student_name}, {lead.student_age} thn
                          </div>
                          <div className="truncate text-[0.78rem] font-medium text-foreground-muted">
                            {lead.parent_name}
                          </div>
                        </div>
                      </div>
                    </Td>
                    <Td>{formatClassType(lead.preferred_class_type)}</Td>
                    <Td className="font-mono text-[0.82rem] text-foreground-muted">
                      {formatWhatsAppDisplay(lead.parent_whatsapp)}
                    </Td>
                    <Td className="font-mono text-[0.82rem] text-foreground-muted">
                      {lead.preferred_schedule ?? "—"}
                    </Td>
                    <Td>
                      <StatusBadge status={lead.status} />
                    </Td>
                    <Td className="font-mono text-[0.82rem] text-foreground-muted">
                      {formatRelativeID(lead.created_at)}
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {total > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-background px-5 py-3">
            <div className="text-[0.86rem] text-foreground-muted">
              Menampilkan{" "}
              <strong className="font-bold text-foreground">
                {from}–{to}
              </strong>{" "}
              dari{" "}
              <strong className="font-bold text-foreground">{total}</strong>{" "}
              pendaftaran
            </div>
            <div className="flex items-center gap-1">
              <PagerBtn
                ariaLabel="Sebelumnya"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
              </PagerBtn>
              <span className="px-2 font-mono text-[0.84rem] font-semibold text-foreground">
                {page} / {totalPages}
              </span>
              <PagerBtn
                ariaLabel="Berikutnya"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.4} />
              </PagerBtn>
            </div>
          </div>
        ) : null}
      </section>

      <PendaftaranModal
        leadId={openLeadId}
        open={openLeadId !== null}
        onOpenChange={(open) => {
          if (!open) setOpenLeadId(null);
        }}
      />
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      scope="col"
      className={cn(
        "whitespace-nowrap border-b border-border bg-surface-muted px-4 py-3 text-left",
        "font-mono text-[0.7rem] font-bold uppercase tracking-[0.08em] text-foreground-muted",
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("px-4 py-3.5 align-middle text-foreground", className)}>
      {children}
    </td>
  );
}

function PagerBtn({
  children,
  ariaLabel,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 min-w-[34px] items-center justify-center rounded-[9px] px-2",
        "border border-border border-b-2 bg-surface font-mono text-[0.84rem] font-semibold text-foreground",
        "hover:bg-surface-muted",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-surface",
      )}
    >
      {children}
    </button>
  );
}
