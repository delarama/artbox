import type { Metadata } from "next";
import Link from "next/link";
import { MobileFrame } from "@/components/layout/MobileFrame";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Page not found",
};

const mosaicColors = ["#E24B4A", "#EF9F27", "#7F77DD", "#1D9E75"];

export default function NotFound() {
  return (
    <MobileFrame>
      <div className="flex min-h-screen flex-col items-center justify-center px-8 py-12 text-center">
        <Logo size="lg" className="mb-8" />

        <div className="mb-8 grid h-[88px] w-[88px] grid-cols-2 gap-2 rounded-2xl bg-navy p-3 shadow-elevated">
          {mosaicColors.map((color) => (
            <div key={color} className="rounded-md" style={{ backgroundColor: color }} />
          ))}
        </div>

        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-pink">404</p>
        <h1 className="mb-3 text-[27px] font-bold leading-[1.15] tracking-tight text-navy">
          This page wandered off the fridge
        </h1>
        <p className="mb-8 max-w-[280px] text-[15px] leading-relaxed text-body-alt">
          We couldn&apos;t find that page. Head back home and keep building your keepsake.
        </p>

        <Link
          href="/"
          className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-pink px-8 text-[15px] font-semibold text-white transition-colors hover:bg-pink-dark"
        >
          Back to home
        </Link>
      </div>
    </MobileFrame>
  );
}
