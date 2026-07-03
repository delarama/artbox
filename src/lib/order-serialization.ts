import type { Order } from "@prisma/client";
import { defaultOrderState } from "@/lib/defaults";
import type { DiyFormat, OrderState, Route, Speed, Upgrades } from "@/lib/types";

type OrderPhotoRow = {
  id: string;
  url: string;
  filename: string;
};

export function generateOrderNo() {
  const year = new Date().getFullYear();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `AB-${year}-${suffix}`;
}

export function orderToClientState(
  order: Order,
  photos: OrderPhotoRow[] = [],
): Partial<OrderState> & { orderId: string } {
  const ship = (order.ship ?? {}) as OrderState["ship"];
  const upRaw = order.upgrades as Partial<Upgrades> | null | undefined;
  const up =
    upRaw && Object.keys(upRaw).length > 0
      ? ({ ...defaultOrderState.up, ...upRaw } as Upgrades)
      : defaultOrderState.up;

  return {
    orderId: order.id,
    route: order.route as Route,
    qty: order.qty,
    returnArt: order.returnArt,
    up,
    speed: order.speed as Speed,
    diyFormat: order.diyFormat as DiyFormat,
    promoCode: order.promoCode ?? defaultOrderState.promoCode,
    promoApplied: order.promoApplied,
    ship: { ...defaultOrderState.ship, ...ship },
    approved: order.approved,
    stageIndex: order.stageIndex,
    orderNo: order.orderNo,
    photos: photos.map((p) => ({ id: p.id, url: p.url, name: p.filename })),
  };
}

export function clientStateToOrderPatch(state: OrderState) {
  return {
    route: state.route ?? undefined,
    qty: state.qty,
    returnArt: state.returnArt,
    upgrades: state.up,
    speed: state.speed,
    diyFormat: state.diyFormat,
    promoCode: state.promoCode,
    promoApplied: state.promoApplied,
    ship: state.ship,
    approved: state.approved,
    stageIndex: state.stageIndex,
  };
}
