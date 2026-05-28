import { cookies } from "next/headers";
import { createServerClient as createSSRServerClient } from "@supabase/ssr";

import type { Database } from "@/types/database.types";

/**
 * Server-side Supabase client bound to the current request's cookies.
 * Use in Server Components, Server Actions, and Route Handlers.
 *
 * Authorization MUST go through `supabase.auth.getUser()` (never `getSession()`).
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createSSRServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll is called from a Server Component where cookies cannot be
            // mutated. Safe to ignore — proxy.ts handles session refresh.
          }
        },
      },
    },
  );
}
