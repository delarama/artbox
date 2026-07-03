import type { Metadata } from "next";
import { getAppUrl } from "@/lib/env";
import { siteConfig } from "@/lib/site";

export function createSiteMetadata(overrides?: Metadata): Metadata {
  const appUrl = getAppUrl();

  return {
    metadataBase: new URL(appUrl),
    title: {
      default: siteConfig.title,
      template: `%s · ${siteConfig.name}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    keywords: [
      "children's art",
      "keepsake book",
      "art book",
      "Canada",
      "ArtBox",
      "mail-in art",
      "photo book",
      "framed mosaic",
    ],
    authors: [{ name: "ArtBox Canada Inc." }],
    creator: "ArtBox Canada Inc.",
    openGraph: {
      type: "website",
      locale: "en_CA",
      url: appUrl,
      siteName: siteConfig.name,
      title: siteConfig.title,
      description: siteConfig.description,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-icon", type: "image/png" }],
    },
    ...overrides,
  };
}
