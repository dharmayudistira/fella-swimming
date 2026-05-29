import type { Metadata } from "next";

/**
 * Centralized SEO defaults (FR-022). One source of truth for site name,
 * canonical base URL, and the default description used as OG/meta fallback.
 *
 * The default Open Graph image is generated dynamically by
 * `src/app/opengraph-image.tsx` (next/og) and inherited by every public
 * route, so no static asset path is hardcoded here. Article detail overrides
 * it with the article cover.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE = {
  name: "Fellaswimming",
  url: SITE_URL,
  /** Landing/home title — used as the metadata `default` and brand wordmark. */
  title: "Fellaswimming — Sekolah Renang Sidoarjo",
  description:
    "Sekolah renang anak di Sidoarjo. Kelas privat, semi-privat, dan grup untuk segala usia, diajar pelatih bersertifikat.",
  locale: "id_ID",
} as const;

type PageMetadataInput = {
  /** Leaf title; combined with the root template into "Leaf — Fellaswimming". Omit for the landing page (uses the absolute brand title). */
  title?: string;
  description?: string;
  /** Canonical path, resolved against `metadataBase` (e.g. "/artikel"). */
  path: string;
  type?: "website" | "article";
};

/**
 * Build a page `metadata` object with canonical URL + Open Graph/Twitter tags.
 * Title is left as a leaf so the root `template` appends "— Fellaswimming";
 * the landing page passes no title and falls back to the absolute brand title.
 */
export function pageMetadata({
  title,
  description = SITE.description,
  path,
  type = "website",
}: PageMetadataInput): Metadata {
  const ogTitle = title ? `${title} — ${SITE.name}` : SITE.title;

  return {
    title: title ?? { absolute: SITE.title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      siteName: SITE.name,
      locale: SITE.locale,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}
