/**
 * Stable TanStack Query keys for the admin testimoni surface.
 */

import type { TestimonialStatus } from "@/lib/queries/testimonials";

export const TESTIMONIALS_LIST_KEY = ["admin", "testimonials", "list"] as const;

export type TestimonialsListFilters = {
  status: TestimonialStatus | "all";
  featured: boolean | "all";
  search: string;
};

export const testimonialsListKey = (filters: TestimonialsListFilters) =>
  [...TESTIMONIALS_LIST_KEY, filters] as const;
