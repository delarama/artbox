"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut as authSignOut } from "next-auth/react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { useOrder } from "@/lib/order-context";

const PAST_BOOKS = [
  { title: "Preschool Year", meta: "48 pieces · Delivered Mar 2025", color: "#7F77DD" },
  { title: "Summer Camp Collection", meta: "92 pieces · Delivered Sep 2025", color: "#1D9E75" },
];

const MAIL_STAGES = [
  "Order placed",
  "ArtBox on its way",
  "Fill it & mail it back",
  "Art photographed",
  "Book invoice ready",
  "Design & proof",
  "Book shipped home",
];

const DIY_STAGES = ["Order placed", "Building your book", "Design & proof", "Book shipped home"];

export default function AccountPage() {
  const router = useRouter();
  const { state, productionMode, resetOrder, signOut } = useOrder();
  const isDiy = state.route === "diy";
  const stages = isDiy ? DIY_STAGES : MAIL_STAGES;
  const stageHeadline = stages[Math.min(state.stageIndex, stages.length - 1)];

  return (
    <>
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#F3E3E8] bg-white/94 px-5 py-4 backdrop-blur-md">
        <Logo />
        <span className="text-xs font-medium text-muted">{state.orderNo}</span>
      </div>

      <div className="px-5 pb-24 pt-7">
        <h1 className="m-0 text-2xl font-bold tracking-tight">Hi there 👋</h1>
        <p className="mb-6 mt-1 text-sm text-muted">Your ArtBox account</p>

        <div className="mb-6 rounded-2xl bg-pink p-[22px] text-white shadow-[0_8px_22px_rgba(212,83,126,0.22)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-white/85">Current order</span>
            <span className="text-xs font-medium text-white/85">{state.orderNo}</span>
          </div>
          <div className="mb-1 text-[19px] font-bold">
            {isDiy ? `DIY book · ${state.photos.length} pieces` : `The ArtBox × ${state.qty}`}
          </div>
          <div className="mb-4 text-[13px] text-white/85">{stageHeadline}</div>
          <Link href="/app/track">
            <button type="button" className="cursor-pointer rounded-full border-0 bg-white px-[18px] py-2.5 text-[13px] font-semibold text-pink">
              View tracker →
            </button>
          </Link>
        </div>

        <Button fullWidth className="mb-6 shadow-[0_6px_18px_rgba(212,83,126,0.22)]" onClick={() => router.push("/app/choose")}>
          <span className="text-[19px] leading-none">＋</span> Create a new book
        </Button>

        {!productionMode ? (
          <>
            <div className="mb-6 flex items-center gap-3.5 rounded-[14px] bg-pink-light p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#EFEEFB]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7F77DD" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 3v12" />
                  <path d="M8 11l4 4 4-4" />
                  <path d="M4 21h16" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">Digital gallery</div>
                <div className="text-xs text-muted">Ready once your art is photographed.</div>
              </div>
              <span className="text-xs font-semibold text-[#B9A9AE]">Soon</span>
            </div>

            <div className="mb-3.5 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Your books</div>
            <div className="mb-6 flex flex-col gap-3.5">
              {PAST_BOOKS.map((book) => (
                <div key={book.title} className="flex items-center gap-3.5 rounded-[14px] border border-border bg-white p-3.5 shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
                  <div className="h-16 w-[52px] shrink-0 rounded-[4px_7px_7px_4px] border-l-4 border-black/10" style={{ background: book.color }} />
                  <div className="flex-1">
                    <div className="text-[15px] font-semibold">{book.title}</div>
                    <div className="text-xs text-muted">{book.meta}</div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2">
                    <button type="button" className="cursor-pointer rounded-full border-0 bg-pink-light px-3.5 py-1.5 text-xs font-semibold text-pink">
                      Download
                    </button>
                    <button type="button" className="cursor-pointer rounded-full border border-[#E4D8DC] bg-white px-3.5 py-1.5 text-xs font-semibold text-muted">
                      Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}

        <div className="border-t border-[#F0E4E8]">
          <div className="flex items-center justify-between border-b border-[#F6EDF0] px-0.5 py-4">
            <span className="text-sm font-medium">Language</span>
            <span className="text-[13px] font-semibold text-pink">English · Français</span>
          </div>
          <div className="flex items-center justify-between border-b border-[#F6EDF0] px-0.5 py-4">
            <span className="text-sm font-medium">Email</span>
            <span className="text-[13px] text-muted">{state.ship.email || "your email"}</span>
          </div>
          <button
            type="button"
            onClick={async () => {
              signOut();
              if (productionMode) await authSignOut({ callbackUrl: "/app/login" });
              else router.push("/app/login");
            }}
            className="w-full cursor-pointer border-0 border-b border-[#F6EDF0] bg-transparent px-0.5 py-4 text-left text-sm font-medium text-body hover:text-pink"
          >
            Sign out
          </button>
          {!productionMode ? (
            <button
              type="button"
              onClick={() => {
                resetOrder();
                router.push("/app/choose");
              }}
              className="w-full cursor-pointer border-0 bg-transparent px-0.5 py-4 text-left text-sm font-medium text-muted hover:text-pink"
            >
              Start a new demo order
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}
