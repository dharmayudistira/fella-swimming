import { ImageResponse } from "next/og";

import { SITE } from "@/lib/constants/seo";

// Default Open Graph image (FR-022), generated at the edge and inherited by
// every public route. Article detail overrides it with the article cover.
export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette as hex (Satori does not support OKLCH).
const NAVY = "#1a2332";
const SKY = "#2ba7dd";
const SKY_DARK = "#1273a8";
const SUN = "#f2c14e";
const TURQUOISE = "#2fc1bd";
const SAND = "#faf8f5";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: SAND,
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Decorative blobs — echo of the landing background motif */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: 9999,
            backgroundColor: SKY,
            opacity: 0.18,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -140,
            left: -100,
            width: 320,
            height: 320,
            borderRadius: 9999,
            backgroundColor: SUN,
            opacity: 0.22,
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            letterSpacing: 4,
            color: SKY_DARK,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9999,
              backgroundColor: TURQUOISE,
            }}
          />
          Sekolah Renang Sidoarjo
        </div>

        {/* Wordmark + tagline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 128,
              fontWeight: 700,
              color: NAVY,
              lineHeight: 1,
              letterSpacing: -3,
            }}
          >
            Fellaswimming
          </div>
          <div
            style={{
              marginTop: 28,
              height: 14,
              width: 280,
              borderRadius: 9999,
              backgroundColor: SKY,
            }}
          />
          <div
            style={{
              marginTop: 32,
              fontSize: 38,
              color: "#5c6573",
              maxWidth: 880,
              lineHeight: 1.3,
            }}
          >
            Kelas privat, semi-privat, dan grup untuk anak segala usia.
          </div>
        </div>

        {/* Footer URL */}
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: NAVY,
            fontWeight: 600,
          }}
        >
          fellaswimming.com
        </div>
      </div>
    ),
    size,
  );
}
