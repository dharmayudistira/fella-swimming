"use server";

import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  RegistrationSchema,
  type RegistrationInput,
} from "@/lib/validation/registration.schema";

export type SubmitRegistrationResult =
  | { success: true; data: { display_id: string } }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };

/**
 * Anonymous public mutation. Uses the service-role client so the
 * INSERT ... RETURNING display_id round-trip works without a SELECT
 * policy on anon (registrations is admin-read only).
 */
export async function submitRegistration(
  input: RegistrationInput,
): Promise<SubmitRegistrationResult> {
  const parsed = RegistrationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Data pendaftaran tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const supabase = createAdminClient();
  const payload = {
    ...parsed.data,
    preferred_schedule: parsed.data.preferred_schedule || null,
    preferred_location: parsed.data.preferred_location || null,
    parent_email: parsed.data.parent_email || null,
    notes: parsed.data.notes || null,
  };

  const { data, error } = await supabase
    .from("registrations")
    .insert(payload)
    .select("display_id")
    .single();

  if (error || !data) {
    console.error("[submitRegistration] insert failed", error);
    return {
      success: false,
      error: "Pendaftaran gagal disimpan. Coba lagi dalam beberapa saat.",
    };
  }

  return { success: true, data: { display_id: data.display_id } };
}
