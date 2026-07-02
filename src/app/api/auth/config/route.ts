import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/db";

export async function GET() {
  return NextResponse.json({
    database: isDatabaseConfigured(),
    credentials: isDatabaseConfigured(),
    otp: isDatabaseConfigured(),
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    apple: Boolean(process.env.APPLE_ID && process.env.APPLE_SECRET),
  });
}
