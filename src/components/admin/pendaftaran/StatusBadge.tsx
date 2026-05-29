import { cn } from "@/lib/utils";
import type { RegistrationStatus } from "@/types/database.types";

const STATUS_META: Record<
  RegistrationStatus,
  { label: string; className: string; dotClassName: string }
> = {
  baru: {
    label: "Baru",
    className: "bg-primary-soft text-primary-dark",
    dotClassName: "bg-primary",
  },
  dihubungi: {
    label: "Dihubungi",
    className: "bg-sun-tint text-sun-dark",
    dotClassName: "bg-sun",
  },
  trial: {
    label: "Trial",
    className: "bg-secondary-soft text-secondary-dark",
    dotClassName: "bg-secondary",
  },
  daftar: {
    label: "Daftar",
    className: "bg-success-tint text-success-dark",
    dotClassName: "bg-success",
  },
  tidak_lanjut: {
    label: "Tidak Lanjut",
    className: "bg-surface-muted text-foreground-muted",
    dotClassName: "bg-foreground-subtle",
  },
};

export const STATUS_OPTIONS: ReadonlyArray<{
  value: RegistrationStatus;
  label: string;
}> = (Object.keys(STATUS_META) as RegistrationStatus[]).map((value) => ({
  value,
  label: STATUS_META[value].label,
}));

export function getStatusLabel(status: RegistrationStatus) {
  return STATUS_META[status].label;
}

export function StatusBadge({
  status,
  className,
}: {
  status: RegistrationStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.74rem] font-bold leading-none",
        meta.className,
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("h-1.5 w-1.5 rounded-full", meta.dotClassName)}
      />
      {meta.label}
    </span>
  );
}
