import { siteConfig } from "@/lib/site";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageAlt = siteConfig.shareTitle;

const mosaicColors = ["#E24B4A", "#EF9F27", "#7F77DD", "#1D9E75"];

export function OgShareImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(145deg, #1C1C2E 0%, #2a2a42 55%, #1C1C2E 100%)",
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ display: "flex", gap: 16 }}>
        {mosaicColors.map((color) => (
          <div
            key={color}
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: color,
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 900 }}>
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -2 }}>ArtBox</div>
        <div style={{ fontSize: 34, lineHeight: 1.35, color: "#E8E8EA" }}>{siteConfig.shareDescription}</div>
      </div>
      <div style={{ fontSize: 24, color: "#C8C8D8" }}>Canadian keepsake studio · artbox.ca</div>
    </div>
  );
}
