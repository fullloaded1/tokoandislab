import { describe, it, expect } from "vitest";
import {
  getAvailable,
  isVariantBuyable,
  getReadyStockSummary,
  type VariantLike,
} from "./readyStock";

const v = (over: Partial<VariantLike>): VariantLike => ({
  id: over.id ?? "v1",
  name: over.name ?? "Default",
  price: over.price ?? 1_000_000,
  stock: over.stock ?? 5,
  reservedStock: over.reservedStock ?? 0,
});

describe("readyStock — getAvailable", () => {
  it("kurangi stock dengan reservedStock", () => {
    expect(getAvailable({ stock: 10, reservedStock: 3 })).toBe(7);
  });

  it("tidak pernah negatif", () => {
    expect(getAvailable({ stock: 5, reservedStock: 8 })).toBe(0);
  });
});

describe("readyStock — isVariantBuyable", () => {
  it("perlu stok > 0 DAN price > 0", () => {
    expect(isVariantBuyable(v({ stock: 5, price: 100_000 }))).toBe(true);
    expect(isVariantBuyable(v({ stock: 0, price: 100_000 }))).toBe(false);
    expect(isVariantBuyable(v({ stock: 5, price: 0 }))).toBe(false);
    expect(isVariantBuyable(v({ stock: 5, reservedStock: 5, price: 100_000 }))).toBe(false);
  });
});

describe("readyStock — getReadyStockSummary", () => {
  it("produk non-ready stock → state rfq", () => {
    const s = getReadyStockSummary({ isReadyStock: false, variants: [v({})] });
    expect(s.state).toBe("rfq");
    expect(s.availableVariants).toEqual([]);
  });

  it("ready stock tanpa varian → state rfq", () => {
    const s = getReadyStockSummary({ isReadyStock: true, variants: [] });
    expect(s.state).toBe("rfq");
  });

  it("ready stock, semua varian habis → state sold_out", () => {
    const s = getReadyStockSummary({
      isReadyStock: true,
      variants: [v({ id: "a", stock: 0 }), v({ id: "b", stock: 2, reservedStock: 2 })],
    });
    expect(s.state).toBe("sold_out");
    expect(s.minPrice).toBe(0);
    expect(s.firstAvailable).toBeNull();
  });

  it("ready stock, satu varian available → state available, no range", () => {
    const s = getReadyStockSummary({
      isReadyStock: true,
      variants: [v({ id: "a", price: 2_500_000, stock: 3 })],
    });
    expect(s.state).toBe("available");
    expect(s.minPrice).toBe(2_500_000);
    expect(s.maxPrice).toBe(2_500_000);
    expect(s.hasPriceRange).toBe(false);
    expect(s.firstAvailable?.id).toBe("a");
  });

  it("multi varian dgn harga berbeda → hasPriceRange + minPrice paling murah", () => {
    const s = getReadyStockSummary({
      isReadyStock: true,
      variants: [
        v({ id: "a", price: 5_000_000, stock: 1 }),
        v({ id: "b", price: 3_000_000, stock: 1 }),
        v({ id: "c", price: 7_000_000, stock: 0 }), // habis, tidak ikut hitung
      ],
    });
    expect(s.state).toBe("available");
    expect(s.minPrice).toBe(3_000_000);
    expect(s.maxPrice).toBe(5_000_000);
    expect(s.hasPriceRange).toBe(true);
    expect(s.availableVariants).toHaveLength(2);
  });

  it("multi varian semua harga sama → tidak ada range walau jumlah > 1", () => {
    const s = getReadyStockSummary({
      isReadyStock: true,
      variants: [
        v({ id: "a", price: 1_500_000, stock: 1 }),
        v({ id: "b", price: 1_500_000, stock: 2 }),
      ],
    });
    expect(s.state).toBe("available");
    expect(s.hasPriceRange).toBe(false);
  });
});
