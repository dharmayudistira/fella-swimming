import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database.types";

/**
 * Service-role Supabase client. Bypasses RLS — server-only.
 *
 * NEVER import from a Client Component or any file under "use client". The
 * `server-only` import will throw at build time if this leaks into the
 * client bundle.
 *
 * Use sparingly: only when an operation legitimately needs to bypass RLS,
 * e.g. anonymous registration INSERT ... RETURNING (anon has no SELECT on
 * registrations).
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
