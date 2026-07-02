import { NextResponse } from "next/server";
import { z } from "zod";
import { generateOtpCode, storeOtp } from "@/lib/auth-otp";
import { isDatabaseConfigured } from "@/lib/db";
import { sendOtpEmail } from "@/lib/email";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Sign-in codes require a database connection" }, { status: 503 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const code = generateOtpCode();

  await storeOtp(email, code);

  try {
    const result = await sendOtpEmail(email, code);
    return NextResponse.json({
      ok: true,
      mode: result.mode,
      ...(result.mode === "dev" ? { devCode: code } : {}),
    });
  } catch {
    return NextResponse.json({ error: "Could not send sign-in code" }, { status: 500 });
  }
}
