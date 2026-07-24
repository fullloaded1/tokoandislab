/**
 * Simple in-memory rate limiter using sliding window counters.
 * Suitable for single-instance Vercel serverless functions.
 *
 * Note: In a multi-instance setup (e.g., multiple Vercel regions),
 * consider using Redis-based rate limiting instead.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}

/**
 * Check if a request from the given identifier should be rate-limited.
 *
 * @param identifier - Unique identifier (e.g., IP address)
 * @param maxRequests - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns { limited: boolean, remaining: number, retryAfterMs: number }
 */
export function rateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): { limited: boolean; remaining: number; retryAfterMs: number } {
  cleanup();

  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || entry.resetAt < now) {
    // First request or window expired — start new window
    store.set(identifier, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: maxRequests - 1, retryAfterMs: 0 };
  }

  if (entry.count >= maxRequests) {
    // Rate limited
    return {
      limited: true,
      remaining: 0,
      retryAfterMs: entry.resetAt - now,
    };
  }

  // Within limits
  entry.count++;
  return { limited: false, remaining: maxRequests - entry.count, retryAfterMs: 0 };
}
