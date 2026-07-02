import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 });
  }

  const payload = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "paid",
          stageIndex: 1,
          approved: false,
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : undefined,
        },
      });
      const ship = order.ship as { email?: string };
      const user = order.userId
        ? await prisma.user.findUnique({ where: { id: order.userId }, select: { email: true } })
        : null;
      const email = ship.email || user?.email;
      if (email) {
        try {
          await sendOrderConfirmationEmail(email, order.orderNo);
        } catch {
          // non-blocking
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
