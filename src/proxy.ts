import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { rateLimit } from "./lib/rateLimit";

/**
 * Next.js 16 Proxy (formerly middleware).
 * 
 * Defense-in-depth layer:
 * 1. Guard /admin/* pages (except /admin/login) — verify session cookie
 * 2. Rate limit /api/chat and /api/rfq to prevent spam/abuse
 * 
 * NOTE: This is a SECOND layer. Each server action still calls requireAdmin()
 * independently. The proxy cannot fully protect server actions (they are POST
 * requests to the page route), so per-action auth is the primary defense.
 */

const SESSION_SECRET = process.env.SESSION_SECRET;

async function isValidSession(request: NextRequest): Promise<boolean> {
  if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
    return false;
  }

  const sessionCookie = request.cookies.get("session")?.value;
  if (!sessionCookie) {
    return false;
  }

  try {
    const encodedKey = new TextEncoder().encode(SESSION_SECRET);
    const { payload } = await jwtVerify(sessionCookie, encodedKey, {
      algorithms: ["HS256"],
    });
    return !!payload?.username;
  } catch {
    return false;
  }
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- 1. Admin route protection ---
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const valid = await isValidSession(request);
    if (!valid) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // --- 2. Rate limiting for public API routes ---
  if (pathname === "/api/chat" || pathname === "/api/rfq") {
    const ip = getClientIP(request);
    const windowMs = 60 * 1000; // 1 minute window

    // /api/chat: 20 requests per minute per IP
    // /api/rfq:  10 requests per minute per IP
    const maxRequests = pathname === "/api/chat" ? 20 : 10;
    const key = `${pathname}:${ip}`;

    const result = rateLimit(key, maxRequests, windowMs);
    if (result.limited) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Coba lagi nanti." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil(result.retryAfterMs / 1000)),
          },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/chat", "/api/rfq"],
};
