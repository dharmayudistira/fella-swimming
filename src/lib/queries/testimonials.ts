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
