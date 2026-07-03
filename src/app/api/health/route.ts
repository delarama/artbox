import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/db";
import { getStorageMode, isStripeEnabled } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    ok: true,
    database: isDatabaseConfigured(),
    stripe: isStripeEnabled(),
    email: Boolean(process.env.RESEND_API_KEY),
    storage: getStorageMode(),
    timestamp: new Date().toISOString(),
  });
}
