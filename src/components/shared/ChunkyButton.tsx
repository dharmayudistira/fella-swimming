import Link from "next/link";
import { type ComponentProps, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const chunky = cva(
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-body font-bold",
    "transition-[filter,transform,box-shadow] duration-100 ease-out outline-none cursor-pointer",
    "focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "select-none",
  ),
  {
    variants: {
      variant: {
        primary: cn(
          "bg-primary text-primary-foreground",
          "shadow-[0_4px_0_0_var(--color-primary-dark),0_8px_16px_-6px_oklch(0.71_0.14_230_/_0.4)]",
          "hover:brightness-105",
          "active:translate-y-[3px] active:shadow-[0_1px_0_0_var(--color-primary-dark)]",
        ),
        secondary: cn(
          "bg-surface text-foreground",
          "shadow-[0_3px_0_0_var(--color-border),0_1px_2px_rgba(26,35,50,0.04)]",
          "hover:bg-surface-muted",
          "active:translate-y-[2px] active:shadow-[0_1px_0_0_var(--color-border)]",
        ),
        accent: cn(
          "bg-accent text-accent-foreground",
          "shadow-[0_4px_0_0_var(--color-accent-dark),0_8px_16px_-6px_oklch(0.72_0.16_15_/_0.4)]",
          "hover:brightness-105",
          "active:translate-y-[3px] active:shadow-[0_1px_0_0_var(--color-accent-dark)]",
        ),
        ghost: cn(
          "bg-transparent text-foreground border-2 border-foreground/15",
          "hover:bg-foreground/5",
        ),
        invertedPrimary: cn(
          "bg-surface text-primary",
          "shadow-[0_4px_0_0_oklch(0.82_0.04_230),0_8px_18px_-4px_rgba(26,35,50,0.3)]",
          "hover:brightness-105",
          "active:translate-y-[3px] active:shadow-[0_1px_0_0_oklch(0.82_0.04_230)]",
        ),
        invertedSecondary: cn(
          "bg-transparent text-white border-2 border-white/50",
          "shadow-[0_4px_0_0_rgba(255,255,255,0.18)]",
          "hover:bg-white/10",
          "active:translate-y-[2px] active:shadow-[0_1px_0_0_rgba(255,255,255,0.18)]",
        ),
      },
      size: {
        sm: "h-[42px] rounded-[12px] px-[18px] text-[0.9rem]",
        md: "h-[52px] rounded-[16px] px-6 text-base",
        lg: "h-[60px] rounded-[18px] px-8 text-[1.08rem]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ChunkyVariants = VariantProps<typeof chunky>;

type AsButton = {
  asChild?: false;
  href?: never;
} & ChunkyVariants &
  Omit<ComponentProps<"button">, "children"> & { children: ReactNode };

type AsLink = {
  asChild: true;
  href: ComponentProps<typeof Link>["href"];
  target?: string;
  rel?: string;
  prefetch?: boolean;
  onClick?: ComponentProps<"a">["onClick"];
} & ChunkyVariants & {
    className?: string;
    children: ReactNode;
  };

export type ChunkyButtonProps = AsButton | AsLink;

export function ChunkyButton(props: ChunkyButtonProps) {
  const { variant, size, className, children } = props;
  const classes = cn(chunky({ variant, size }), className);

  if ("asChild" in props && props.asChild) {
    const { href, target, rel, onClick, prefetch } = props;
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        prefetch={prefetch}
        onClick={onClick}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  const { asChild, ...rest } = props as AsButton;
  void asChild;
  return (
    <button type="button" {...rest} className={classes}>
      {children}
    </button>
  );
}
