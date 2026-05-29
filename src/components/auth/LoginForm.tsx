"use client";

import Link from "next/link";
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
import { signIn } from "@/lib/actions/auth";
import { SignInSchema, type SignInInput } from "@/lib/validation/auth.schema";

export function LoginForm() {
  const form = useForm<SignInInput>({
    resolver: standardSchemaResolver(SignInSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "" },
  });
  const [pending, startTransition] = useTransition();
  const { errors } = form.formState;
  const rootError = errors.root?.message;

  const onSubmit = form.handleSubmit((values) => {
    form.clearErrors("root");
    startTransition(async () => {
      const result = await signIn(values);
      if (!result.success) {
        form.setError("root", { type: "server", message: result.error });
      }
      // On success the action throws redirect("/admin"); this path is unreachable.
    });
  });

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      {rootError ? <AuthFormError message={rootError} /> : null}

      <div>
        <AuthFieldLabel htmlFor="email">Email</AuthFieldLabel>
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

      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <AuthFieldLabel htmlFor="password">Password</AuthFieldLabel>
          <Link
            href="/lupa-password"
            className="text-[0.84rem] font-semibold text-primary hover:underline"
          >
            Lupa password?
          </Link>
        </div>
        <AuthInput
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Masukkan password kamu"
          aria-invalid={!!errors.password || undefined}
          aria-describedby={errors.password ? "err-password" : undefined}
          {...form.register("password")}
        />
        <AuthFieldError id="err-password" message={errors.password?.message} />
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
            Memproses&hellip;
          </>
        ) : (
          <>
            Masuk
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </>
        )}
      </ChunkyButton>
    </form>
  );
}
