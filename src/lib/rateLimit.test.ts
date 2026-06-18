import { describe, it, expect } from "vitest";
import { rateLimit } from "./rateLimit";

describe("rateLimit", () => {
  it("allows requests within the limit", () => {
    const key = "test-allow-" + Date.now();
    const result = rateLimit(key, 5, 60000);
    expect(result.limited).toBe(false);
    expect(result.remaining).toBe(4);
  });

  it("blocks requests exceeding the limit", () => {
    const key = "test-block-" + Date.now();
    // Exhaust the limit
    for (let i = 0; i < 5; i++) {
      rateLimit(key, 5, 60000);
    }
    // Next request should be blocked
    const result = rateLimit(key, 5, 60000);
    expect(result.limited).toBe(true);
    expect(result.remaining).toBe(0);
    expect(result.retryAfterMs).toBeGreaterThan(0);
  });

  it("resets after window expires", () => {
    const key = "test-reset-" + Date.now();
    // Use a very short window (1ms)
    for (let i = 0; i < 5; i++) {
      rateLimit(key, 5, 1);
    }
    // Wait a tiny bit for window to expire
    const start = Date.now();
    while (Date.now() - start < 5) {
      // busy wait
    }
    const result = rateLimit(key, 5, 1);
    expect(result.limited).toBe(false);
  });

  it("tracks different identifiers separately", () => {
    const keyA = "test-ip-a-" + Date.now();
    const keyB = "test-ip-b-" + Date.now();

    // Exhaust limit for keyA
    for (let i = 0; i < 3; i++) {
      rateLimit(keyA, 3, 60000);
    }
    const resultA = rateLimit(keyA, 3, 60000);
    expect(resultA.limited).toBe(true);

    // keyB should still be allowed
    const resultB = rateLimit(keyB, 3, 60000);
    expect(resultB.limited).toBe(false);
  });
});
