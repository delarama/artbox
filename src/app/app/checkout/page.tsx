"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressHeader, StickyFooter } from "@/components/layout/StickyFooter";
import { MobileFrame } from "@/components/layout/MobileFrame";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { RadioDot, SelectionCard } from "@/components/ui/SelectionCard";
import { startCheckout } from "@/lib/api-client";
import { FORMATS, PROVINCES } from "@/lib/constants";
import { useOrder } from "@/lib/order-context";
import { computeCheckout, fmt } from "@/lib/pricing";

export default function CheckoutPage() {
  const router = useRouter();
  const { state, productionMode, setDiyFormat, setShip, setCard, setPromoCode, applyPromo, placeOrder } = useOrder();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDiy = state.route === "diy";
  const accent = isDiy ? "purple" : "pink";
  const accentSoft = isDiy ? "bg-[#EFEEFB]" : "bg-pink-light";
  const { lineItems, total } = computeCheckout(state);

  const backHref = isDiy ? "/app/order/diy" : "/app/order/mail";

  return (
    <MobileFrame>
      <div className="flex min-h-screen flex-col">
        <ProgressHeader
          accent={accent}
          backHref={backHref}
          step1={{ label: isDiy ? "Photos" : "Order details", done: true }}
          step2={{ label: isDiy ? "Book & checkout" : "Shipping", active: true }}
        />

        <div className="flex-1 px-5 py-6">
          {isDiy ? (
            <div className="mb-[26px]">
              <div className="mb-1.5 text-base font-bold">Choose your book</div>
              <p className="mb-3.5 text-[13px] leading-relaxed text-muted">
                We&apos;ll lay out your {state.photos.length} photos into this book.
              </p>
              <div className="flex flex-col gap-3">
                {FORMATS.map((format) => {
                  const selected = state.diyFormat === format.id;
                  return (
                    <SelectionCard key={format.id} selected={selected} accent="purple" onClick={() => setDiyFormat(format.id)}>
                      <RadioDot selected={selected} accent="purple" />
                      <span className="flex-1 text-left">
                        <span className="block text-sm font-semibold">{format.name}</span>
                        <span className="mt-0.5 block text-xs text-muted">{format.desc}</span>
                      </span>
                      <span className={`whitespace-nowrap text-sm font-semibold ${selected ? "text-purple" : "text-muted"}`}>
                        ${format.price}
                      </span>
                    </SelectionCard>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className={`mb-6 rounded-2xl p-[18px] ${accentSoft}`}>
            <div className="mb-3.5 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Order summary</div>
            <div className="flex flex-col gap-2.5">
              {lineItems.map((item) => (
                <div key={item.label} className="flex justify-between gap-3 text-sm" style={{ color: item.color }}>
                  <span>{item.label}</span>
                  <span className="whitespace-nowrap font-medium">{item.amount}</span>
                </div>
              ))}
            </div>
            <div className="my-3.5 h-px bg-[#EAC9D6]" />
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold">Due today</span>
              <span className={`text-xl font-bold ${isDiy ? "text-purple" : "text-pink"}`}>{fmt(total)}</span>
            </div>
            <div className="mt-2 text-[11px] leading-relaxed text-[#a58394]">
              {isDiy
                ? "Your photos are laid out by our team — free revisions before print."
                : "＋ Digitization & book billed later, priced by pieces sent."}
            </div>
          </div>

          <div className="mb-3.5 text-base font-bold">Contact information</div>
          <div className="mb-[26px] flex flex-col gap-3.5">
            <div className="flex gap-3">
              <Input placeholder="First name" value={state.ship.first} onChange={(e) => setShip({ first: e.target.value })} />
              <Input placeholder="Last name" value={state.ship.last} onChange={(e) => setShip({ last: e.target.value })} />
            </div>
            <Input placeholder="Email" value={state.ship.email} onChange={(e) => setShip({ email: e.target.value })} />
            <Input placeholder="Phone number" inputMode="tel" value={state.ship.phone} onChange={(e) => setShip({ phone: e.target.value })} />
          </div>

          <div className="mb-3.5 text-base font-bold">Shipping address</div>
          <div className="mb-[26px] flex flex-col gap-3.5">
            <div className="flex items-center gap-2.5 rounded-xl border border-[#E4D8DC] bg-[#F9F6F7] px-4 py-3.5">
              <span className="text-[15px] font-medium">🇨🇦 Canada</span>
              <span className="ml-auto text-xs text-muted">Canadian addresses only</span>
            </div>
            <Input placeholder="Street address" value={state.ship.street} onChange={(e) => setShip({ street: e.target.value })} />
            <div className="flex gap-3">
              <Input placeholder="City" value={state.ship.city} onChange={(e) => setShip({ city: e.target.value })} />
              <Input placeholder="Postal" className="w-[118px]" value={state.ship.postal} onChange={(e) => setShip({ postal: e.target.value })} />
            </div>
            <Select value={state.ship.prov} onChange={(e) => setShip({ prov: e.target.value })}>
              {PROVINCES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="mb-3.5 text-base font-bold">Promo or gift card</div>
          <div className="mb-[26px] flex gap-2.5">
            <Input
              placeholder="Enter code"
              className="flex-1 uppercase"
              value={state.promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button
              type="button"
              onClick={applyPromo}
              className={`whitespace-nowrap rounded-xl px-[22px] text-sm font-semibold text-white ${state.promoApplied ? "bg-teal" : "bg-pink"}`}
            >
              {state.promoApplied ? "Applied" : "Apply"}
            </button>
          </div>

          <div className="mb-3.5 text-base font-bold">Payment</div>
          <div className="flex flex-col gap-3.5">
            <Input placeholder="Card number" inputMode="numeric" className="tracking-wide" value={state.card.num} onChange={(e) => setCard({ num: e.target.value })} />
            <div className="flex gap-3">
              <Input placeholder="MM / YY" value={state.card.exp} onChange={(e) => setCard({ exp: e.target.value })} />
              <Input placeholder="CVC" inputMode="numeric" className="w-[118px]" value={state.card.cvc} onChange={(e) => setCard({ cvc: e.target.value })} />
            </div>
          </div>
          <div className="mt-3.5 flex items-center gap-2 text-xs text-muted">
            <span className="text-teal">🔒</span>
            {productionMode
              ? "Payments are processed securely by Stripe. Card details are not stored on ArtBox servers."
              : "Encrypted & secure. This is a demo — no real charge."}
          </div>
        </div>

        <StickyFooter>
          <Button
            fullWidth
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              setError(null);
              try {
                if (productionMode && state.orderId) {
                  const result = await startCheckout(state.orderId, state);
                  if (result.mode === "stripe" && result.url) {
                    window.location.href = result.url;
                    return;
                  }
                }
                await placeOrder();
                router.push("/app/confirmation");
              } catch {
                setError("Checkout failed. Please try again.");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Processing…" : `Place order · ${fmt(total)}`}
          </Button>
          {error ? <p className="mt-2 text-center text-sm text-coral">{error}</p> : null}
        </StickyFooter>
      </div>
    </MobileFrame>
  );
}
