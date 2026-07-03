import { FORMATS, HST_RATE, MAIL_BOX_LIST_PRICE, MAIL_BOX_UNIT_PRICE, PROMO_AMOUNT, SPEEDS, UPGRADES } from "./constants";
import type { OrderState } from "./types";

export function fmt(n: number) {
  return `$${n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export type LineItem = {
  label: string;
  amount: string;
  color: string;
};

export function mailBoxUnitPrice(promoApplied: boolean) {
  return promoApplied ? MAIL_BOX_UNIT_PRICE : MAIL_BOX_LIST_PRICE;
}

export function computeMailSubtotal(state: Pick<OrderState, "qty" | "promoApplied" | "returnArt" | "up" | "speed">) {
  let subtotal = MAIL_BOX_LIST_PRICE * state.qty;
  if (state.promoApplied) subtotal -= PROMO_AMOUNT * state.qty;
  if (state.returnArt) subtotal += 19.99;
  UPGRADES.forEach((u) => {
    if (state.up[u.key]) subtotal += u.price;
  });
  subtotal += (SPEEDS.find((x) => x.id === state.speed) ?? SPEEDS[0]).price;
  return subtotal;
}

function appendMailLineItems(state: Pick<OrderState, "qty" | "promoApplied" | "returnArt" | "up" | "speed">, lineItems: LineItem[]) {
  lineItems.push({
    label: `The ArtBox × ${state.qty}`,
    amount: fmt(MAIL_BOX_LIST_PRICE * state.qty),
    color: "#2C2C2A",
  });
  if (state.promoApplied) {
    lineItems.push({
      label: `Promo · ARTKIVE ($${PROMO_AMOUNT} off each)`,
      amount: `− ${fmt(PROMO_AMOUNT * state.qty)}`,
      color: "#1D9E75",
    });
  }
  if (state.returnArt) {
    lineItems.push({ label: "Return my artwork", amount: fmt(19.99), color: "#2C2C2A" });
  }
  UPGRADES.forEach((u) => {
    if (state.up[u.key]) {
      lineItems.push({ label: u.name, amount: fmt(u.price), color: "#2C2C2A" });
    }
  });
  const speed = SPEEDS.find((x) => x.id === state.speed) ?? SPEEDS[0];
  if (speed.price > 0) {
    lineItems.push({ label: `${speed.name} processing`, amount: fmt(speed.price), color: "#2C2C2A" });
  }
}

export function computeCheckout(state: OrderState) {
  const lineItems: LineItem[] = [];
  let subtotal = 0;

  if (state.route === "diy") {
    const format = FORMATS.find((f) => f.id === state.diyFormat) ?? FORMATS[1];
    subtotal = format.price;
    lineItems.push({
      label: `${format.name} · ${state.photos.length} pieces`,
      amount: fmt(format.price),
      color: "#2C2C2A",
    });
    if (state.promoApplied) {
      subtotal -= PROMO_AMOUNT;
      lineItems.push({ label: "Promo · ARTKIVE", amount: `− ${fmt(PROMO_AMOUNT)}`, color: "#1D9E75" });
    }
  } else if (state.route === "mail" || state.route === null) {
    subtotal = computeMailSubtotal(state);
    appendMailLineItems(state, lineItems);
  }

  const tax = Math.round(subtotal * HST_RATE * 100) / 100;
  const total = subtotal + tax;
  lineItems.push({ label: "HST (13%)", amount: fmt(tax), color: "#888780" });
  lineItems.push({ label: "Shipping", amount: "Free", color: "#1D9E75" });

  return { lineItems, subtotal, tax, total };
}

export function computeMailDueToday(state: Pick<OrderState, "qty" | "promoApplied" | "returnArt" | "up" | "speed">) {
  const subtotal = computeMailSubtotal(state);
  const tax = Math.round(subtotal * HST_RATE * 100) / 100;
  return subtotal + tax;
}
