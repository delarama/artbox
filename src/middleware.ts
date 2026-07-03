import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

const protectedPrefixes = [
  "/app/choose",
  "/app/order",
  "/app/checkout",
  "/app/confirmation",
  "/app/account",
  "/app/book",
  "/app/track",
];

export default auth((request) => {
  if (!process.env.DATABASE_URL) {
    return NextResponse.next();
  }

  const path = request.nextUrl.pathname;
  const isProtected = protectedPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
  if (!isProtected) {
    return NextResponse.next();
  }

  if (!request.auth) {
    const loginUrl = new URL("/app/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/app/:path*"],
};
