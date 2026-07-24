import { describe, it, expect } from "vitest";
import { generateOrderNo, generateGuestAccessToken } from "./orderCodes";

describe("orderCodes — generateOrderNo", () => {
  it("format ORD-YYMMDD-XXXXXX", () => {
    const no = generateOrderNo(new Date(Date.UTC(2026, 5, 15)));
    expect(no).toMatch(/^ORD-260615-[0-9A-F]{6}$/);
  });

  it("dua panggilan ber-suffix berbeda", () => {
    const a = generateOrderNo();
    const b = generateOrderNo();
    expect(a).not.toBe(b);
  });

  it("100 panggilan tidak tabrakan suffix", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 100; i++) seen.add(generateOrderNo());
    expect(seen.size).toBe(100);
  });
});

describe("orderCodes — generateGuestAccessToken", () => {
  it("panjang minimal 32 char (256-bit base64url)", () => {
    const t = generateGuestAccessToken();
    expect(t.length).toBeGreaterThanOrEqual(32);
  });

  it("hanya char URL-safe (A-Za-z0-9_-)", () => {
    const t = generateGuestAccessToken();
    expect(t).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("dua panggilan menghasilkan token berbeda", () => {
    expect(generateGuestAccessToken()).not.toBe(generateGuestAccessToken());
  });
});
