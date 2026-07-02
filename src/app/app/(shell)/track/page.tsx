"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { useOrder } from "@/lib/order-context";

const MAIL_STAGES: Array<{ label: string; desc: string; invoice?: boolean; proof?: boolean }> = [
  { label: "Order placed", desc: "Box + shipping paid. Thanks!" },
  { label: "ArtBox on its way", desc: "Your empty box ships in 5–7 business days." },
  { label: "Fill it & mail it back", desc: "Pack your art, use the prepaid label inside." },
  { label: "Art photographed", desc: "We shot & edited every piece individually." },
  { label: "Book invoice ready", desc: "Digitization + your book, priced by pieces sent.", invoice: true },
  { label: "Design & proof", desc: "Our team designed your book — approve the proof.", proof: true },
  { label: "Book shipped home", desc: "On its way. About 2–3 weeks from mail-back to doorstep." },
];

const DIY_STAGES: Array<{ label: string; desc: string; invoice?: boolean; proof?: boolean }> = [
  { label: "Order placed", desc: "Book + shipping paid. Thanks!" },
  { label: "Building your book", desc: "We're laying out your uploaded photos into a designed book." },
  { label: "Design & proof", desc: "Your proof is ready — review & approve it in the app.", proof: true },
  { label: "Book shipped home", desc: "Printed, bound & on its way — about 2 weeks." },
];

export default function TrackPage() {
  const router = useRouter();
  const { state, productionMode, isAdmin, advanceStage, payInvoice } = useOrder();
  const isDiy = state.route === "diy";
  const stages = isDiy ? DIY_STAGES : MAIL_STAGES;
  const stageHeadline = stages[Math.min(state.stageIndex, stages.length - 1)].label;

  return (
    <>
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#F3E3E8] bg-white/94 px-5 py-4 backdrop-blur-md">
        <Logo />
        <span className="text-xs font-medium text-muted">{state.orderNo}</span>
      </div>

      <div className="px-5 pb-24 pt-5">
        <Link href="/app/account" className="mb-4 inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-[13px] font-semibold text-muted no-underline">
          <span className="text-base">←</span> Account
        </Link>
        <h1 className="m-0 text-2xl font-bold tracking-tight">Order status</h1>
        <p className="mb-7 mt-1 text-sm text-muted">{stageHeadline}</p>

        <div className="flex flex-col">
          {stages.map((stage, i) => {
            const done = i < state.stageIndex;
            const current = i === state.stageIndex;
            const last = i === stages.length - 1;
            return (
              <div key={stage.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                      done ? "bg-teal text-white" : current ? "animate-ab-pulse bg-pink text-white" : "bg-[#F3E3E8] text-[#C6A9B2]"
                    }`}
                  >
                    {done ? "✓" : current ? "●" : i + 1}
                  </span>
                  {!last ? <span className={`min-h-[26px] w-0.5 flex-1 ${i < state.stageIndex ? "bg-teal" : "bg-[#F0E1E7]"}`} /> : null}
                </div>
                <div className="flex-1 pb-[22px]">
                  <div className={`text-[15px] font-semibold ${done || current ? "text-body" : "text-[#B1A6AB]"}`}>{stage.label}</div>
                  <div className="mt-0.5 text-[13px] leading-relaxed text-muted">{stage.desc}</div>
                  {current && stage.invoice ? (
                    <div className="mt-3 rounded-xl bg-pink-light p-3.5">
                      <div className="mb-1.5 flex justify-between text-[13px]">
                        <span className="text-[#615f5b]">142 pieces · Family book</span>
                        <span className="font-bold">$249.00</span>
                      </div>
                      <div className="mb-3 flex justify-between text-xs text-muted">
                        <span>Digitization (142 × $0.99)</span>
                        <span>included</span>
                      </div>
                      <Button fullWidth size="sm" onClick={payInvoice}>
                        Review &amp; pay book invoice
                      </Button>
                    </div>
                  ) : null}
                  {current && stage.proof && !state.approved ? (
                    <button
                      type="button"
                      onClick={() => router.push("/app/book")}
                      className="mt-2.5 cursor-pointer rounded-full border border-[#E9C6D3] bg-white px-[18px] py-2.5 text-[13px] font-semibold text-pink"
                    >
                      Review your proof →
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {(!productionMode || isAdmin) ? (
          <div className="mt-2 flex items-center gap-3 rounded-[14px] bg-[#F5F1F2] p-4">
            <div className="flex-1 text-xs leading-snug text-[#9a9691]">
              {productionMode
                ? "Admin control — advance this order to the next production stage."
                : "Demo control — walk the order forward to preview each stage."}
            </div>
            <button
              type="button"
              onClick={() => void advanceStage()}
              className="shrink-0 cursor-pointer rounded-full border border-[#E0D6DA] bg-white px-[15px] py-2 text-[13px] font-semibold text-muted"
            >
              Advance ▸
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
