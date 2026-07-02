import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { clientStateToOrderPatch } from "@/lib/order-serialization";
import { computeCheckout } from "@/lib/pricing";
import type { OrderState } from "@/lib/types";

const patchSchema = z.object({
  route: z.enum(["mail", "diy"]).nullable().optional(),
  qty: z.number().int().min(1).max(9).optional(),
  returnArt: z.boolean().optional(),
  upgrades: z.record(z.string(), z.boolean()).optional(),
  speed: z.enum(["standard", "rush", "superRush"]).optional(),
  diyFormat: z.enum(["soft", "hard", "xl"]).optional(),
  promoCode: z.string().optional(),
  promoApplied: z.boolean().optional(),
  ship: z.record(z.string(), z.string()).optional(),
  approved: z.boolean().optional(),
  stageIndex: z.number().int().min(0).max(10).optional(),
});

async function getOwnedOrder(orderId: string, userId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { photos: true },
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await getOwnedOrder(id, session.user.id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order update" }, { status: 400 });
  }

  const patch = parsed.data;
  const updated = await prisma.order.update({
    where: { id },
    data: {
      route: patch.route === null ? null : patch.route,
      qty: patch.qty,
      returnArt: patch.returnArt,
      upgrades: patch.upgrades,
      speed: patch.speed,
      diyFormat: patch.diyFormat,
      promoCode: patch.promoCode,
      promoApplied: patch.promoApplied,
      ship: patch.ship,
      approved: patch.approved,
      stageIndex: patch.stageIndex,
    },
    include: { photos: true },
  });

  return NextResponse.json({ order: updated });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await getOwnedOrder(id, session.user.id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const clientState = body as OrderState;
  const totals = computeCheckout({
    ...clientState,
    route: order.route as OrderState["route"],
    photos: order.photos.map((p) => ({ id: p.id, url: p.url, name: p.filename })),
  });

  const updated = await prisma.order.update({
    where: { id },
    data: {
      ...clientStateToOrderPatch(clientState),
      status: "paid",
      stageIndex: 1,
      approved: false,
      subtotalCents: Math.round(totals.subtotal * 100),
      taxCents: Math.round(totals.tax * 100),
      totalCents: Math.round(totals.total * 100),
    },
  });

  return NextResponse.json({ order: updated });
}
