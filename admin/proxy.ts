import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_token";

async function verifyAdminToken(token: string) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing in admin app environment");
  }

  const secretKey = new TextEncoder().encode(secret);

  const { payload } = await jwtVerify(token, secretKey);

  if (payload.role !== "admin") {
    throw new Error("Invalid admin role");
  }

  return payload;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isAdminPage = pathname.startsWith("/admin");

  if (!isAdminPage) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (isLoginPage) {
    if (!token) return NextResponse.next();

    try {
      await verifyAdminToken(token);
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } catch {
      const res = NextResponse.next();
      res.cookies.delete(COOKIE_NAME);
      return res;
    }
  }

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    await verifyAdminToken(token);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/admin/login", req.url));
    res.cookies.delete(COOKIE_NAME);
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};