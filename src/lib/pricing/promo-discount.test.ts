import { describe, it, expect } from "vitest";
import { resolvePromoPrice, calculateFloorPrice } from "./promo-discount";

describe("Promo Discount Resolution Engine (resolvePromoPrice)", () => {
  it("returns status 'review' and no discount if modal/cost is missing or <= 0", () => {
    const resNull = resolvePromoPrice({ normalPrice: 10000000, cost: null });
    expect(resNull.status).toBe("review");
    expect(resNull.promoPrice).toBeNull();
    expect(resNull.discountPct).toBe(0);
    expect(resNull.zone).toBe("missing_cost");

    const resZero = resolvePromoPrice({ normalPrice: 10000000, cost: 0 });
    expect(resZero.status).toBe("review");
    expect(resZero.promoPrice).toBeNull();
    expect(resZero.discountPct).toBe(0);
    expect(resZero.zone).toBe("missing_cost");
  });

  it("checks non-bundle with normal Rp 10.000.000 and cost Rp 6.500.000 -> 10% discount", () => {
    const res = resolvePromoPrice({ normalPrice: 10000000, cost: 6500000, isBundle: false });
    // Normal 10jt, 10% discount -> promoPrice 9.000.000
    // Margin = (9.000.000 - 6.500.000) / 9.000.000 = 27.78% (>= 25% target zone)
    expect(res.promoPrice).toBe(9000000);
    expect(res.discountPct).toBe(10);
    expect(res.zone).toBe("target");
    expect(res.status).toBe("publish");
  });

  it("rejects 15% discount for bundle when resulting zone is win_mode (not target) and falls back to 10%", () => {
    // Normal 10jt, cost 6.5jt.
    // If 15% discount -> price 8.5jt. Margin = (8.5 - 6.5)/8.5 = 23.53% (win_mode, not target >= 25%).
    // Rule: win_mode is rejected for 15% bundle, falls back to 10%!
    // With 10% discount -> price 9jt. Margin = 27.78% (target).
    const res = resolvePromoPrice({ normalPrice: 10000000, cost: 6500000, isBundle: true });
    expect(res.discountPct).toBe(10);
    expect(res.promoPrice).toBe(9000000);
    expect(res.status).toBe("publish");
  });

  it("accepts 15% discount for bundle when margin is high (low cost) and zone is target", () => {
    // Normal 10jt, cost 5jt.
    // 15% discount -> price 8.5jt. Margin = (8.5 - 5)/8.5 = 41.18% (target >= 25%).
    const res = resolvePromoPrice({ normalPrice: 10000000, cost: 5000000, isBundle: true });
    expect(res.discountPct).toBe(15);
    expect(res.promoPrice).toBe(8500000);
    expect(res.zone).toBe("target");
    expect(res.status).toBe("publish");
  });

  it("rejects 10% discount and flags status 'review' when margin is low (attention or overcost)", () => {
    // Normal 10jt, cost 8.5jt.
    // 10% discount -> price 9jt. Margin = (9 - 8.5)/9 = 5.56% (attention < 15%).
    const res = resolvePromoPrice({ normalPrice: 10000000, cost: 8500000, isBundle: false });
    expect(res.status).toBe("review");
    expect(res.promoPrice).toBeNull();
    expect(res.discountPct).toBe(0);
    expect(res.zone).toBe("attention");
  });

  it("rounds down to thousand: Rp 18.731.250 x 0.90 -> Rp 16.858.000", () => {
    const rounded = calculateFloorPrice(18731250, 10);
    // 18.731.250 * 0.90 = 16.858.125 -> floor to 1000 is 16.858.000
    expect(rounded).toBe(16858000);
  });
});
