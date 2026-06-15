import { randomBytes } from "crypto";

/**
 * Generate orderNo race-safe: ORD-YYMMDD-XXXXXX (6 hex acak).
 * Tabrakan amat sangat tidak mungkin (16M kombinasi per hari), dan @unique
 * di DB tetap menjadi guard akhir bila terjadi.
 */
export function generateOrderNo(now: Date = new Date()): string {
  const yy = String(now.getUTCFullYear()).slice(-2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const rand = randomBytes(3).toString("hex").toUpperCase();
  return `ORD-${yy}${mm}${dd}-${rand}`;
}

/**
 * Token akses status order untuk pembeli guest (K2). 256-bit, URL-safe base64.
 */
export function generateGuestAccessToken(): string {
  return randomBytes(32).toString("base64url");
}
