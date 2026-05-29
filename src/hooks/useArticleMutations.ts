"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteArticle,
  publishArticle,
  unpublishArticle,
} from "@/lib/actions/articles";
import type { GetAdminArticlesResult } from "@/lib/queries/articles";

import { ARTICLES_LIST_KEY } from "./articleKeys";

type ListSnapshot = GetAdminArticlesResult;

/**
 * Optimistic publish/unpublish toggle for the artikel list. Flips the
 * status across every cached list query, rolls back on error.
 */
export function usePublishToggle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, publish }: { id: string; publish: boolean }) => {
      const result = publish
        ? await publishArticle(id)
        : await unpublishArticle(id);
      if (!result.success) throw new Error(result.error);
    },
    onMutate: async ({ id, publish }) => {
      await queryClient.cancelQueries({ queryKey: ARTICLES_LIST_KEY });
      const previous = queryClient.getQueriesData<ListSnapshot>({
        queryKey: ARTICLES_LIST_KEY,
      });
      queryClient.setQueriesData<ListSnapshot>(
        { queryKey: ARTICLES_LIST_KEY },
        (old) =>
          old
            ? {
                ...old,
                items: old.items.map((a) =>
                  a.id === id
                    ? { ...a, status: publish ? "published" : "draft" }
                    : a,
                ),
              }
            : old,
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      context?.previous?.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLES_LIST_KEY });
    },
  });
}

/**
 * Optimistic delete for the artikel list — removes the row immediately,
 * rolls back on error.
 */
export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteArticle(id);
      if (!result.success) throw new Error(result.error);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ARTICLES_LIST_KEY });
      const previous = queryClient.getQueriesData<ListSnapshot>({
        queryKey: ARTICLES_LIST_KEY,
      });
      queryClient.setQueriesData<ListSnapshot>(
        { queryKey: ARTICLES_LIST_KEY },
        (old) =>
          old
            ? {
                ...old,
                items: old.items.filter((a) => a.id !== id),
                total: Math.max(0, old.total - 1),
              }
            : old,
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      context?.previous?.forEach(([key, value]) => {
        queryClient.setQueryData(key, value);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLES_LIST_KEY });
    },
  });
}
