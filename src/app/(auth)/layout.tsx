import type { ReactNode } from "react";

/**
 * Bare-bones auth shell: centered card on a warm-tinted background with two
 * decorative radial bubbles (sky top-left, sun bottom-right) — mirrors
 * docs/design/project/admin-login.html. The brand logo lives inside the
 * child card, not in this shell.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <span
        aria-hidden
        className="pointer-events-none absolute -left-[120px] -top-[120px] h-[380px] w-[380px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.92 0.06 230 / 0.5), transparent 70%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-[120px] -right-[120px] h-[380px] w-[380px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.92 0.06 80 / 0.4), transparent 70%)",
        }}
      />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-5 py-8">
        <div className="w-full max-w-[400px]">{children}</div>
      </main>
    </div>
  );
}
