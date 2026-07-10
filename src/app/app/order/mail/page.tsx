"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ProgressHeader, StickyFooter } from "@/components/layout/StickyFooter";
import { MobileFrame } from "@/components/layout/MobileFrame";
import { Button } from "@/components/ui/Button";
import { CheckBox, RadioDot, SelectionCard } from "@/components/ui/SelectionCard";
import { SPEEDS, UPGRADES, MAIL_BOX_LIST_PRICE, PROMO_AMOUNT } from "@/lib/constants";
import { useOrder } from "@/lib/order-context";
import { computeMailDueToday, fmt, mailBoxUnitPrice } from "@/lib/pricing";

export default function MailOrderPage() {
  const { state, setRoute, setQty, toggleReturnArt, toggleUpgrade, setSpeed } = useOrder();
  const total = computeMailDueToday(state);
  const unitPrice = mailBoxUnitPrice(state.promoApplied);
  const lineTotal = unitPrice * state.qty;

  useEffect(() => {
    setRoute("mail");
  }, [setRoute]);

  return (
    <MobileFrame>
      <div className="flex min-h-screen flex-col">
        <ProgressHeader
          accent="pink"
          backHref="/app/choose"
          step1={{ label: "Order details", done: false }}
          step2={{ label: "Shipping", active: false }}
        />

        <div className="flex-1 px-4 py-6 sm:px-5">
          <div className="mb-[26px] rounded-[18px] border border-border bg-white p-4 shadow-card">
            <div className="mb-4 flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl bg-[repeating-linear-gradient(135deg,#E9D3B8_0px,#E9D3B8_14px,#F1E2CE_14px,#F1E2CE_28px)]">
              <span className="text-center font-mono text-[11px] leading-relaxed text-[#9A7B52]">
                [ ARTBOX PHOTO ]
                <br />
                open kraft box filled with kids&apos; art
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="m-0 text-[22px] font-bold tracking-tight">The ArtBox</h1>
                <p className="m-0 text-[13px] text-muted">Everything you need to send in your art.</p>
              </div>
              <div className="shrink-0 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[22px] font-bold">{fmt(lineTotal)}</span>
                  {state.promoApplied ? (
                    <span className="rounded bg-pink px-1.5 py-0.5 text-[10px] font-semibold text-white">${PROMO_AMOUNT} OFF</span>
                  ) : null}
                </div>
                {state.promoApplied ? (
                  <span className="text-xs font-medium text-[#B0A6A9] line-through">{fmt(MAIL_BOX_LIST_PRICE * state.qty)} CAD</span>
                ) : (
                  <span className="text-xs font-medium text-muted">{fmt(unitPrice)} each</span>
                )}
              </div>
            </div>
            <div className="my-4 flex flex-col gap-2">
              {[
                '24"×17"×4" crush-proof box · holds 300–400 pieces',
                "Resealable art-protection bag inside",
                "Prepaid Canadian return label — no cross-border fees",
              ].map((item) => (
                <span key={item} className="flex items-start gap-2 text-[13px] leading-snug text-[#3d3c3a]">
                  <span className="font-bold text-teal">✓</span>
                  {item}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[#F3E9EC] pt-3.5">
              <span className="text-[13px] font-medium text-muted">Quantity</span>
              <div className="flex items-center gap-3.5">
                <button type="button" onClick={() => setQty(state.qty - 1)} aria-label="Decrease quantity" className="ab-icon-tap rounded-full border-[1.5px] border-[#E4D2D8] bg-white text-xl text-pink">
                  −
                </button>
                <span className="min-w-5 text-center text-[17px] font-bold">{state.qty}</span>
                <button type="button" onClick={() => setQty(state.qty + 1)} aria-label="Increase quantity" className="ab-icon-tap rounded-full border-[1.5px] border-[#E4D2D8] bg-white text-xl text-pink">
                  +
                </button>
              </div>
            </div>
            <div className="mt-3.5 flex gap-2 rounded-[10px] bg-pink-light p-3">
              <span className="shrink-0 text-pink">ⓘ</span>
              <span className="text-xs leading-relaxed text-[#8a5568]">
                Digitization &amp; your keepsake book are billed <strong>later</strong> — priced by how many pieces you actually send in. Nothing else to decide now; our team designs the book for you.
              </span>
            </div>
          </div>

          <h2 className="mb-3 text-lg font-bold tracking-tight">Do you want your artwork back?</h2>
          <SelectionCard selected={state.returnArt} onClick={toggleReturnArt} className="mb-0">
            <CheckBox checked={state.returnArt} />
            <span className="flex-1 min-w-0 text-left">
              <span className="block text-sm font-semibold">Return my artwork</span>
              <span className="mt-0.5 block text-xs text-muted">We carefully pack &amp; mail every original piece back.</span>
            </span>
            <span className={`whitespace-nowrap text-[13px] font-semibold ${state.returnArt ? "text-pink" : "text-muted"}`}>+ $19.99</span>
          </SelectionCard>

          <h2 className="mb-3 mt-7 text-lg font-bold tracking-tight">Recommended upgrades</h2>
          <div className="flex flex-col gap-3">
            {UPGRADES.map((upgrade) => {
              const on = state.up[upgrade.key];
              return (
                <SelectionCard key={upgrade.key} selected={on} onClick={() => toggleUpgrade(upgrade.key)}>
                  <CheckBox checked={on} />
                  <span className="flex-1 min-w-0 text-left">
                    <span className="block text-sm font-semibold">{upgrade.name}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted">{upgrade.desc}</span>
                  </span>
                  <span className={`whitespace-nowrap text-[13px] font-semibold ${on ? "text-pink" : "text-muted"}`}>
                    {on ? `+ $${upgrade.price.toFixed(2)}` : `$${upgrade.price.toFixed(2)}`}
                  </span>
                </SelectionCard>
              );
            })}
          </div>

          <h2 className="mb-3 mt-7 text-lg font-bold tracking-tight">Processing time</h2>
          <div className="flex flex-col gap-3">
            {SPEEDS.map((speed) => {
              const selected = state.speed === speed.id;
              return (
                <SelectionCard key={speed.id} selected={selected} onClick={() => setSpeed(speed.id)}>
                  <RadioDot selected={selected} />
                  <span className="flex-1 min-w-0 text-left">
                    <span className="block text-sm font-semibold">{speed.name}</span>
                    <span className="mt-0.5 block text-xs text-muted">{speed.desc}</span>
                  </span>
                  <span className={`whitespace-nowrap text-[13px] font-semibold ${speed.price === 0 ? "text-teal" : selected ? "text-pink" : "text-muted"}`}>
                    {speed.price === 0 ? "FREE" : `+ $${speed.price}`}
                  </span>
                </SelectionCard>
              );
            })}
          </div>
        </div>

        <StickyFooter className="flex items-center gap-3.5">
          <div className="shrink-0">
            <div className="text-[11px] font-medium text-muted">Due today</div>
            <div className="text-lg font-bold">{fmt(total)}</div>
          </div>
          <Link href="/app/checkout" className="flex-1">
            <Button fullWidth>
              Continue <span className="text-[17px]">→</span>
            </Button>
          </Link>
        </StickyFooter>
      </div>
    </MobileFrame>
  );
}
