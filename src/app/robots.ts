import type { MetadataRoute } from "next";

import { SITE } from "@/lib/constants/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Admin, auth, and callback surfaces must never be indexed (FR-023).
      disallow: [
        "/admin",
        "/login",
        "/lupa-password",
        "/reset-password",
        "/auth/",
        "/api",
      ],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
