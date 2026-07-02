import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = [
  "/app/choose",
  "/app/order",
  "/app/checkout",
  "/app/confirmation",
  "/app/account",
  "/app/book",
  "/app/track",
];

export async function middleware(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.next();
  }

  const path = request.nextUrl.pathname;
  const isProtected = protectedPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
  if (!isProtected) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/app/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
