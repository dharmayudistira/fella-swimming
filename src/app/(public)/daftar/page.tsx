import { Suspense } from "react";

import { RegistrationWizard } from "@/components/public/registration/RegistrationWizard";
import { pageMetadata } from "@/lib/constants/seo";

export const metadata = pageMetadata({
  title: "Daftar",
  description:
    "Daftar les renang anak di Fellaswimming. 3 langkah singkat, trial pertama gratis, pembayaran setelah trial.",
  path: "/daftar",
});

export default function DaftarPage() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-x-clip py-8 md:py-12">
      {/* Soft background blob — matches landing vocabulary */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-20 -top-24 h-[320px] w-[320px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.92 0.06 230 / 0.5), transparent 70%)",
          zIndex: 0,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -right-20 h-[260px] w-[260px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.92 0.06 80 / 0.45), transparent 70%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-[1] mx-auto w-full max-w-[720px] px-4 md:px-6">
        <Suspense fallback={<WizardSkeleton />}>
          <RegistrationWizard />
        </Suspense>
      </div>
    </section>
  );
}

function WizardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[480px] space-y-5">
      <div className="flex gap-2">
        <span className="h-2 flex-1 rounded-full bg-border" />
        <span className="h-2 flex-1 rounded-full bg-border" />
        <span className="h-2 flex-1 rounded-full bg-border" />
      </div>
      <div className="h-9 w-3/4 rounded-md bg-surface-muted" />
      <div className="h-5 w-full rounded-md bg-surface-muted" />
      <div className="space-y-3">
        <div className="h-14 rounded-[14px] bg-surface-muted" />
        <div className="h-14 rounded-[14px] bg-surface-muted" />
        <div className="h-14 rounded-[14px] bg-surface-muted" />
      </div>
    </div>
  );
}
