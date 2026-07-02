import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { generateOrderNo, orderToClientState } from "@/lib/order-serialization";
import { defaultOrderState } from "@/lib/defaults";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ mode: "demo" });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let order = await prisma.order.findFirst({
    where: {
      userId: session.user.id,
      status: { in: ["draft", "pending_payment", "paid", "in_progress", "proof_ready", "approved"] },
    },
    include: { photos: true },
    orderBy: { updatedAt: "desc" },
  });

  if (!order) {
    order = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderNo: generateOrderNo(),
        upgrades: defaultOrderState.up,
        ship: defaultOrderState.ship,
      },
      include: { photos: true },
    });
  }

  return NextResponse.json({
    mode: "production",
    order: orderToClientState(order, order.photos),
  });
}
