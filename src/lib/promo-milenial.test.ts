import { describe, it, expect } from "vitest";
import { Prisma } from "@prisma/client";
import { money } from "./money";
import { calculateBundlePrices, PromoBundleDef } from "./promo-milenial";

describe("Promo Milenial - calculateBundlePrices", () => {
  const mockBundle: PromoBundleDef = {
    id: "test",
    name: "Test Bundle",
    tagline: "Test",
    description: "Test desc",
    discountPercent: 10,
    itemSlugs: ["item-a", "item-b"],
  };

  it("should calculate correct discount and bundle price", () => {
    const products = [
      { slug: "item-a", price: money.toDecimal(100000), isReadyStock: true },
      { slug: "item-b", price: money.toDecimal(50000), isReadyStock: true },
    ];

    const result = calculateBundlePrices(mockBundle, products as any);
    
    expect(result.isValid).toBe(true);
    expect(result.missingItems.length).toBe(0);
    expect(result.soldOutItems.length).toBe(0);
    expect(result.totalNormalPrice.toNumber()).toBe(150000);
    expect(result.discountAmount.toNumber()).toBe(15000); // 10% of 150000
    expect(result.bundlePrice.toNumber()).toBe(135000);
  });

  it("should mark as invalid if an item is missing", () => {
    const products = [
      { slug: "item-a", price: money.toDecimal(100000), isReadyStock: true },
    ];

    const result = calculateBundlePrices(mockBundle, products as any);
    
    expect(result.isValid).toBe(false);
    expect(result.missingItems).toContain("item-b");
    expect(result.totalNormalPrice.toNumber()).toBe(100000); // Only counts available
  });

  it("should mark as invalid if an item is not ready stock", () => {
    const products = [
      { slug: "item-a", price: money.toDecimal(100000), isReadyStock: true },
      { slug: "item-b", price: money.toDecimal(50000), isReadyStock: false },
    ];

    const result = calculateBundlePrices(mockBundle, products as any);
    
    expect(result.isValid).toBe(false);
    expect(result.soldOutItems).toContain("item-b");
  });

  it("should mark as invalid if an item price is 0 (RFQ)", () => {
    const products = [
      { slug: "item-a", price: money.toDecimal(100000), isReadyStock: true },
      { slug: "item-b", price: money.toDecimal(0), isReadyStock: true },
    ];

    const result = calculateBundlePrices(mockBundle, products as any);
    
    expect(result.isValid).toBe(false);
    expect(result.missingItems).toContain("item-b");
  });
});
