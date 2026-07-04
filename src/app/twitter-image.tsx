import { ImageResponse } from "next/og";
import { OgShareImage, ogImageAlt, ogImageSize } from "@/lib/og-image";

export const size = ogImageSize;
export const contentType = "image/png";
export const alt = ogImageAlt;

export default function TwitterImage() {
  return new ImageResponse(<OgShareImage />, { ...size });
}
