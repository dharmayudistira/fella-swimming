"use server";

import "server-only";

import { revalidatePath } from "next/cache";

import {
  getRegistrationById,
  getRegistrationsList,
  type GetRegistrationsListParams,
  type GetRegistrationsListResult,
  type Registration,
} from "@/lib/queries/registrations";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerClient } from "@/lib/supabase/server";
import {
  RegistrationSchema,
  type RegistrationInput,
} from "@/lib/validation/registration.schema";
import {
  UpdateRegistrationStatusSchema,
  type UpdateRegistrationStatusInput,
} from "@/lib/validation/registration-admin.schema";

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

export type AdminRegistrationListResult =
  | { success: true; data: GetRegistrationsListResult }
  | { success: false; error: string };

/**
 * Admin-only — fetch the paginated/filterable list for the pendaftaran table.
 * Auth-checks first so callers can re-fetch from a Client Component without
 * exposing the underlying query module.
 */
export async function getAdminRegistrationsList(
  params: GetRegistrationsListParams = {},
): Promise<AdminRegistrationListResult> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Sesi habis. Login ulang, ya." };
  }
  const data = await getRegistrationsList(params);
  return { success: true, data };
}

export type AdminRegistrationDetailResult =
  | { success: true; data: Registration }
  | { success: false; error: string };

/**
 * Admin-only — fetch full registration detail for the modal. Auth-checks
 * before reading.
 */
export async function getAdminRegistrationDetail(
  id: string,
): Promise<AdminRegistrationDetailResult> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Sesi habis. Login ulang, ya." };
  }

  if (!id) {
    return { success: false, error: "ID pendaftaran tidak valid." };
  }

  const data = await getRegistrationById(id);
  if (!data) {
    return { success: false, error: "Pendaftaran tidak ditemukan." };
  }
  return { success: true, data };
}

export type UpdateRegistrationStatusResult =
  | { success: true; data: Registration }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Admin-only — update a registration's status and/or internal notes.
 *
 * When status transitions to `dihubungi` for the first time we stamp
 * `contacted_at = NOW()` so reports can compute response latency without
 * scanning the full history.
 *
 * Revalidates the admin list and home dashboard so cached counts and the
 * recent-leads table stay fresh.
 */
export async function updateRegistrationStatus(
  input: UpdateRegistrationStatusInput,
): Promise<UpdateRegistrationStatusResult> {
  const parsed = UpdateRegistrationStatusSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Data status tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: "Sesi habis. Login ulang, ya." };
  }

  const { id, status, internal_notes } = parsed.data;

  const current = await getRegistrationById(id);
  if (!current) {
    return { success: false, error: "Pendaftaran tidak ditemukan." };
  }

  const update: Partial<Registration> = { status };
  if (internal_notes !== undefined) {
    update.internal_notes = internal_notes || null;
  }
  if (status === "dihubungi" && !current.contacted_at) {
    update.contacted_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("registrations")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    console.error("[updateRegistrationStatus] failed", error);
    return {
      success: false,
      error: "Gagal menyimpan perubahan. Coba lagi sebentar.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/pendaftaran");

  return { success: true, data };
}
