import { createHash, randomInt } from "crypto";
import { prisma } from "@/lib/db";

const OTP_PREFIX = "otp:";
const OTP_TTL_MS = 10 * 60 * 1000;

function hashOtp(email: string, code: string) {
  return createHash("sha256").update(`${email}:${code}`).digest("hex");
}

export function generateOtpCode() {
  return String(randomInt(100000, 1000000));
}

export async function storeOtp(email: string, code: string) {
  const normalized = email.toLowerCase().trim();
  const token = hashOtp(normalized, code);
  const expires = new Date(Date.now() + OTP_TTL_MS);

  await prisma.verificationToken.deleteMany({ where: { identifier: `${OTP_PREFIX}${normalized}` } });
  await prisma.verificationToken.create({
    data: {
      identifier: `${OTP_PREFIX}${normalized}`,
      token,
      expires,
    },
  });
}

export async function verifyOtp(email: string, code: string) {
  const normalized = email.toLowerCase().trim();
  const record = await prisma.verificationToken.findFirst({
    where: {
      identifier: `${OTP_PREFIX}${normalized}`,
      token: hashOtp(normalized, code),
      expires: { gt: new Date() },
    },
  });

  if (!record) return null;

  await prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier: record.identifier,
        token: record.token,
      },
    },
  });

  let user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: normalized,
        emailVerified: new Date(),
      },
    });
  }

  return user;
}
