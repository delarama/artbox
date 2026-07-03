import type { Viewport } from "next";
import { Poppins } from "next/font/google";
import { createSiteMetadata } from "@/lib/metadata";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = createSiteMetadata();

export const viewport: Viewport = {
  themeColor: "#1C1C2E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <body className={`${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
