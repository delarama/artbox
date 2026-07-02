"use client";

import { useRouter } from "next/navigation";
import { StickyFooter } from "@/components/layout/StickyFooter";
import { MobileFrame } from "@/components/layout/MobileFrame";
import { Button } from "@/components/ui/Button";
import { useOrder } from "@/lib/order-context";

export default function ConfirmationPage() {
  const router = useRouter();
  const { state } = useOrder();
  const isDiy = state.route === "diy";

  const confTitle = isDiy ? "Your book is in the works!" : "Your box is on the way!";
  const confText = isDiy
    ? `We emailed a receipt to ${state.ship.email || "your email"}. We're laying out your photos now — watch for your proof in the app.`
    : `We emailed a receipt and tracking to ${state.ship.email || "your email"}. Fill your ArtBox, mail it back, and we'll take it from there.`;

  const nextSteps = isDiy
    ? [
        { n: "1", title: "We build your book", desc: "Our team lays out your uploaded photos into a designed book.", bg: "bg-pink-light", fg: "text-pink" },
        { n: "2", title: "Approve your proof", desc: "Review the proof in the app and approve when it's perfect.", bg: "bg-[#EFEEFB]", fg: "text-purple" },
        { n: "3", title: "It ships to your door", desc: "Printed, bound and mailed — about 2 weeks.", bg: "bg-[#E2F4EC]", fg: "text-teal" },
      ]
    : [
        { n: "1", title: "Fill it & mail it back", desc: "Your box arrives in 5–7 days with a prepaid return label.", bg: "bg-pink-light", fg: "text-pink" },
        { n: "2", title: "We photograph & price it", desc: "Every piece is shot individually; your book is priced by count.", bg: "bg-[#EFEEFB]", fg: "text-purple" },
        { n: "3", title: "Approve your proof", desc: "Our team designs the book; you tap approve; it ships home.", bg: "bg-[#E2F4EC]", fg: "text-teal" },
      ];

  return (
    <MobileFrame>
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 flex-col items-center px-6 pb-6 pt-[60px] text-center">
          <div className="animate-ab-pop mb-6 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#E2F4EC]">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="mb-2.5 text-[28px] font-bold tracking-tight">{confTitle}</h1>
          <p className="mb-2 max-w-[330px] text-base leading-relaxed text-[#615f5b]">{confText}</p>
          <div className="my-4 rounded-full bg-pink-light px-4 py-2 text-[13px] font-semibold text-pink">Order {state.orderNo}</div>

          <div className="w-full max-w-[360px] rounded-2xl border border-border bg-white p-6 text-left shadow-card">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.06em] text-muted">What happens next</div>
            <div className="flex flex-col gap-4">
              {nextSteps.map((step) => (
                <div key={step.n} className="flex gap-3.5">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${step.bg} ${step.fg}`}>
                    {step.n}
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{step.title}</div>
                    <div className="mt-0.5 text-[13px] leading-snug text-muted">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <StickyFooter>
          <Button fullWidth onClick={() => router.push("/app/track")}>
            Track your order <span className="text-[17px]">→</span>
          </Button>
        </StickyFooter>
      </div>
    </MobileFrame>
  );
}
