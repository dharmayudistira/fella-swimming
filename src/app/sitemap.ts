import type { MetadataRoute } from "next";

import { SITE } from "@/lib/constants/seo";
import { getPublishedArticleSlugs } from "@/lib/queries/articles";

// Mirror the article-index ISR cadence so new posts surface within a minute.
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticleSlugs();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/daftar`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/artikel`, changeFrequency: "daily", priority: 0.7 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE.url}/artikel/${article.slug}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes];
}
