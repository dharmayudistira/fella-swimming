"use client";

import type { UseFormReturn } from "react-hook-form";

import {
  FieldError,
  FieldHint,
  FieldLabel,
  NumberInputWithUnit,
  RadioCardStack,
  RadioPillRow,
  StepInfo,
  TextInput,
  type RadioCardOption,
  type RadioPillOption,
} from "./Fields";
import type { RegistrationFormValues } from "@/lib/validation/registration.schema";

const GENDER_OPTIONS: ReadonlyArray<RadioPillOption> = [
  { value: "laki_laki", label: "Laki-laki" },
  { value: "perempuan", label: "Perempuan" },
];

const EXPERIENCE_OPTIONS: ReadonlyArray<RadioCardOption> = [
  {
    value: "belum_bisa",
    title: "Belum bisa, masih takut air",
    description: "Belum pernah les renang. Mulai dari nol.",
  },
  {
    value: "sedikit_bisa",
    title: "Sudah berani di air, belum bisa berenang",
    description: "Pernah main di kolam, belum belajar teknik formal.",
  },
  {
    value: "sudah_bisa_dasar",
    title: "Sudah bisa dasar (mengapung, freestyle)",
    description: "Mau improve teknik dan stamina.",
  },
  {
    value: "mahir",
    title: "Mahir",
    description: "Sudah bisa beberapa gaya, mau training lanjutan.",
  },
];

export function StepStudent({
  form,
}: {
  form: UseFormReturn<RegistrationFormValues>;
}) {
  const { register, formState } = form;
  const errors = formState.errors;

  return (
    <div className="space-y-5">
      {/* Nama anak */}
      <div>
        <FieldLabel htmlFor="student_name">Nama anak</FieldLabel>
        <TextInput
          id="student_name"
          autoComplete="off"
          placeholder="Misal: Arif Pratama"
          aria-invalid={!!errors.student_name || undefined}
          aria-describedby={errors.student_name ? "err-student_name" : undefined}
          {...register("student_name")}
        />
        <FieldError id="err-student_name" message={errors.student_name?.message} />
      </div>

      {/* Umur anak */}
      <div>
        <FieldLabel htmlFor="student_age">Umur anak</FieldLabel>
        <NumberInputWithUnit
          id="student_age"
          unit="tahun"
          min={3}
          max={80}
          placeholder="6"
          aria-invalid={!!errors.student_age || undefined}
          aria-describedby={errors.student_age ? "err-student_age" : undefined}
          {...register("student_age", { valueAsNumber: true })}
        />
        <FieldError id="err-student_age" message={errors.student_age?.message} />
      </div>

      {/* Jenis kelamin */}
      <div>
        <FieldLabel>Jenis kelamin</FieldLabel>
        <RadioPillRow
          name="student_gender"
          options={GENDER_OPTIONS}
          register={register("student_gender")}
          ariaInvalid={!!errors.student_gender}
          ariaDescribedBy={
            errors.student_gender ? "err-student_gender" : undefined
          }
        />
        <FieldError
          id="err-student_gender"
          message={errors.student_gender?.message}
        />
      </div>

      {/* Pengalaman renang */}
      <div>
        <FieldLabel>Pengalaman renang</FieldLabel>
        <RadioCardStack
          name="student_experience"
          options={EXPERIENCE_OPTIONS}
          register={register("student_experience")}
          ariaInvalid={!!errors.student_experience}
          ariaDescribedBy={
            errors.student_experience ? "err-student_experience" : undefined
          }
        />
        <FieldError
          id="err-student_experience"
          message={errors.student_experience?.message}
        />
        <FieldHint>
          Belum yakin? Pilih yang paling mendekati. Pelatih akan asesmen lagi
          pas trial pertama.
        </FieldHint>
      </div>

      <StepInfo>
        Info ini bantu kami merekomendasikan kelas yang paling pas.{" "}
        <strong>Cuma butuh 60 detik.</strong>
      </StepInfo>
    </div>
  );
}
