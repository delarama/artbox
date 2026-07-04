import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";
import { createSiteMetadata } from "@/lib/metadata";

export const metadata: Metadata = createSiteMetadata();

export default function Home() {
  return <LandingPage />;
}
