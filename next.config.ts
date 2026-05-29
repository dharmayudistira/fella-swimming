import type { NextConfig } from "next";

const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").host;
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  experimental: {
    // Image uploads run through Server Actions; the default body limit is 1MB,
    // which crashes 1-5MB uploads. Raise to cover our 5MB cap + multipart
    // overhead. Files >5MB are still rejected client-side before upload.
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
