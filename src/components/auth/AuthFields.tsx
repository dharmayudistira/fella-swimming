"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const baseInput = cn(
  "w-full rounded-[12px] border border-border border-b-[3px] bg-surface",
  "px-4 py-3.5 text-[0.98rem] font-medium text-foreground outline-none",
  "transition-colors placeholder:font-normal placeholder:text-foreground-subtle",
  "focus:border-primary focus:border-b-primary",
  "aria-[invalid=true]:border-destructive aria-[invalid=true]:border-b-destructive",
);

export const AuthInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function AuthInput({ className, ...props }, ref) {
  return <input ref={ref} className={cn(baseInput, className)} {...props} />;
});

export function AuthFieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[0.88rem] font-bold text-foreground"
    >
      {children}
    </label>
  );
}

export function AuthFieldError({
  id,
  message,
}: {
  id?: string;
  message?: string;
}) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 text-[0.82rem] font-semibold text-destructive"
    >
      {message}
    </p>
  );
}

export function AuthFormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="rounded-[12px] border border-destructive/30 bg-destructive/10 px-4 py-3 text-[0.88rem] font-semibold text-destructive"
    >
      {message}
    </div>
  );
}
