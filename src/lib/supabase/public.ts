import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";

/**
 * Cookieless anon Supabase client for PUBLIC reads (published articles,
 * featured testimonials, sitemap slugs).
 *
 * Unlike `createServerClient`, it never touches `cookies()`/`headers()`, so
 * routes that read through it can be statically generated and ISR-cached
 * (FR-008/009 — landing `revalidate: 60`, article detail `revalidate: 300`).
 * The cookie-bound client opts every route into dynamic rendering.
 *
 * Anon key only: RLS restricts anon to published/featured rows. Never use for
 * admin reads — those require the authenticated session from `createServerClient`.
 */
export function createPublicClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
