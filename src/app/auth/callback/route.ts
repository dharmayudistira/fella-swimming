import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { createServerClient } from "@/lib/supabase/server";

const VALID_OTP_TYPES: ReadonlySet<EmailOtpType> = new Set([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

/**
 * Single entry point for every email-link auth flow (invite, recovery,
 * magic link). Supabase's email templates can deliver the link in either
 * shape:
 *
 *   1. `?code=...`              — PKCE flow (e.g. `resetPasswordForEmail`)
 *   2. `?token_hash=...&type=…` — server-side verify (recommended in v2)
 *
 * For both we exchange the token, set cookies, and forward the user to
 * `?next` (defaults to /reset-password because invite + recovery both
 * land users without a usable password).
 *
 * Implicit-flow links that deliver tokens in the URL fragment (`#...`)
 * cannot be handled here — the server can't see fragments. Email
 * templates must use one of the two patterns above.
 */
/**
 * Reject `next` values that could escape the app origin (e.g. `//evil.com`,
 * `https://evil.com`, or anything with an embedded scheme). Only accept
 * single-leading-slash relative paths.
 */
function safeNext(raw: string | null): string {
  const fallback = "/reset-password";
  if (!raw) return fallback;
  if (!raw.startsWith("/")) return fallback;
  if (raw.startsWith("//")) return fallback;
  if (raw.includes("://")) return fallback;
  return raw;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const next = safeNext(searchParams.get("next"));
  const supabase = await createServerClient();

  const code = searchParams.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        `${origin}/login?error=auth_exchange_failed`,
      );
    }
    return NextResponse.redirect(`${origin}${next}`);
  }

  const tokenHash = searchParams.get("token_hash");
  const rawType = searchParams.get("type") ?? "";
  if (tokenHash && VALID_OTP_TYPES.has(rawType as EmailOtpType)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: rawType as EmailOtpType,
    });
    if (error) {
      return NextResponse.redirect(
        `${origin}/login?error=auth_exchange_failed`,
      );
    }
    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?error=missing_code`);
}
