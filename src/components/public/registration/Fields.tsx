"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Label + helper text + inline error
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
      className="mb-2 block text-[0.92rem] font-bold text-foreground"
    >
      {children}
      {optional ? (
        <span className="ml-1.5 text-[0.82rem] font-medium text-foreground-subtle">
          (opsional)
        </span>
      ) : null}
    </label>
  );
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-[0.82rem] text-foreground-muted">{children}</p>
  );
}

export function FieldError({ id, message }: { id?: string; message?: string }) {
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

/* ------------------------------------------------------------------ *
 * Chunky text input — matches docs/design/project/daftar.html
 * ------------------------------------------------------------------ */

const baseInput = cn(
  "w-full rounded-[14px] border border-border border-b-[3px] bg-surface",
  "px-4 py-3.5 text-[1rem] font-medium text-foreground outline-none",
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
      className={cn(baseInput, "min-h-[110px] resize-y", className)}
      {...props}
    />
  );
});

/* ------------------------------------------------------------------ *
 * Number input with trailing unit ("6 tahun")
 * ------------------------------------------------------------------ */

export const NumberInputWithUnit = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { unit: string }
>(function NumberInputWithUnit({ className, unit, ...props }, ref) {
  return (
    <div className="relative">
      <input
        ref={ref}
        type="number"
        inputMode="numeric"
        className={cn(baseInput, "pr-16", className)}
        {...props}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[0.92rem] font-medium text-foreground-subtle"
      >
        {unit}
      </span>
    </div>
  );
});

/* ------------------------------------------------------------------ *
 * WhatsApp input with "+62" prefix
 * ------------------------------------------------------------------ */

export const WhatsAppInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function WhatsAppInput({ className, ...props }, ref) {
  return (
    <div className="flex items-stretch">
      <span className="inline-flex items-center gap-1.5 rounded-l-[14px] border border-r-0 border-border border-b-[3px] bg-surface-muted px-3.5 text-[0.95rem] font-bold text-foreground">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px]"
          fill="oklch(0.72 0.18 145)"
        >
          <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.4 5L2 22l5.2-1.4c1.5.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
        </svg>
        +62
      </span>
      <input
        ref={ref}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        className={cn(
          baseInput,
          "rounded-l-none border-l border-border",
          className,
        )}
        {...props}
      />
    </div>
  );
});

/* ------------------------------------------------------------------ *
 * Radio pill row (Step 1 — Jenis Kelamin)
 *
 * Uses `has-[:checked]` on the label (sibling-aware via :has) so the styled
 * span reacts to the hidden native radio without needing CSS peer chains.
 * ------------------------------------------------------------------ */

export type RadioPillOption = {
  value: string;
  label: string;
};

type SharedRadioGroupProps = {
  name: string;
  register: React.InputHTMLAttributes<HTMLInputElement>;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
};

export function RadioPillRow({
  name,
  options,
  register,
  ariaInvalid,
  ariaDescribedBy,
}: SharedRadioGroupProps & { options: ReadonlyArray<RadioPillOption> }) {
  return (
    <div
      role="radiogroup"
      aria-invalid={ariaInvalid || undefined}
      aria-describedby={ariaDescribedBy}
      className="flex gap-2.5"
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          className={cn(
            "group/pill relative flex-1 cursor-pointer select-none",
            "rounded-[14px] border border-border border-b-[3px] bg-surface",
            "px-3 py-3.5 text-center text-[0.95rem] font-semibold text-foreground",
            "transition-colors",
            "has-[:checked]:border-primary has-[:checked]:border-b-primary",
            "has-[:checked]:bg-primary-tint has-[:checked]:text-primary-dark",
            "focus-within:ring-3 focus-within:ring-ring/50",
          )}
        >
          <input
            type="radio"
            value={opt.value}
            className="sr-only"
            {...register}
            name={name}
          />
          <span className="inline-flex items-center justify-center gap-2">
            <span
              aria-hidden
              className={cn(
                "inline-flex h-5 w-5 items-center justify-center rounded-full bg-surface-muted text-transparent transition-colors",
                "group-has-[:checked]/pill:bg-primary group-has-[:checked]/pill:text-primary-foreground",
              )}
            >
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Radio card stack (Step 1 — Pengalaman; Step 2 — Kelas)
 * ------------------------------------------------------------------ */

export type RadioCardOption = {
  value: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  tag?: React.ReactNode;
  /** Optional accent (controls "checked" tint). Defaults to "primary". */
  accent?: "primary" | "secondary" | "accent";
};

const accentClasses = {
  primary: {
    checked:
      "has-[:checked]:border-primary has-[:checked]:border-b-primary has-[:checked]:bg-primary-tint",
    title: "group-has-[:checked]/card:text-primary-dark",
    dot: "group-has-[:checked]/card:border-primary group-has-[:checked]/card:bg-primary",
  },
  secondary: {
    checked:
      "has-[:checked]:border-secondary has-[:checked]:border-b-secondary has-[:checked]:bg-secondary-tint",
    title: "group-has-[:checked]/card:text-secondary-dark",
    dot: "group-has-[:checked]/card:border-secondary group-has-[:checked]/card:bg-secondary",
  },
  accent: {
    checked:
      "has-[:checked]:border-accent has-[:checked]:border-b-accent has-[:checked]:bg-accent-tint",
    title: "group-has-[:checked]/card:text-accent-dark",
    dot: "group-has-[:checked]/card:border-accent group-has-[:checked]/card:bg-accent",
  },
} as const;

export function RadioCardStack({
  name,
  options,
  register,
  ariaInvalid,
  ariaDescribedBy,
}: SharedRadioGroupProps & { options: ReadonlyArray<RadioCardOption> }) {
  return (
    <div
      role="radiogroup"
      aria-invalid={ariaInvalid || undefined}
      aria-describedby={ariaDescribedBy}
      className="flex flex-col gap-2.5"
    >
      {options.map((opt) => {
        const accent = accentClasses[opt.accent ?? "primary"];
        return (
          <label
            key={opt.value}
            className={cn(
              "group/card relative flex cursor-pointer select-none gap-3.5",
              "rounded-[16px] border border-border border-b-[3px] bg-surface",
              "px-4 py-4 transition-colors",
              "focus-within:ring-3 focus-within:ring-ring/50",
              accent.checked,
            )}
          >
            <input
              type="radio"
              value={opt.value}
              className="sr-only"
              {...register}
              name={name}
            />
            <span
              aria-hidden
              className={cn(
                "mt-0.5 inline-block h-[22px] w-[22px] shrink-0 rounded-full",
                "border-2 border-border bg-surface relative transition-colors",
                accent.dot,
                "after:absolute after:inset-[4px] after:rounded-full after:bg-transparent",
                "group-has-[:checked]/card:after:bg-white",
              )}
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2.5 gap-y-1">
                <span
                  className={cn(
                    "text-[1rem] font-bold leading-tight text-foreground transition-colors",
                    accent.title,
                  )}
                >
                  {opt.title}
                  {opt.tag ? (
                    <span className="ml-2 inline-block align-middle">
                      {opt.tag}
                    </span>
                  ) : null}
                </span>
                {opt.meta ? (
                  <span className="whitespace-nowrap font-mono text-[0.82rem] font-semibold text-foreground-muted">
                    {opt.meta}
                  </span>
                ) : null}
              </div>
              {opt.description ? (
                <p className="mt-1 text-[0.88rem] leading-snug text-foreground-muted">
                  {opt.description}
                </p>
              ) : null}
            </div>
          </label>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Tinted info aside (used at the bottom of each step)
 * ------------------------------------------------------------------ */

export function StepInfo({
  tone = "secondary",
  icon = "i",
  children,
}: {
  tone?: "secondary" | "sun";
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "sun"
      ? "border-sun/40 bg-sun-tint [&_strong]:text-sun-dark"
      : "border-secondary/40 bg-secondary-tint [&_strong]:text-secondary-dark";
  const iconClass =
    tone === "sun"
      ? "bg-sun text-sun-dark"
      : "bg-secondary text-secondary-foreground";

  return (
    <div
      className={cn(
        "mt-1 flex items-start gap-3 rounded-[16px] border px-4 py-3.5",
        toneClass,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          "font-heading text-[0.92rem] font-extrabold",
          iconClass,
        )}
      >
        {icon}
      </span>
      <div className="text-[0.9rem] leading-snug text-foreground">{children}</div>
    </div>
  );
}
