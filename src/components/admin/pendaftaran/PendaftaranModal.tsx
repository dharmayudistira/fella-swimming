"use client";

import { Dialog } from "@base-ui/react/dialog";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  MessageCircle,
  Save,
  StickyNote,
  X,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { STATUS_OPTIONS, StatusBadge, getStatusLabel } from "./StatusBadge";
import { ChunkyButton } from "@/components/shared/ChunkyButton";
import { REGISTRATION_DETAIL_KEY } from "@/hooks/pendaftaranKeys";
import { usePendaftaranMutation } from "@/hooks/usePendaftaranMutation";
import { getAdminRegistrationDetail } from "@/lib/actions/registration";
import type { Registration } from "@/lib/queries/registrations";
import { cn } from "@/lib/utils";
import {
  formatClassType,
  formatExperience,
  formatGender,
  formatRelativeID,
  formatWhatsAppDisplay,
} from "@/lib/utils/format";
import { buildWhatsAppLink } from "@/lib/utils/wa";
import type { RegistrationStatus } from "@/types/database.types";

export function PendaftaranModal({
  leadId,
  open,
  onOpenChange,
}: {
  leadId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop
          className={cn(
            "fixed inset-0 z-[100] bg-foreground/45 backdrop-blur-[4px]",
            "data-open:animate-in data-open:fade-in-0",
            "data-closed:animate-out data-closed:fade-out-0",
          )}
        />
        <Dialog.Popup
          className={cn(
            "fixed left-1/2 top-16 z-[101] w-[min(720px,calc(100vw-48px))] -translate-x-1/2",
            "flex max-h-[calc(100vh-96px)] flex-col overflow-hidden rounded-[20px] border border-border bg-surface",
            "shadow-[0_36px_64px_-20px_rgba(26,35,50,0.3),0_12px_24px_-10px_rgba(26,35,50,0.15)]",
            "data-open:animate-in data-open:zoom-in-95 data-open:fade-in-0",
            "data-closed:animate-out data-closed:zoom-out-95 data-closed:fade-out-0",
            "focus:outline-none",
          )}
        >
          {leadId ? <ModalContent leadId={leadId} /> : null}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ModalContent({ leadId }: { leadId: string }) {
  const query = useQuery({
    queryKey: REGISTRATION_DETAIL_KEY(leadId),
    queryFn: async (): Promise<Registration> => {
      const result = await getAdminRegistrationDetail(leadId);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    staleTime: 30_000,
  });

  if (query.isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 px-8 py-16 text-foreground-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
        Memuat detail pendaftaran&hellip;
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="flex flex-col items-start gap-2 px-8 py-12">
        <h2 className="text-lg font-bold text-foreground">
          Detail tidak bisa dimuat.
        </h2>
        <p className="text-sm text-foreground-muted">
          {query.error instanceof Error
            ? query.error.message
            : "Coba tutup modal lalu buka lagi."}
        </p>
        <Dialog.Close className="mt-2 inline-flex items-center gap-2 rounded-[10px] border border-border bg-surface px-3 py-1.5 text-sm font-semibold text-foreground hover:bg-surface-muted">
          Tutup
        </Dialog.Close>
      </div>
    );
  }

  // `key={lead.id}` remounts ModalBody when navigating between leads, so the
  // local edit state (status, notes) re-seeds from fresh server data without
  // a setState-in-effect cascade.
  return <ModalBody key={query.data.id} lead={query.data} />;
}

function ModalBody({ lead }: { lead: Registration }) {
  const [status, setStatus] = useState<RegistrationStatus>(lead.status);
  const [notes, setNotes] = useState<string>(lead.internal_notes ?? "");
  const mutation = usePendaftaranMutation();

  const dirty =
    status !== lead.status || (notes ?? "") !== (lead.internal_notes ?? "");

  const whatsappUrl = useMemo(() => {
    const message = `Halo Bunda ${lead.parent_name} (atau Ayah), ini Fellaswimming. Pendaftaran (ref: ${lead.display_id}) untuk ${lead.student_name} sudah kami terima. Boleh kita atur jadwal trial-nya?`;
    return buildWhatsAppLink(lead.parent_whatsapp, message);
  }, [lead.parent_name, lead.parent_whatsapp, lead.display_id, lead.student_name]);

  const onSave = () => {
    mutation.mutate(
      {
        id: lead.id,
        status,
        internal_notes: notes.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Perubahan tersimpan.");
        },
        onError: (err) => {
          toast.error(
            err instanceof Error
              ? err.message
              : "Gagal menyimpan. Coba lagi sebentar.",
          );
        },
      },
    );
  };

  return (
    <>
      <header className="flex shrink-0 items-start gap-4 border-b border-border bg-surface px-7 pb-5 pt-6">
        <div className="min-w-0 flex-1">
          <span className="mb-2 inline-flex rounded-md bg-primary-tint px-2.5 py-1 font-mono text-[0.76rem] font-bold uppercase tracking-[0.04em] text-primary-dark">
            {lead.display_id}
          </span>
          <Dialog.Title className="text-[1.3rem] font-bold leading-tight tracking-[-0.02em] text-foreground">
            {lead.student_name} · {lead.student_age} tahun
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-[0.86rem] text-foreground-muted">
            {lead.parent_name} · daftar {formatRelativeID(lead.created_at)}
          </Dialog.Description>
        </div>
        <Dialog.Close
          aria-label="Tutup"
          className={cn(
            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]",
            "border border-border border-b-[3px] bg-surface-muted text-foreground",
            "hover:bg-surface-muted/80",
          )}
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
        </Dialog.Close>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-7 py-6">
        <Section title="Info anak">
          <KvGrid>
            <Kv label="Nama" value={lead.student_name} />
            <Kv label="Umur" value={`${lead.student_age} tahun`} />
            <Kv label="Jenis kelamin" value={formatGender(lead.student_gender)} />
            <Kv
              label="Pengalaman"
              value={formatExperience(lead.student_experience)}
            />
          </KvGrid>
        </Section>

        <Section title="Pilihan kelas">
          <KvGrid>
            <Kv
              label="Tipe kelas"
              value={formatClassType(lead.preferred_class_type)}
            />
            <Kv label="Jadwal preferensi" value={lead.preferred_schedule ?? "—"} />
            <Kv label="Lokasi" value={lead.preferred_location ?? "—"} />
          </KvGrid>
        </Section>

        <Section title="Kontak orang tua">
          <KvGrid>
            <Kv label="Nama" value={lead.parent_name} />
            <Kv
              label="WhatsApp"
              value={
                <span className="font-mono">
                  {formatWhatsAppDisplay(lead.parent_whatsapp)}
                </span>
              }
            />
            <Kv label="Email" value={lead.parent_email ?? "—"} />
          </KvGrid>
          {lead.notes ? (
            <div className="mt-3 rounded-[12px] bg-surface-muted px-4 py-3 text-[0.92rem] leading-relaxed text-foreground">
              <div className="mb-1 flex items-center gap-1.5 text-[0.74rem] font-semibold uppercase tracking-wider text-foreground-muted">
                <StickyNote className="h-3.5 w-3.5" strokeWidth={2.5} />
                Catatan dari ortu
              </div>
              {lead.notes}
            </div>
          ) : null}
        </Section>

        <Section title="Status pendaftaran">
          <div className="flex flex-wrap items-center gap-3 rounded-[12px] bg-surface-muted px-4 py-3">
            <div className="flex items-center gap-2 text-[0.88rem] font-semibold text-foreground-muted">
              Sekarang: <StatusBadge status={lead.status} />
            </div>
            <label className="ml-auto flex items-center gap-2 text-[0.86rem] font-bold text-foreground">
              <span className="text-foreground-muted">Ubah ke</span>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as RegistrationStatus)
                }
                className={cn(
                  "rounded-[9px] border border-border border-b-[3px] bg-surface",
                  "px-3 py-1.5 font-bold text-foreground outline-none",
                  "focus:border-primary focus:border-b-primary",
                )}
                aria-label="Status pendaftaran"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {status !== lead.status ? (
            <p className="mt-2 text-[0.82rem] text-foreground-muted">
              Akan disimpan sebagai{" "}
              <strong className="text-foreground">{getStatusLabel(status)}</strong>{" "}
              setelah kamu klik <em>Simpan</em>.
            </p>
          ) : null}
        </Section>

        <Section title="Catatan internal">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Misal: 'Belum diangkat WA 2x, coba lagi nanti sore.'"
            className={cn(
              "min-h-[96px] w-full resize-y rounded-[12px] border border-border border-b-[3px] bg-surface",
              "px-4 py-3 text-[0.94rem] leading-relaxed text-foreground outline-none",
              "focus:border-primary focus:border-b-primary",
            )}
          />
        </Section>
      </div>

      <footer className="flex shrink-0 flex-wrap items-center gap-3 border-t border-border bg-background px-7 py-4">
        <ChunkyButton
          asChild
          variant="secondary"
          size="sm"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "bg-[oklch(0.72_0.18_145)] text-white",
            "shadow-[0_3px_0_0_oklch(0.55_0.18_145)]",
            "hover:bg-[oklch(0.74_0.19_145)] hover:text-white",
            "active:shadow-[0_1px_0_0_oklch(0.55_0.18_145)]",
          )}
        >
          <MessageCircle className="h-4 w-4" strokeWidth={2.4} />
          Chat di WhatsApp
        </ChunkyButton>
        <ChunkyButton
          variant="primary"
          size="sm"
          type="button"
          onClick={onSave}
          disabled={!dirty || mutation.isPending}
          className="ml-auto"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
              Menyimpan&hellip;
            </>
          ) : (
            <>
              <Save className="h-4 w-4" strokeWidth={2.5} />
              Simpan perubahan
            </>
          )}
        </ChunkyButton>
      </footer>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-2.5 flex items-center gap-2.5 font-mono text-[0.7rem] font-bold uppercase tracking-[0.12em] text-foreground-muted">
        {title}
        <span aria-hidden className="h-px flex-1 bg-border" />
      </h3>
      {children}
    </section>
  );
}

function KvGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-x-6 gap-y-3.5 sm:grid-cols-2">{children}</div>;
}

function Kv({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <div className="mb-1 font-mono text-[0.7rem] font-bold uppercase tracking-[0.06em] text-foreground-muted">
        {label}
      </div>
      <div className="text-[0.94rem] font-semibold text-foreground">{value}</div>
    </div>
  );
}
