"use client";

import { useState } from "react";

import { PendaftaranModal } from "@/components/admin/pendaftaran/PendaftaranModal";
import { StatusBadge } from "@/components/admin/pendaftaran/StatusBadge";
import { avatarFor } from "@/components/admin/shared/avatar";
import { cn } from "@/lib/utils";
import {
  formatClassType,
  formatRelativeID,
  formatWhatsAppDisplay,
  getInitials,
} from "@/lib/utils/format";
import type { RegistrationListItem } from "@/lib/queries/registrations";

export function RecentLeadsTable({
  leads,
}: {
  leads: ReadonlyArray<RegistrationListItem>;
}) {
  const [openLeadId, setOpenLeadId] = useState<string | null>(null);

  if (leads.length === 0) {
    return (
      <div className="px-6 py-10 text-center text-[0.92rem] text-foreground-muted">
        Belum ada pendaftaran. Begitu masuk, akan muncul di sini.
      </div>
    );
  }

  return (
    <>
      <table className="w-full border-collapse text-[0.88rem]">
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Anak / Orang Tua</Th>
            <Th>Kelas</Th>
            <Th>WhatsApp</Th>
            <Th>Status</Th>
            <Th>Masuk</Th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
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
              <Td>
                <StatusBadge status={lead.status} />
              </Td>
              <Td className="font-mono text-[0.82rem] text-foreground-muted">
                {formatRelativeID(lead.created_at)}
              </Td>
            </tr>
          ))}
        </tbody>
      </table>

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
