import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1C1C2E",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: 120,
            height: 120,
            gap: 10,
          }}
        >
          {["#E24B4A", "#EF9F27", "#7F77DD", "#1D9E75"].map((color) => (
            <div
              key={color}
              style={{
                width: 55,
                height: 55,
                borderRadius: 12,
                background: color,
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
