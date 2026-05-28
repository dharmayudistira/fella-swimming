"use client";

import type { UseFormReturn } from "react-hook-form";

import { classes } from "@/data/classes";
import type { RegistrationFormValues } from "@/lib/validation/registration.schema";

import {
  FieldError,
  FieldHint,
  FieldLabel,
  RadioCardStack,
  TextInput,
  type RadioCardOption,
} from "./Fields";

function PopulerTag() {
  return (
    <span
      className="inline-block rounded-full bg-accent px-2 py-0.5 text-[0.66rem] font-extrabold uppercase tracking-[0.05em] text-accent-foreground"
      style={{ boxShadow: "0 2px 0 var(--color-accent-dark)" }}
    >
      Populer
    </span>
  );
}

const CLASS_OPTIONS: ReadonlyArray<RadioCardOption> = [
  ...classes.map<RadioCardOption>((c) => ({
    value: c.slug,
    title: c.name,
    description: c.shortDescription,
    meta: `${c.priceAmount} ${c.priceUnit}`,
    tag: c.popular ? <PopulerTag /> : undefined,
    accent: c.accent,
  })),
  {
    value: "belum_yakin",
    title: "Belum yakin, bantu pilihkan",
    description: "Tim kami akan rekomendasi pas WhatsApp.",
  },
];

export function StepClass({
  form,
}: {
  form: UseFormReturn<RegistrationFormValues>;
}) {
  const { register, formState } = form;
  const errors = formState.errors;

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel>Pilihan kelas</FieldLabel>
        <RadioCardStack
          name="preferred_class_type"
          options={CLASS_OPTIONS}
          register={register("preferred_class_type")}
          ariaInvalid={!!errors.preferred_class_type}
          ariaDescribedBy={
            errors.preferred_class_type
              ? "err-preferred_class_type"
              : undefined
          }
        />
        <FieldError
          id="err-preferred_class_type"
          message={errors.preferred_class_type?.message}
        />
      </div>

      <div>
        <FieldLabel htmlFor="preferred_schedule" optional>
          Preferensi jadwal
        </FieldLabel>
        <TextInput
          id="preferred_schedule"
          placeholder="Sabtu pagi atau Minggu sore"
          aria-invalid={!!errors.preferred_schedule || undefined}
          aria-describedby={
            errors.preferred_schedule ? "err-preferred_schedule" : undefined
          }
          {...register("preferred_schedule")}
        />
        <FieldError
          id="err-preferred_schedule"
          message={errors.preferred_schedule?.message}
        />
        <FieldHint>
          Contoh: &ldquo;Sabtu pagi&rdquo;, &ldquo;weekday sore setelah
          16:00&rdquo;, &ldquo;fleksibel&rdquo;.
        </FieldHint>
      </div>

      <div>
        <FieldLabel htmlFor="preferred_location" optional>
          Lokasi yang dituju
        </FieldLabel>
        <TextInput
          id="preferred_location"
          placeholder="Kolam Anggrek, Sidoarjo"
          aria-invalid={!!errors.preferred_location || undefined}
          aria-describedby={
            errors.preferred_location ? "err-preferred_location" : undefined
          }
          {...register("preferred_location")}
        />
        <FieldError
          id="err-preferred_location"
          message={errors.preferred_location?.message}
        />
      </div>
    </div>
  );
}
