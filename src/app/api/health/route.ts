import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/db";

export async function GET() {
  return NextResponse.json({
    ok: true,
    database: isDatabaseConfigured(),
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    email: Boolean(process.env.RESEND_API_KEY),
    storage: Boolean(process.env.S3_BUCKET) ? "s3" : "local",
    timestamp: new Date().toISOString(),
  });
}
