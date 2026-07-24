import { describe, it, expect } from "vitest";
import { Prisma } from "@prisma/client";
import { calculateOrderTotals } from "./orderTotals";

describe("calculateOrderTotals — invariant subtotal+tax+shipping==total", () => {
  const cases = [
    {
      name: "single item, single qty, PPN 11%, ongkir 50k",
      items: [{ price: 1_000_000, quantity: 1 }],
      tax: 11,
      ship: 50_000,
      expSub: 1_000_000,
      expTax: 110_000,
      expTotal: 1_160_000,
    },
    {
      name: "multi item beda harga, PPN 11%, ongkir 150k",
      items: [
        { price: 2_500_000, quantity: 2 },
        { price: 750_000, quantity: 3 },
      ],
      tax: 11,
      ship: 150_000,
      expSub: 7_250_000,
      expTax: 797_500,
      expTotal: 8_197_500,
    },
    {
      name: "harga dgn 2 desimal (Decimal precision)",
      items: [
        { price: new Prisma.Decimal("100.50"), quantity: 4 },
      ],
      tax: 11,
      ship: 0,
      expSub: 402,
      expTax: 44.22,
      expTotal: 446.22,
    },
    {
      name: "PPN 0% (mis. produk dikecualikan)",
      items: [{ price: 500_000, quantity: 2 }],
      tax: 0,
      ship: 25_000,
      expSub: 1_000_000,
      expTax: 0,
      expTotal: 1_025_000,
    },
    {
      name: "pembulatan: 333 × 3, PPN 11% = 109.89 (Decimal exact)",
      items: [{ price: 333, quantity: 3 }],
      tax: 11,
      ship: 0,
      expSub: 999,
      expTax: 109.89,
      expTotal: 1108.89,
    },
    {
      name: "nominal besar (puluhan juta)",
      items: [{ price: 35_000_000, quantity: 2 }],
      tax: 11,
      ship: 150_000,
      expSub: 70_000_000,
      expTax: 7_700_000,
      expTotal: 77_850_000,
    },
  ];

  for (const c of cases) {
    it(c.name, () => {
      const r = calculateOrderTotals(c.items, c.tax, c.ship);
      expect(r.subtotal.toNumber()).toBe(c.expSub);
      expect(r.taxAmount.toNumber()).toBe(c.expTax);
      expect(r.shippingFee.toNumber()).toBe(c.ship);
      expect(r.totalAmount.toNumber()).toBe(c.expTotal);
      // Invariant: lossless add
      expect(r.subtotal.add(r.taxAmount).add(r.shippingFee).equals(r.totalAmount)).toBe(true);
    });
  }

  it("items kosong → semua 0 + ongkir saja", () => {
    const r = calculateOrderTotals([], 11, 50_000);
    expect(r.subtotal.toNumber()).toBe(0);
    expect(r.taxAmount.toNumber()).toBe(0);
    expect(r.totalAmount.toNumber()).toBe(50_000);
  });

  it("anti-float: 0.1 + 0.2 tidak rusak (vs JS = 0.30000000000000004)", () => {
    const r = calculateOrderTotals(
      [
        { price: new Prisma.Decimal("0.1"), quantity: 1 },
        { price: new Prisma.Decimal("0.2"), quantity: 1 },
      ],
      0,
      0
    );
    expect(r.subtotal.toString()).toBe("0.3");
  });
});
