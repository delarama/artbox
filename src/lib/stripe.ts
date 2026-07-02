import Stripe from "stripe";
import { isStripeEnabled } from "@/lib/env";

export function getStripe() {
  if (!isStripeEnabled()) {
    throw new Error("Stripe is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-06-24.dahlia",
  });
}
