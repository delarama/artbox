import { getAppUrl } from "./env";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "ArtBox <hello@artbox.ca>";

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info("[email:dev]", { to, subject, html });
      return { ok: true, mode: "dev" as const };
    }
    throw new Error("Email is not configured for production");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(detail || "Failed to send email");
  }

  return { ok: true, mode: "resend" as const };
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${getAppUrl().replace(/\/$/, "")}/app/reset-password?token=${encodeURIComponent(token)}`;
  return sendEmail({
    to: email,
    subject: "Reset your ArtBox password",
    html: `<p>Hi,</p><p><a href="${url}">Reset your password</a></p><p>This link expires in 1 hour.</p>`,
  });
}

export async function sendOrderConfirmationEmail(email: string, orderNo: string) {
  const url = `${getAppUrl().replace(/\/$/, "")}/app/track`;
  return sendEmail({
    to: email,
    subject: `ArtBox order confirmed — ${orderNo}`,
    html: `<p>Thanks for your order <strong>${orderNo}</strong>.</p><p><a href="${url}">Track your order</a></p>`,
  });
}

export async function sendOtpEmail(email: string, code: string) {
  return sendEmail({
    to: email,
    subject: "Your ArtBox sign-in code",
    html: `<p>Your sign-in code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:0.2em">${code}</p><p>This code expires in 10 minutes.</p>`,
  });
}
