import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type ArticleListItem = Pick<
  Database["public"]["Tables"]["articles"]["Row"],
  | "id"
  | "slug"
  | "title"
  | "excerpt"
  | "cover_image_url"
  | "cover_image_alt"
  | "author_name"
  | "reading_time_minutes"
  | "published_at"
>;

export type ArticleDetail = Database["public"]["Tables"]["articles"]["Row"];

const LIST_COLUMNS =
  "id, slug, title, excerpt, cover_image_url, cover_image_alt, author_name, reading_time_minutes, published_at";

export type GetPublishedArticlesParams = {
  limit?: number;
  offset?: number;
};

export type GetPublishedArticlesResult = {
  items: ArticleListItem[];
  total: number;
};

/**
 * Paginated published-article fetch for /artikel.
 * Returns total count so the index page can render correct pagination.
 */
export async function getPublishedArticles({
  limit = 12,
  offset = 0,
}: GetPublishedArticlesParams = {}): Promise<GetPublishedArticlesResult> {
  const supabase = await createServerClient();
  const { data, error, count } = await supabase
    .from("articles")
    .select(LIST_COLUMNS, { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("[articles] getPublishedArticles failed", error);
    return { items: [], total: 0 };
  }
  return { items: data ?? [], total: count ?? 0 };
}

/**
 * Single published article by slug — used by /artikel/[slug].
 * Returns null when not found or not published so the route can 404.
 */
export async function getArticleBySlug(
  slug: string,
): Promise<ArticleDetail | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("[articles] getArticleBySlug failed", error);
    return null;
  }
  return data;
}
