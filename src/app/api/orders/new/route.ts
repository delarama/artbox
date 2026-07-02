import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { generateOrderNo } from "@/lib/order-serialization";
import { defaultOrderState } from "@/lib/defaults";

export async function POST() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      orderNo: generateOrderNo(),
      upgrades: defaultOrderState.up,
      ship: defaultOrderState.ship,
    },
    include: { photos: true },
  });

  return NextResponse.json({ orderId: order.id, orderNo: order.orderNo });
}
