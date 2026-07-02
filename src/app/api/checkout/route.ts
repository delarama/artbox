import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { getAppUrl, isStripeEnabled } from "@/lib/env";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { getStripe } from "@/lib/stripe";
import { computeCheckout } from "@/lib/pricing";
import type { OrderState } from "@/lib/types";

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const orderId = body.orderId as string | undefined;
  const clientState = body.state as OrderState | undefined;
  if (!orderId || !clientState) {
    return NextResponse.json({ error: "Missing checkout payload" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
    include: { photos: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const totals = computeCheckout({
    ...clientState,
    route: order.route as OrderState["route"],
    photos: order.photos.map((p) => ({ id: p.id, url: p.url, name: p.filename })),
  });

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "pending_payment",
      subtotalCents: Math.round(totals.subtotal * 100),
      taxCents: Math.round(totals.tax * 100),
      totalCents: Math.round(totals.total * 100),
    },
  });

  if (!isStripeEnabled()) {
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: "paid", stageIndex: 1, approved: false },
    });
    const email = clientState.ship.email || session.user.email;
    if (email) {
      try {
        await sendOrderConfirmationEmail(email, updated.orderNo);
      } catch {
        // non-blocking
      }
    }
    return NextResponse.json({ mode: "demo", orderId });
  }

  const stripe = getStripe();
  const appUrl = getAppUrl().replace(/\/$/, "");
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: clientState.ship.email || session.user.email || undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "cad",
          unit_amount: Math.round(totals.total * 100),
          product_data: {
            name: order.route === "diy" ? "ArtBox DIY Keepsake Book" : "ArtBox Mail-in Kit",
            description: `Order ${order.orderNo}`,
          },
        },
      },
    ],
    metadata: {
      orderId,
      userId: session.user.id,
    },
    success_url: `${appUrl}/app/confirmation?orderId=${orderId}`,
    cancel_url: `${appUrl}/app/checkout?orderId=${orderId}`,
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { stripeSessionId: checkoutSession.id },
  });

  return NextResponse.json({
    mode: "stripe",
    url: checkoutSession.url,
    orderId,
  });
}
