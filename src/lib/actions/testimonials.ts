"use server";

import "server-only";

import { revalidatePath } from "next/cache";

import {
  getAdminTestimonials,
  type AdminTestimonial,
  type GetAdminTestimonialsParams,
} from "@/lib/queries/testimonials";
import { createServerClient } from "@/lib/supabase/server";
import {
  ReorderTestimonialsSchema,
  TestimonialInputSchema,
  type ReorderTestimonialsInput,
  type TestimonialInput,
} from "@/lib/validation/testimonial.schema";
import type { Database } from "@/types/database.types";

type TestimonialInsert =
  Database["public"]["Tables"]["testimonials"]["Insert"];
type TestimonialUpdate =
  Database["public"]["Tables"]["testimonials"]["Update"];
type SupabaseServer = Awaited<ReturnType<typeof createServerClient>>;

export type TestimonialMutationResult =
  | { success: true; data: { id: string } }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export type SimpleTestimonialResult =
  | { success: true }
  | { success: false; error: string };

export type ToggleFeaturedResult =
  | { success: true; data: { featured: boolean } }
  | { success: false; error: string };

export type AdminTestimonialsListResult =
  | { success: true; data: AdminTestimonial[] }
  | { success: false; error: string };

/* ------------------------------------------------------------------ */

async function requireUser(supabase: SupabaseServer) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Next display_order = current max + 1, so new rows append to the end. */
async function nextDisplayOrder(supabase: SupabaseServer): Promise<number> {
  const { data } = await supabase
    .from("testimonials")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.display_order ?? 0) + 1;
}

function toRow(input: TestimonialInput) {
  return {
    name: input.name,
    role: input.role?.trim() || null,
    rating: input.rating,
    text: input.text,
    photo_url: input.photo_url?.trim() || null,
    featured: input.featured,
    status: input.status,
  };
}

/* ------------------------------------------------------------------ *
 * Create
 * ------------------------------------------------------------------ */
export async function createTestimonial(
  input: TestimonialInput,
): Promise<TestimonialMutationResult> {
  const parsed = TestimonialInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Data testimoni tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const supabase = await createServerClient();
  const user = await requireUser(supabase);
  if (!user) {
    return { success: false, error: "Sesi habis. Login ulang, ya." };
  }

  const insert: TestimonialInsert = {
    ...toRow(parsed.data),
    display_order: await nextDisplayOrder(supabase),
    created_by: user.id,
  };

  const { data, error } = await supabase
    .from("testimonials")
    .insert(insert)
    .select("id")
    .single();

  if (error || !data) {
    console.error("[createTestimonial] insert failed", error);
    return { success: false, error: "Gagal menyimpan testimoni. Coba lagi." };
  }

  revalidatePath("/");
  revalidatePath("/admin/testimoni");
  return { success: true, data };
}

/* ------------------------------------------------------------------ *
 * Update
 * ------------------------------------------------------------------ */
export async function updateTestimonial(
  id: string,
  input: TestimonialInput,
): Promise<TestimonialMutationResult> {
  if (!id) return { success: false, error: "ID testimoni tidak valid." };

  const parsed = TestimonialInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Data testimoni tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const supabase = await createServerClient();
  const user = await requireUser(supabase);
  if (!user) {
    return { success: false, error: "Sesi habis. Login ulang, ya." };
  }

  const update: TestimonialUpdate = toRow(parsed.data);
  const { data, error } = await supabase
    .from("testimonials")
    .update(update)
    .eq("id", id)
    .select("id")
    .single();

  if (error || !data) {
    console.error("[updateTestimonial] update failed", error);
    return { success: false, error: "Gagal menyimpan testimoni. Coba lagi." };
  }

  revalidatePath("/");
  revalidatePath("/admin/testimoni");
  return { success: true, data };
}

/* ------------------------------------------------------------------ *
 * Delete
 * ------------------------------------------------------------------ */
export async function deleteTestimonial(
  id: string,
): Promise<SimpleTestimonialResult> {
  if (!id) return { success: false, error: "ID testimoni tidak valid." };

  const supabase = await createServerClient();
  const user = await requireUser(supabase);
  if (!user) {
    return { success: false, error: "Sesi habis. Login ulang, ya." };
  }

  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) {
    console.error("[deleteTestimonial] delete failed", error);
    return { success: false, error: "Gagal menghapus testimoni. Coba lagi." };
  }

  revalidatePath("/");
  revalidatePath("/admin/testimoni");
  return { success: true };
}

/* ------------------------------------------------------------------ *
 * Toggle featured — flips the boolean, returns the new state so the
 * client can reconcile its optimistic update.
 * ------------------------------------------------------------------ */
export async function toggleFeatured(id: string): Promise<ToggleFeaturedResult> {
  if (!id) return { success: false, error: "ID testimoni tidak valid." };

  const supabase = await createServerClient();
  const user = await requireUser(supabase);
  if (!user) {
    return { success: false, error: "Sesi habis. Login ulang, ya." };
  }

  const { data: current, error: readError } = await supabase
    .from("testimonials")
    .select("featured")
    .eq("id", id)
    .maybeSingle();
  if (readError || !current) {
    return { success: false, error: "Testimoni tidak ditemukan." };
  }

  const featured = !current.featured;
  const { error } = await supabase
    .from("testimonials")
    .update({ featured } satisfies TestimonialUpdate)
    .eq("id", id);
  if (error) {
    console.error("[toggleFeatured] update failed", error);
    return { success: false, error: "Gagal mengubah status featured." };
  }

  revalidatePath("/");
  revalidatePath("/admin/testimoni");
  return { success: true, data: { featured } };
}

/* ------------------------------------------------------------------ *
 * Reorder — writes each id's array index back to display_order.
 * ------------------------------------------------------------------ */
export async function reorderTestimonials(
  input: ReorderTestimonialsInput,
): Promise<SimpleTestimonialResult> {
  const parsed = ReorderTestimonialsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Urutan testimoni tidak valid." };
  }

  const supabase = await createServerClient();
  const user = await requireUser(supabase);
  if (!user) {
    return { success: false, error: "Sesi habis. Login ulang, ya." };
  }

  const { orderedIds } = parsed.data;
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("testimonials")
        .update({ display_order: index } satisfies TestimonialUpdate)
        .eq("id", id),
    ),
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) {
    console.error("[reorderTestimonials] update failed", failed.error);
    return { success: false, error: "Gagal menyimpan urutan. Coba lagi." };
  }

  revalidatePath("/");
  revalidatePath("/admin/testimoni");
  return { success: true };
}

/* ------------------------------------------------------------------ *
 * Admin list wrapper (auth-checked) for client-side re-fetch.
 * ------------------------------------------------------------------ */
export async function getAdminTestimonialsList(
  params: GetAdminTestimonialsParams = {},
): Promise<AdminTestimonialsListResult> {
  const supabase = await createServerClient();
  const user = await requireUser(supabase);
  if (!user) {
    return { success: false, error: "Sesi habis. Login ulang, ya." };
  }
  const data = await getAdminTestimonials(params);
  return { success: true, data };
}
