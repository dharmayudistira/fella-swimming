"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { ArrowRight, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import {
  AuthFieldError,
  AuthFieldLabel,
  AuthFormError,
  AuthInput,
} from "@/components/auth/AuthFields";
import { ChunkyButton } from "@/components/shared/ChunkyButton";
import { resetPassword } from "@/lib/actions/auth";
import {
  ResetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validation/auth.schema";

export function ResetPasswordForm() {
  const form = useForm<ResetPasswordInput>({
    resolver: standardSchemaResolver(ResetPasswordSchema),
    mode: "onTouched",
    defaultValues: { password: "", confirm: "" },
  });
  const [pending, startTransition] = useTransition();
  const { errors } = form.formState;
  const rootError = errors.root?.message;

  const onSubmit = form.handleSubmit((values) => {
    form.clearErrors("root");
    startTransition(async () => {
      const result = await resetPassword(values);
      if (!result.success) {
        form.setError("root", { type: "server", message: result.error });
      }
      // success path redirects via the server action.
    });
  });

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      {rootError ? <AuthFormError message={rootError} /> : null}

      <div>
        <AuthFieldLabel htmlFor="password">Password baru</AuthFieldLabel>
        <AuthInput
          id="password"
          type="password"
          autoComplete="new-password"
          autoFocus
          placeholder="Minimal 8 karakter"
          aria-invalid={!!errors.password || undefined}
          aria-describedby={errors.password ? "err-password" : undefined}
          {...form.register("password")}
        />
        <AuthFieldError id="err-password" message={errors.password?.message} />
      </div>

      <div>
        <AuthFieldLabel htmlFor="confirm">Konfirmasi password</AuthFieldLabel>
        <AuthInput
          id="confirm"
          type="password"
          autoComplete="new-password"
          placeholder="Ketik ulang password baru"
          aria-invalid={!!errors.confirm || undefined}
          aria-describedby={errors.confirm ? "err-confirm" : undefined}
          {...form.register("confirm")}
        />
        <AuthFieldError id="err-confirm" message={errors.confirm?.message} />
      </div>

      <ChunkyButton
        variant="primary"
        size="md"
        type="submit"
        disabled={pending}
        className="mt-2 w-full"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
            Menyimpan&hellip;
          </>
        ) : (
          <>
            Simpan password baru
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </>
        )}
      </ChunkyButton>
    </form>
  );
}
