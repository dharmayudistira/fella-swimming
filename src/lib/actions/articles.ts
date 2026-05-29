"use server";

import "server-only";

import { revalidatePath } from "next/cache";

import {
  getAdminArticles,
  getArticleById,
  type GetAdminArticlesParams,
  type GetAdminArticlesResult,
} from "@/lib/queries/articles";
import { createServerClient } from "@/lib/supabase/server";
import { sanitizeArticleHtml } from "@/lib/utils/sanitize";
import { slugify } from "@/lib/utils/slug";
import {
  ArticleInputSchema,
  type ArticleInput,
} from "@/lib/validation/article.schema";
import type { Database, Json } from "@/types/database.types";

type ArticleInsert = Database["public"]["Tables"]["articles"]["Insert"];
type ArticleUpdate = Database["public"]["Tables"]["articles"]["Update"];
type SupabaseServer = Awaited<ReturnType<typeof createServerClient>>;

/** Empty Tiptap document — fallback for drafts saved with no body yet. */
const EMPTY_DOC: Json = { type: "doc", content: [] };

export type ArticleMutationResult =
  | { success: true; data: { id: string; slug: string } }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export type SimpleArticleResult =
  | { success: true }
  | { success: false; error: string };

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

/** Words / 200 wpm, floored at 1 minute. */
function readingTimeMinutes(html: string): number {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.round(words / 200));
}

/** Resolve a free-text category name to an id, creating it if new. */
async function resolveCategoryId(
  supabase: SupabaseServer,
  name: string | undefined,
): Promise<string | null> {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return null;
  const slug = slugify(trimmed);
  if (!slug) return null;

  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("categories")
    .insert({ name: trimmed, slug })
    .select("id")
    .single();
  if (error || !created) {
    // Unique-slug race: a concurrent request created it first — re-read.
    const { data: retry } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    return retry?.id ?? null;
  }
  return created.id;
}

async function slugExists(
  supabase: SupabaseServer,
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  let query = supabase.from("articles").select("id").eq("slug", slug);
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query.maybeSingle();
  return Boolean(data);
}

/** Append -2, -3, ... until the slug is free. Used only for auto-gen slugs. */
async function uniqueAutoSlug(
  supabase: SupabaseServer,
  base: string,
): Promise<string> {
  const root = base || "artikel";
  let candidate = root;
  let n = 2;
  while (await slugExists(supabase, candidate)) {
    candidate = `${root}-${n}`;
    n += 1;
  }
  return candidate;
}

async function requireUser(supabase: SupabaseServer) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

function revalidateArticlePublic() {
  revalidatePath("/artikel");
  revalidatePath("/artikel/[slug]", "page");
}

/* ------------------------------------------------------------------ *
 * Create
 * ------------------------------------------------------------------ */
export async function createArticle(
  input: ArticleInput,
): Promise<ArticleMutationResult> {
  const parsed = ArticleInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Data artikel tidak valid.",
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

  const explicitSlug = parsed.data.slug?.trim();
  let slug: string;
  if (explicitSlug) {
    if (await slugExists(supabase, explicitSlug)) {
      return {
        success: false,
        error: "Slug sudah dipakai artikel lain. Ubah slug-nya.",
        fieldErrors: { slug: ["Slug sudah dipakai artikel lain."] },
      };
    }
    slug = explicitSlug;
  } else {
    slug = await uniqueAutoSlug(supabase, slugify(parsed.data.title));
  }

  const categoryId = await resolveCategoryId(supabase, parsed.data.category);
  const html = sanitizeArticleHtml(parsed.data.content_html ?? "");
  const status = parsed.data.status;

  const insert: ArticleInsert = {
    title: parsed.data.title,
    slug,
    excerpt: parsed.data.excerpt ?? "",
    content: parsed.data.content ?? EMPTY_DOC,
    content_html: html,
    cover_image_url: parsed.data.cover_image_url ?? "",
    cover_image_alt: parsed.data.cover_image_alt ?? "",
    category_id: categoryId,
    author_name: parsed.data.author_name?.trim() || "Tim Fellaswimming",
    reading_time_minutes: readingTimeMinutes(html),
    status,
    seo_title: parsed.data.seo_title?.trim() || null,
    seo_description: parsed.data.seo_description?.trim() || null,
    published_at: status === "published" ? new Date().toISOString() : null,
    created_by: user.id,
    updated_by: user.id,
  };

  const { data, error } = await supabase
    .from("articles")
    .insert(insert)
    .select("id, slug")
    .single();

  if (error || !data) {
    console.error("[createArticle] insert failed", error);
    if (error?.code === "23505") {
      // Slug unique-violation lost a race against the pre-flight check.
      return {
        success: false,
        error: "Slug sudah dipakai artikel lain. Ubah slug-nya.",
        fieldErrors: { slug: ["Slug sudah dipakai artikel lain."] },
      };
    }
    return { success: false, error: "Gagal menyimpan artikel. Coba lagi." };
  }

  revalidatePath("/admin/artikel");
  if (status === "published") revalidateArticlePublic();

  return { success: true, data };
}

/* ------------------------------------------------------------------ *
 * Update
 * ------------------------------------------------------------------ */
export async function updateArticle(
  id: string,
  input: ArticleInput,
): Promise<ArticleMutationResult> {
  if (!id) return { success: false, error: "ID artikel tidak valid." };

  const parsed = ArticleInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Data artikel tidak valid.",
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

  const current = await getArticleById(id);
  if (!current) {
    return { success: false, error: "Artikel tidak ditemukan." };
  }

  // Keep the existing slug unless the admin explicitly changed it — auto-
  // regenerating from the title would break already-published URLs.
  let slug = current.slug;
  const explicitSlug = parsed.data.slug?.trim();
  if (explicitSlug && explicitSlug !== current.slug) {
    if (await slugExists(supabase, explicitSlug, id)) {
      return {
        success: false,
        error: "Slug sudah dipakai artikel lain. Ubah slug-nya.",
        fieldErrors: { slug: ["Slug sudah dipakai artikel lain."] },
      };
    }
    slug = explicitSlug;
  }

  const categoryId = await resolveCategoryId(supabase, parsed.data.category);
  const html = sanitizeArticleHtml(parsed.data.content_html ?? "");
  const status = parsed.data.status;
  // published_at marks the FIRST time the article went live and is preserved
  // across edits, unpublish, and re-publish (stable public publish date).
  const published_at =
    status === "published" && !current.published_at
      ? new Date().toISOString()
      : current.published_at;

  const update: ArticleUpdate = {
    title: parsed.data.title,
    slug,
    excerpt: parsed.data.excerpt ?? "",
    content: parsed.data.content ?? EMPTY_DOC,
    content_html: html,
    cover_image_url: parsed.data.cover_image_url ?? "",
    cover_image_alt: parsed.data.cover_image_alt ?? "",
    category_id: categoryId,
    author_name: parsed.data.author_name?.trim() || "Tim Fellaswimming",
    reading_time_minutes: readingTimeMinutes(html),
    status,
    seo_title: parsed.data.seo_title?.trim() || null,
    seo_description: parsed.data.seo_description?.trim() || null,
    published_at,
    updated_by: user.id,
  };

  const { data, error } = await supabase
    .from("articles")
    .update(update)
    .eq("id", id)
    .select("id, slug")
    .single();

  if (error || !data) {
    console.error("[updateArticle] update failed", error);
    if (error?.code === "23505") {
      return {
        success: false,
        error: "Slug sudah dipakai artikel lain. Ubah slug-nya.",
        fieldErrors: { slug: ["Slug sudah dipakai artikel lain."] },
      };
    }
    return { success: false, error: "Gagal menyimpan artikel. Coba lagi." };
  }

  revalidatePath("/admin/artikel");
  revalidateArticlePublic();

  return { success: true, data };
}

/* ------------------------------------------------------------------ *
 * Delete
 * ------------------------------------------------------------------ */
export async function deleteArticle(id: string): Promise<SimpleArticleResult> {
  if (!id) return { success: false, error: "ID artikel tidak valid." };

  const supabase = await createServerClient();
  const user = await requireUser(supabase);
  if (!user) {
    return { success: false, error: "Sesi habis. Login ulang, ya." };
  }

  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) {
    console.error("[deleteArticle] delete failed", error);
    return { success: false, error: "Gagal menghapus artikel. Coba lagi." };
  }

  revalidatePath("/admin/artikel");
  revalidateArticlePublic();
  return { success: true };
}

/* ------------------------------------------------------------------ *
 * Publish / Unpublish
 * ------------------------------------------------------------------ */
export async function publishArticle(
  id: string,
): Promise<SimpleArticleResult> {
  if (!id) return { success: false, error: "ID artikel tidak valid." };

  const supabase = await createServerClient();
  const user = await requireUser(supabase);
  if (!user) {
    return { success: false, error: "Sesi habis. Login ulang, ya." };
  }

  const current = await getArticleById(id);
  if (!current) {
    return { success: false, error: "Artikel tidak ditemukan." };
  }

  const update: ArticleUpdate = {
    status: "published",
    published_at: current.published_at ?? new Date().toISOString(),
    updated_by: user.id,
  };

  const { error } = await supabase
    .from("articles")
    .update(update)
    .eq("id", id);
  if (error) {
    console.error("[publishArticle] failed", error);
    return { success: false, error: "Gagal menerbitkan artikel. Coba lagi." };
  }

  revalidatePath("/admin/artikel");
  revalidateArticlePublic();
  return { success: true };
}

export async function unpublishArticle(
  id: string,
): Promise<SimpleArticleResult> {
  if (!id) return { success: false, error: "ID artikel tidak valid." };

  const supabase = await createServerClient();
  const user = await requireUser(supabase);
  if (!user) {
    return { success: false, error: "Sesi habis. Login ulang, ya." };
  }

  const { error } = await supabase
    .from("articles")
    .update({ status: "draft", updated_by: user.id } satisfies ArticleUpdate)
    .eq("id", id);
  if (error) {
    console.error("[unpublishArticle] failed", error);
    return {
      success: false,
      error: "Gagal menyembunyikan artikel. Coba lagi.",
    };
  }

  revalidatePath("/admin/artikel");
  revalidateArticlePublic();
  return { success: true };
}

/* ------------------------------------------------------------------ *
 * Admin list wrapper (auth-checked) — for client-side re-fetch on
 * filter / search / pagination changes.
 * ------------------------------------------------------------------ */
export type AdminArticlesListResult =
  | { success: true; data: GetAdminArticlesResult }
  | { success: false; error: string };

export async function getAdminArticlesList(
  params: GetAdminArticlesParams = {},
): Promise<AdminArticlesListResult> {
  const supabase = await createServerClient();
  const user = await requireUser(supabase);
  if (!user) {
    return { success: false, error: "Sesi habis. Login ulang, ya." };
  }
  const data = await getAdminArticles(params);
  return { success: true, data };
}
