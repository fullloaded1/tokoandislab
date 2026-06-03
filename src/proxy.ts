import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

async function verifySessionCookie(sessionValue: string) {
  try {
    const { payload } = await jwtVerify(sessionValue, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Only protect /admin routes
  if (!path.startsWith("/admin")) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get("session")?.value;
  const session = sessionCookie ? await verifySessionCookie(sessionCookie) : null;

  // If going to login page and already authenticated, redirect to admin dashboard
  if (path === "/admin/login" && session?.username) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  // If going to admin pages (not login) and NOT authenticated, redirect to login
  if (path !== "/admin/login" && !session?.username) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
