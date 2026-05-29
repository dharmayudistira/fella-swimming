"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteTestimonial,
  reorderTestimonials,
  toggleFeatured,
} from "@/lib/actions/testimonials";
import type { AdminTestimonial } from "@/lib/queries/testimonials";

import { TESTIMONIALS_LIST_KEY } from "./testimonialKeys";

type ListSnapshot = AdminTestimonial[];

/** Optimistic featured toggle across every cached testimoni list. */
export function useToggleFeatured() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await toggleFeatured(id);
      if (!result.success) throw new Error(result.error);
      return result.data.featured;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TESTIMONIALS_LIST_KEY });
      const previous = queryClient.getQueriesData<ListSnapshot>({
        queryKey: TESTIMONIALS_LIST_KEY,
      });
      queryClient.setQueriesData<ListSnapshot>(
        { queryKey: TESTIMONIALS_LIST_KEY },
        (old) =>
          old?.map((t) =>
            t.id === id ? { ...t, featured: !t.featured } : t,
          ),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      context?.previous?.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TESTIMONIALS_LIST_KEY });
    },
  });
}

/** Optimistic drag-reorder: re-sorts cached rows + rewrites display_order. */
export function useReorderTestimonials() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const result = await reorderTestimonials({ orderedIds });
      if (!result.success) throw new Error(result.error);
    },
    onMutate: async (orderedIds) => {
      await queryClient.cancelQueries({ queryKey: TESTIMONIALS_LIST_KEY });
      const previous = queryClient.getQueriesData<ListSnapshot>({
        queryKey: TESTIMONIALS_LIST_KEY,
      });
      const rank = new Map(orderedIds.map((id, index) => [id, index]));
      queryClient.setQueriesData<ListSnapshot>(
        { queryKey: TESTIMONIALS_LIST_KEY },
        (old) =>
          old
            ? [...old]
                .map((t) =>
                  rank.has(t.id)
                    ? { ...t, display_order: rank.get(t.id)! }
                    : t,
                )
                .sort((a, b) => a.display_order - b.display_order)
            : old,
      );
      return { previous };
    },
    onError: (_err, _ids, context) => {
      context?.previous?.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TESTIMONIALS_LIST_KEY });
    },
  });
}

/** Optimistic delete. */
export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteTestimonial(id);
      if (!result.success) throw new Error(result.error);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TESTIMONIALS_LIST_KEY });
      const previous = queryClient.getQueriesData<ListSnapshot>({
        queryKey: TESTIMONIALS_LIST_KEY,
      });
      queryClient.setQueriesData<ListSnapshot>(
        { queryKey: TESTIMONIALS_LIST_KEY },
        (old) => old?.filter((t) => t.id !== id),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      context?.previous?.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TESTIMONIALS_LIST_KEY });
    },
  });
}
