"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Chunky admin form primitives — mirror the registration field style
 * (border-b-[3px], rounded-[14px]) so admin forms feel consistent with
 * the public ones without coupling the two component trees.
 * ------------------------------------------------------------------ */

export function FieldLabel({
  htmlFor,
  optional,
  children,
}: {
  htmlFor?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[0.86rem] font-bold text-foreground"
    >
      {children}
      {optional ? (
        <span className="ml-1.5 text-[0.78rem] font-medium text-foreground-subtle">
          (opsional)
        </span>
      ) : null}
    </label>
  );
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-[0.8rem] text-foreground-muted">{children}</p>
  );
}

export function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 text-[0.8rem] font-semibold text-destructive"
    >
      {message}
    </p>
  );
}

const baseInput = cn(
  "w-full rounded-[12px] border border-border border-b-[3px] bg-surface",
  "px-3.5 py-2.5 text-[0.95rem] font-medium text-foreground outline-none",
  "transition-colors placeholder:font-normal placeholder:text-foreground-subtle",
  "focus:border-primary focus:border-b-primary",
  "aria-[invalid=true]:border-destructive aria-[invalid=true]:border-b-destructive",
);

export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function TextInput({ className, ...props }, ref) {
  return <input ref={ref} className={cn(baseInput, className)} {...props} />;
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(baseInput, "min-h-[96px] resize-y", className)}
      {...props}
    />
  );
});
