import { describe, it, expect } from "vitest";
import { calculatePromoMerdekaPrice, buildPromoMerdekaPdfBytes } from "./promoMerdekaPdf";
import { Prisma } from "@prisma/client";

describe("promoMerdekaPdf utility", () => {
  it("calculates 17% discount for products under Rp 20 million", () => {
    const price = new Prisma.Decimal("10000000"); // 10 Juta
    const result = calculatePromoMerdekaPrice(price);

    expect(result.hargaNormal).toBe(10000000);
    expect(result.isBelowThreshold).toBe(true);
    // 10 Juta * 0.83 = 8300000
    expect(result.hargaPromo).toBe(8300000);
    expect(result.hemat).toBe(1700000);
  });

  it("applies free consumables bundling for products at or above Rp 20 million", () => {
    const price = new Prisma.Decimal("32000000"); // 32 Juta
    const result = calculatePromoMerdekaPrice(price);

    expect(result.hargaNormal).toBe(32000000);
    expect(result.isBelowThreshold).toBe(false);
    expect(result.hargaPromo).toBeNull();
    expect(result.hemat).toBeNull();
  });

  it("generates non-empty PDF bytes for a mixed list of promo products", () => {
    const dummyProducts = [
      {
        id: "1",
        name: "pH Meter Milwaukee PRO",
        brand: "Milwaukee",
        categoryLabel: "Alat Pengukur",
        price: new Prisma.Decimal("5500000"),
        isReadyStock: true,
      },
      {
        id: "2",
        name: "Turbidity Meter Lovibond TB 210 IR",
        brand: "Lovibond",
        categoryLabel: "Kualitas Air",
        price: new Prisma.Decimal("32000000"),
        isReadyStock: true,
      },
    ];

    const pdfBytes = buildPromoMerdekaPdfBytes(dummyProducts);
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(500); // verify PDF header & structure generated
  });
});
