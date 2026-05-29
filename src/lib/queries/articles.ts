import "server-only";

import { createPublicClient } from "@/lib/supabase/public";
import { createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type ArticleStatus = Database["public"]["Enums"]["article_status"];
export type Category = Pick<
  Database["public"]["Tables"]["categories"]["Row"],
  "id" | "name" | "slug"
>;

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
  const supabase = createPublicClient();
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

export type ArticleSitemapEntry = Pick<
  Database["public"]["Tables"]["articles"]["Row"],
  "slug" | "updated_at"
>;

/** All published article slugs + last-modified, for the dynamic sitemap (FR-023). */
export async function getPublishedArticleSlugs(): Promise<ArticleSitemapEntry[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("articles")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[articles] getPublishedArticleSlugs failed", error);
    return [];
  }
  return data ?? [];
}

/**
 * Single published article by slug — used by /artikel/[slug].
 * Returns null when not found or not published so the route can 404.
 */
export async function getArticleBySlug(
  slug: string,
): Promise<ArticleDetail | null> {
  const supabase = createPublicClient();
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

/* ------------------------------------------------------------------ *
 * Admin queries — return all statuses (RLS gives authenticated admins
 * full read; anon callers only see published, never drafts).
 * ------------------------------------------------------------------ */

export type AdminArticleListItem = Pick<
  Database["public"]["Tables"]["articles"]["Row"],
  | "id"
  | "slug"
  | "title"
  | "status"
  | "category_id"
  | "cover_image_url"
  | "cover_image_alt"
  | "reading_time_minutes"
  | "published_at"
  | "updated_at"
>;

const ADMIN_LIST_COLUMNS =
  "id, slug, title, status, category_id, cover_image_url, cover_image_alt, reading_time_minutes, published_at, updated_at";

export type GetAdminArticlesParams = {
  status?: ArticleStatus | "all";
  search?: string;
  page?: number;
  pageSize?: number;
};

export type GetAdminArticlesResult = {
  items: AdminArticleListItem[];
  total: number;
  page: number;
  pageSize: number;
};

/** Paginated/filterable admin article list, newest-edited first. */
export async function getAdminArticles({
  status = "all",
  search,
  page = 1,
  pageSize = 10,
}: GetAdminArticlesParams = {}): Promise<GetAdminArticlesResult> {
  const supabase = await createServerClient();
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("articles")
    .select(ADMIN_LIST_COLUMNS, { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (status !== "all") {
    query = query.eq("status", status);
  }
  const trimmed = search?.trim();
  if (trimmed) {
    // Escape LIKE metacharacters so "%"/"_" are matched literally.
    const escaped = trimmed.replace(/[%_\\]/g, "\\$&");
    query = query.ilike("title", `%${escaped}%`);
  }

  const { data, error, count } = await query;
  if (error) {
    console.error("[articles] getAdminArticles failed", error);
    return { items: [], total: 0, page: safePage, pageSize };
  }
  return { items: data ?? [], total: count ?? 0, page: safePage, pageSize };
}

/** Full article row by id — for the admin editor (edit mode). */
export async function getArticleById(id: string): Promise<ArticleDetail | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[articles] getArticleById failed", error);
    return null;
  }
  return data;
}

/** All categories, alphabetical — feeds the editor's free-text autocomplete. */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (error) {
    console.error("[articles] getCategories failed", error);
    return [];
  }
  return data ?? [];
}
