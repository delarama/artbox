"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PhotoThumb } from "@/components/ui/PhotoThumb";
import { useOrder } from "@/lib/order-context";

const SPREADS = [
  { n: "1", caption: "age 4 · autumn", bg: "#FBEAF0", ink: "#B76A88" },
  { n: "2", caption: "the blue phase", bg: "#EFEEFB", ink: "#7A72CE" },
  { n: "3", caption: "family portrait", bg: "#E2F4EC", ink: "#1D9E75" },
  { n: "4", caption: "dinosaurs!", bg: "#FBEAF0", ink: "#B76A88" },
  { n: "5", caption: "rainbow days", bg: "#EFEEFB", ink: "#7A72CE" },
];

export default function BookPage() {
  const router = useRouter();
  const { state, approveProof } = useOrder();
  const isDiy = state.route === "diy";
  const proofIdx = isDiy ? 2 : 5;
  const bookReady = state.stageIndex >= proofIdx;
  const bookTitle = "Our Art Year";

  if (state.approved) {
    return (
      <div className="px-5 pb-24 pt-7 text-center">
        <div className="animate-ab-pop mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#E2F4EC]">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Proof approved!</h1>
        <p className="mx-auto mb-6 max-w-[300px] text-[15px] leading-relaxed text-[#615f5b]">
          &quot;<strong className="text-body">{bookTitle}</strong>&quot; is off to print. We&apos;ll ship it home in 2–3 weeks.
        </p>
        <Button variant="ghost" onClick={() => router.push("/app/track")}>
          See it on the tracker →
        </Button>
      </div>
    );
  }

  if (!bookReady) {
    const stageHeadline = isDiy
      ? DIY_STAGES[Math.min(state.stageIndex, DIY_STAGES.length - 1)].label
      : MAIL_STAGES[Math.min(state.stageIndex, MAIL_STAGES.length - 1)].label;

    return (
      <div className="px-5 pb-24 pt-7 text-center">
        <div className="mx-auto mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-full bg-pink-light">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#D4537E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 6c-2-1.3-4.5-1.8-7-1v12c2.5-.8 5-.3 7 1 2-1.3 4.5-1.8 7-1V5c-2.5-.8-5-.3-7 1z" />
            <path d="M12 6v12" />
          </svg>
        </div>
        <h1 className="mb-2 text-[22px] font-bold tracking-tight">Your proof isn&apos;t ready yet</h1>
        <p className="mx-auto max-w-[300px] text-sm leading-relaxed text-muted">
          {isDiy
            ? "We're laying out your uploaded photos. Your proof will appear here to approve very soon."
            : "Once we've received and photographed your art, our design team builds your book and drops the proof right here to approve."}
        </p>
        <div className="mt-5 inline-block rounded-full bg-pink-light px-4 py-2 text-[13px] font-medium text-pink">
          Current status · {stageHeadline}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-5 pb-32 pt-7">
        <span className="mb-3.5 inline-block rounded-full bg-[#E2F4EC] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-teal">
          Proof ready to review
        </span>
        <h1 className="mb-1.5 text-2xl font-bold tracking-tight">We designed your book</h1>
        <p className="mb-6 text-sm leading-relaxed text-[#615f5b]">
          {isDiy
            ? `We laid out all ${state.photos.length} of your photos into a designed book. Flip through and approve when it's perfect.`
            : "Our creative team curated and laid out all 142 pieces for you. Flip through the proof and approve when it's perfect — no design work needed."}
        </p>

        <div className="mb-6 flex justify-center">
          <div className="relative flex aspect-[3/4] w-[220px] flex-col justify-between overflow-hidden rounded-[6px_12px_12px_6px] border-l-[7px] border-black/10 bg-pink p-[26px_22px] shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">ArtBox</span>
            <div>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-white/20 text-center font-mono text-[8px] text-white/80">
                COVER
                <br />
                ART
              </div>
              <div className="text-[22px] font-bold leading-tight text-white">{bookTitle}</div>
              <div className="mt-1.5 text-xs text-white/80">A keepsake collection · 2026</div>
            </div>
          </div>
        </div>

        {isDiy && state.photos.length > 0 ? (
          <>
            <div className="mb-2.5 text-xs font-medium uppercase tracking-wide text-muted">From your uploads</div>
            <div className="mb-5 grid grid-cols-3 gap-2">
              {state.photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square overflow-hidden rounded-lg bg-[#F3EEF0] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <PhotoThumb src={photo.url} alt={photo.name} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-2.5 text-xs font-medium uppercase tracking-wide text-muted">Inside spreads · 32 pages</div>
            <div className="ab-gallery mb-5 flex gap-3 overflow-x-auto pb-3 [scroll-snap-type:x_mandatory]">
              {SPREADS.map((spread) => (
                <div
                  key={spread.n}
                  className="flex w-[190px] shrink-0 items-center justify-center [scroll-snap-align:start]"
                  style={{ aspectRatio: "3/2", borderRadius: 10, background: spread.bg, boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}
                >
                  <span className="text-center font-mono text-[10px] leading-snug" style={{ color: spread.ink }}>
                    [ SPREAD {spread.n} ]
                    <br />
                    {spread.caption}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="rounded-xl bg-[#F5F1F2] p-[13px_15px] text-xs leading-relaxed text-[#8a8681]">
          Want something moved or swapped? Tap <strong className="text-pink">Request a tweak</strong> and our team revises it free before print.
        </div>
      </div>

      <div className="fixed bottom-16 left-1/2 z-20 flex w-full max-w-[440px] -translate-x-1/2 gap-3 border-t border-[#F3E3E8] bg-white/96 px-5 py-3.5 backdrop-blur-md">
        <Button variant="outline" className="shrink-0 px-[18px]" onClick={() => router.push("/app/track")}>
          Request a tweak
        </Button>
        <Button fullWidth className="flex-1" onClick={approveProof}>
          Approve &amp; print
        </Button>
      </div>
    </>
  );
}

const DIY_STAGES = [
  { label: "Order placed" },
  { label: "Building your book" },
  { label: "Design & proof" },
  { label: "Book shipped home" },
];

const MAIL_STAGES = [
  { label: "Order placed" },
  { label: "ArtBox on its way" },
  { label: "Fill it & mail it back" },
  { label: "Art photographed" },
  { label: "Book invoice ready" },
  { label: "Design & proof" },
  { label: "Book shipped home" },
];
