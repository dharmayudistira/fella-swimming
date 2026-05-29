"use client";

import { useSearchParams } from "next/navigation";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react";
import { useMemo, useRef, useState, useTransition, type FormEvent } from "react";
import { useForm, type Path } from "react-hook-form";
import { toast } from "sonner";

import { ChunkyButton } from "@/components/shared/ChunkyButton";
import { cn } from "@/lib/utils";
import { normalizeWhatsApp } from "@/lib/utils/wa";
import { submitRegistration } from "@/lib/actions/registration";
import {
  RegistrationFormSchema,
  type RegistrationFormValues,
  type RegistrationInput,
} from "@/lib/validation/registration.schema";

import { ConfirmationPanel } from "./ConfirmationPanel";
import { StepClass } from "./StepClass";
import { StepContact } from "./StepContact";
import { StepStudent } from "./StepStudent";

type StepIndex = 1 | 2 | 3;
type WizardPhase = StepIndex | "done";

type StepDef = {
  index: StepIndex;
  eyebrowDotClass: string;
  title: string;
  subtitle: string;
  fields: ReadonlyArray<Path<RegistrationFormValues>>;
};

const STEPS: ReadonlyArray<StepDef> = [
  {
    index: 1,
    eyebrowDotClass: "bg-primary",
    title: "Cerita sedikit soal anak, Bunda.",
    subtitle:
      "Info ini membantu kami merekomendasikan kelas yang paling pas buat anak kamu.",
    fields: [
      "student_name",
      "student_age",
      "student_gender",
      "student_experience",
    ],
  },
  {
    index: 2,
    eyebrowDotClass: "bg-secondary",
    title: "Kelas mana yang menarik?",
    subtitle:
      "Belum yakin pilih kelas? Tim kami bantu tentukan pas WhatsApp balik.",
    fields: ["preferred_class_type", "preferred_schedule", "preferred_location"],
  },
  {
    index: 3,
    eyebrowDotClass: "bg-accent",
    title: "Terakhir — biar kami bisa hubungi Bunda.",
    subtitle:
      "Kami WhatsApp balik dalam 1×24 jam. Nomor cuma dipakai tim kami, tidak dibagikan.",
    fields: ["parent_name", "parent_whatsapp", "parent_email", "notes"],
  },
];

const VALID_KELAS = new Set<RegistrationFormValues["preferred_class_type"]>([
  "privat",
  "semi_privat",
  "grup",
  "belum_yakin",
]);

export function RegistrationWizard() {
  const searchParams = useSearchParams();

  const initialKelas = useMemo<
    RegistrationFormValues["preferred_class_type"] | undefined
  >(() => {
    const raw = searchParams.get("kelas");
    if (
      raw &&
      VALID_KELAS.has(raw as RegistrationFormValues["preferred_class_type"])
    ) {
      return raw as RegistrationFormValues["preferred_class_type"];
    }
    return undefined;
  }, [searchParams]);

  const form = useForm<RegistrationFormValues>({
    resolver: standardSchemaResolver(RegistrationFormSchema),
    mode: "onTouched",
    defaultValues: {
      student_name: "",
      student_age: undefined as unknown as number,
      student_gender: undefined as unknown as RegistrationFormValues["student_gender"],
      student_experience:
        undefined as unknown as RegistrationFormValues["student_experience"],
      preferred_class_type:
        (initialKelas ??
          (undefined as unknown as RegistrationFormValues["preferred_class_type"])),
      preferred_schedule: "",
      preferred_location: "",
      parent_name: "",
      parent_whatsapp: "",
      parent_email: "",
      notes: "",
    },
  });

  const [phase, setPhase] = useState<WizardPhase>(1);
  const [pending, startTransition] = useTransition();
  const [displayId, setDisplayId] = useState<string | null>(null);
  // Synchronous guard against double-submit: `pending` flips a tick after the
  // click (there's an awaited form.trigger first), so the disabled button
  // alone leaves a tiny race window.
  const submittingRef = useRef(false);

  const currentStep =
    phase === "done" ? null : STEPS.find((s) => s.index === phase)!;

  const goBack = () => {
    if (phase === 1 || phase === "done") return;
    setPhase(((phase as StepIndex) - 1) as StepIndex);
  };

  const handleContinue = async () => {
    if (!currentStep) return;
    const valid = await form.trigger(currentStep.fields, { shouldFocus: true });
    if (!valid) return;

    if (currentStep.index < 3) {
      setPhase(((currentStep.index + 1) as StepIndex));
      // Scroll to top of wizard on advance so the next step is in view.
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // Step 3 → final submit
    void handleSubmit();
  };

  const handleSubmit = async () => {
    if (submittingRef.current) return;

    const values = form.getValues();
    const normalizedWa = normalizeWhatsApp(values.parent_whatsapp);
    if (!normalizedWa) {
      form.setError("parent_whatsapp", {
        type: "manual",
        message: "Nomor WhatsApp tidak valid. Contoh: 812-3456-7890.",
      });
      return;
    }

    const payload: RegistrationInput = {
      student_name: values.student_name.trim(),
      student_age: values.student_age,
      student_gender: values.student_gender,
      student_experience: values.student_experience,
      preferred_class_type: values.preferred_class_type,
      preferred_schedule: values.preferred_schedule?.trim() || undefined,
      preferred_location: values.preferred_location?.trim() || undefined,
      parent_name: values.parent_name.trim(),
      parent_whatsapp: normalizedWa,
      parent_email: values.parent_email?.trim() || undefined,
      notes: values.notes?.trim() || undefined,
    };

    submittingRef.current = true;
    startTransition(async () => {
      try {
        const result = await submitRegistration(payload);
        if (!result.success) {
          toast.error(result.error ?? "Gagal kirim. Coba lagi.");
          return;
        }
        setDisplayId(result.data.display_id);
        setPhase("done");
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (error) {
        // Network/transport failure — the action rejected before returning a
        // result. No partial write (the insert is atomic). Let the user retry.
        console.error("[registration] submit failed", error);
        toast.error("Gagal kirim. Coba lagi.");
      } finally {
        submittingRef.current = false;
      }
    });
  };

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleContinue();
  };

  if (phase === "done" && displayId) {
    return (
      <ConfirmationPanel
        displayId={displayId}
        parentName={form.getValues("parent_name") ?? "Bunda"}
      />
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-[480px] flex-col gap-5 px-1 pb-28">
      {/* Progress + step tag */}
      <ProgressBar current={phase as StepIndex} />

      <header>
        <span
          className={cn(
            "mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5",
            "font-mono text-[0.72rem] font-medium uppercase tracking-[0.10em] text-foreground-muted",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "eyebrow-pulse inline-block h-[7px] w-[7px] rounded-full",
              currentStep?.eyebrowDotClass,
            )}
          />
          Langkah {currentStep?.index} dari 3
        </span>
        <h1 className="text-balance text-[1.7rem] font-bold leading-[1.12] tracking-[-0.02em] md:text-[2rem]">
          {currentStep?.title}
        </h1>
        <p className="mt-2 text-pretty text-[0.98rem] text-foreground-muted">
          {currentStep?.subtitle}
        </p>
      </header>

      <form
        noValidate
        onSubmit={onFormSubmit}
        className="space-y-5"
        aria-label={`Form pendaftaran langkah ${currentStep?.index ?? 1} dari 3`}
      >
        {phase === 1 ? <StepStudent form={form} /> : null}
        {phase === 2 ? <StepClass form={form} /> : null}
        {phase === 3 ? <StepContact form={form} /> : null}

        {/* Sticky action bar */}
        <div
          className={cn(
            "sticky bottom-0 z-10 -mx-1 mt-2 pt-4 pb-3",
            "bg-gradient-to-b from-background/0 via-background/80 to-background",
          )}
        >
          <div className="flex gap-2.5">
            {currentStep!.index > 1 ? (
              <ChunkyButton
                variant="secondary"
                size="md"
                type="button"
                onClick={goBack}
                disabled={pending}
                aria-label="Kembali ke langkah sebelumnya"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
                Kembali
              </ChunkyButton>
            ) : null}

            <ChunkyButton
              variant="primary"
              size="md"
              type="submit"
              disabled={pending}
              className="flex-1"
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                  Mengirim&hellip;
                </>
              ) : currentStep!.index === 3 ? (
                <>
                  <Send className="h-4 w-4" strokeWidth={2.5} />
                  Kirim Pendaftaran
                </>
              ) : (
                <>
                  Lanjut
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </>
              )}
            </ChunkyButton>
          </div>
        </div>
      </form>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ProgressBar({ current }: { current: StepIndex }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 gap-2">
        {[1, 2, 3].map((step) => {
          const isDone = step < current;
          const isCurrent = step === current;
          return (
            <span
              key={step}
              aria-hidden
              className={cn(
                "h-2 flex-1 rounded-full transition-colors",
                isDone && "bg-primary",
                !isDone && !isCurrent && "bg-border",
                isCurrent &&
                  "bg-[linear-gradient(90deg,_var(--color-primary)_50%,_var(--color-border)_50%)]",
              )}
            />
          );
        })}
      </div>
      <span
        className="rounded-full bg-surface-muted px-2.5 py-1 font-mono text-[0.78rem] font-medium text-foreground-muted"
        aria-label={`Langkah ${current} dari 3`}
      >
        <strong className="font-bold text-primary">{current}</strong> / 3
      </span>
    </div>
  );
}
