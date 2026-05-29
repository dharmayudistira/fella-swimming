import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type FeaturedTestimonial = Pick<
  Database["public"]["Tables"]["testimonials"]["Row"],
  "id" | "name" | "role" | "rating" | "text" | "photo_url" | "display_order"
>;

/**
 * Featured testimonials rendered on /#testimoni.
 * RLS allows anon SELECT when status='published' AND featured=true.
 * Ordered by display_order ascending so admin can hand-curate position.
 */
export async function getFeaturedTestimonials(): Promise<FeaturedTestimonial[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, name, role, rating, text, photo_url, display_order")
    .eq("status", "published")
    .eq("featured", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[testimonials] getFeaturedTestimonials failed", error);
    return [];
  }
  return data ?? [];
}

/* ------------------------------------------------------------------ *
 * Admin query — full rows, every status. RLS gives authenticated admins
 * full read; anon callers only ever see published + featured rows.
 * Returns the full list (unpaginated) so drag-reorder operates on one set.
 * ------------------------------------------------------------------ */

export type TestimonialStatus = Database["public"]["Enums"]["testimonial_status"];
export type AdminTestimonial =
  Database["public"]["Tables"]["testimonials"]["Row"];

export type GetAdminTestimonialsParams = {
  status?: TestimonialStatus | "all";
  featured?: boolean;
  search?: string;
};

export async function getAdminTestimonials({
  status = "all",
  featured,
  search,
}: GetAdminTestimonialsParams = {}): Promise<AdminTestimonial[]> {
  const supabase = await createServerClient();
  let query = supabase
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }
  if (typeof featured === "boolean") {
    query = query.eq("featured", featured);
  }
  const trimmed = search?.trim();
  if (trimmed) {
    // `.or()` takes a raw PostgREST filter string (NOT parameterized). Restrict
    // the term to letters/digits/space so it cannot inject any filter syntax
    // (commas, dots, parens, operators) or LIKE wildcards.
    const safe = trimmed
      .replace(/[^\p{L}\p{N} ]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (safe) {
      query = query.or(
        `name.ilike.%${safe}%,role.ilike.%${safe}%,text.ilike.%${safe}%`,
      );
    }
  }

  const { data, error } = await query;
  if (error) {
    console.error("[testimonials] getAdminTestimonials failed", error);
    return [];
  }
  return data ?? [];
}
