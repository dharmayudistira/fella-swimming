"use client";

import type { UseFormReturn } from "react-hook-form";

import type { RegistrationFormValues } from "@/lib/validation/registration.schema";

import {
  FieldError,
  FieldHint,
  FieldLabel,
  StepInfo,
  Textarea,
  TextInput,
  WhatsAppInput,
} from "./Fields";

export function StepContact({
  form,
}: {
  form: UseFormReturn<RegistrationFormValues>;
}) {
  const { register, formState } = form;
  const errors = formState.errors;

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel htmlFor="parent_name">Nama orang tua</FieldLabel>
        <TextInput
          id="parent_name"
          autoComplete="name"
          placeholder="Nama lengkap"
          aria-invalid={!!errors.parent_name || undefined}
          aria-describedby={errors.parent_name ? "err-parent_name" : undefined}
          {...register("parent_name")}
        />
        <FieldError id="err-parent_name" message={errors.parent_name?.message} />
      </div>

      <div>
        <FieldLabel htmlFor="parent_whatsapp">Nomor WhatsApp</FieldLabel>
        <WhatsAppInput
          id="parent_whatsapp"
          placeholder="812-3456-7890"
          aria-invalid={!!errors.parent_whatsapp || undefined}
          aria-describedby={
            errors.parent_whatsapp ? "err-parent_whatsapp" : "hint-parent_whatsapp"
          }
          {...register("parent_whatsapp")}
        />
        {errors.parent_whatsapp ? (
          <FieldError
            id="err-parent_whatsapp"
            message={errors.parent_whatsapp?.message}
          />
        ) : (
          <p
            id="hint-parent_whatsapp"
            className="mt-1.5 text-[0.82rem] text-foreground-muted"
          >
            Tanpa awalan 0. Contoh: 812-3456-7890.
          </p>
        )}
      </div>

      <div>
        <FieldLabel htmlFor="parent_email" optional>
          Email
        </FieldLabel>
        <TextInput
          id="parent_email"
          type="email"
          autoComplete="email"
          placeholder="kalau perlu kirim invoice"
          aria-invalid={!!errors.parent_email || undefined}
          aria-describedby={
            errors.parent_email ? "err-parent_email" : undefined
          }
          {...register("parent_email")}
        />
        <FieldError id="err-parent_email" message={errors.parent_email?.message} />
      </div>

      <div>
        <FieldLabel htmlFor="notes" optional>
          Catatan tambahan
        </FieldLabel>
        <Textarea
          id="notes"
          placeholder="Ada kondisi khusus? Asma, alergi, atau preferensi pelatih perempuan/laki-laki?"
          aria-invalid={!!errors.notes || undefined}
          aria-describedby={errors.notes ? "err-notes" : undefined}
          {...register("notes")}
        />
        <FieldError id="err-notes" message={errors.notes?.message} />
        <FieldHint>
          Maksimal 1000 karakter. Kami baca semua sebelum WhatsApp balik.
        </FieldHint>
      </div>

      <StepInfo tone="sun" icon="✓">
        <strong>Tanpa bayar di muka.</strong> Trial pertama gratis. Kalau cocok,
        baru lanjut.
      </StepInfo>
    </div>
  );
}
