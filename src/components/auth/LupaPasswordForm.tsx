"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import {
  AuthFieldError,
  AuthFieldLabel,
  AuthFormError,
  AuthInput,
} from "@/components/auth/AuthFields";
import { ChunkyButton } from "@/components/shared/ChunkyButton";
import { requestPasswordReset } from "@/lib/actions/auth";
import {
  RequestPasswordResetSchema,
  type RequestPasswordResetInput,
} from "@/lib/validation/auth.schema";

export function LupaPasswordForm() {
  const form = useForm<RequestPasswordResetInput>({
    resolver: standardSchemaResolver(RequestPasswordResetSchema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const { errors } = form.formState;
  const rootError = errors.root?.message;

  const onSubmit = form.handleSubmit((values) => {
    form.clearErrors("root");
    startTransition(async () => {
      const result = await requestPasswordReset(values);
      if (!result.success) {
        form.setError("root", { type: "server", message: result.error });
        return;
      }
      setDone(true);
    });
  });

  if (done) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-[14px] border border-success-tint bg-success-tint/40 px-4 py-4">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-success text-primary-foreground">
          <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
        </span>
        <div>
          <h2 className="text-[1.05rem] font-bold text-foreground">
            Email reset terkirim.
          </h2>
          <p className="mt-1 text-[0.9rem] text-foreground-muted">
            Cek inbox kamu, ya. Tautannya valid 1 jam. Kalau tidak ada di inbox,
            cek folder spam.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      {rootError ? <AuthFormError message={rootError} /> : null}

      <div>
        <AuthFieldLabel htmlFor="email">Email admin</AuthFieldLabel>
        <AuthInput
          id="email"
          type="email"
          autoComplete="email"
          autoFocus
          placeholder="admin@fellaswimming.com"
          aria-invalid={!!errors.email || undefined}
          aria-describedby={errors.email ? "err-email" : undefined}
          {...form.register("email")}
        />
        <AuthFieldError id="err-email" message={errors.email?.message} />
      </div>

      <ChunkyButton
        variant="primary"
        size="md"
        type="submit"
        disabled={pending}
        className="mt-1 w-full"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
            Mengirim&hellip;
          </>
        ) : (
          <>
            Kirim tautan reset
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </>
        )}
      </ChunkyButton>
    </form>
  );
}
