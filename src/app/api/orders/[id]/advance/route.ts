import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { prisma, isDatabaseConfigured } from "@/lib/db";

const MAIL_MAX_STAGE = 6;
const DIY_MAX_STAGE = 3;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user?.id || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const maxStage = order.route === "diy" ? DIY_MAX_STAGE : MAIL_MAX_STAGE;
  const stageIndex = Math.min(maxStage, order.stageIndex + 1);

  const updated = await prisma.order.update({
    where: { id },
    data: {
      stageIndex,
      status: stageIndex >= maxStage ? "shipped" : stageIndex >= (order.route === "diy" ? 2 : 5) ? "proof_ready" : "in_progress",
    },
  });

  return NextResponse.json({ order: updated });
}
