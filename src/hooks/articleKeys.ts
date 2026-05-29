/**
 * Stable TanStack Query keys for the admin artikel surface.
 */

import type { ArticleStatus } from "@/lib/queries/articles";

export const ARTICLES_LIST_KEY = ["admin", "articles", "list"] as const;

export type ArticlesListFilters = {
  status: ArticleStatus | "all";
  search: string;
  page: number;
  pageSize: number;
};

export const articlesListKey = (filters: ArticlesListFilters) =>
  [...ARTICLES_LIST_KEY, filters] as const;
