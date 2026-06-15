import { describe, it, expect, beforeEach } from "vitest";
import { useRFQStore } from "./useRFQStore";

const baseItem = {
  id: "p1",
  productId: "p1",
  slug: "p1",
  name: "Produk Uji",
  image: "",
  category: "Kategori",
  price: 1_000_000,
} as const;

describe("useRFQStore — pemisahan RFQ vs DIRECT", () => {
  beforeEach(() => {
    useRFQStore.getState().clearCart();
  });

  it("item pertama mengunci cartType", () => {
    const res = useRFQStore.getState().addItem({ ...baseItem, type: "RFQ" });
    expect(res.success).toBe(true);
    expect(useRFQStore.getState().cartType).toBe("RFQ");
  });

  it("tipe sama bisa ditambah, qty bertambah utk id yg sama", () => {
    useRFQStore.getState().addItem({ ...baseItem, type: "DIRECT" });
    const res = useRFQStore.getState().addItem({ ...baseItem, type: "DIRECT" });
    expect(res.success).toBe(true);
    const items = useRFQStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].qty).toBe(2);
  });

  it("tipe beda → ditolak dgn pesan panduan", () => {
    useRFQStore.getState().addItem({ ...baseItem, type: "RFQ" });
    const res = useRFQStore.getState().addItem({
      ...baseItem,
      id: "p2",
      productId: "p2",
      type: "DIRECT",
    });
    expect(res.success).toBe(false);
    expect(res.error).toMatch(/Permintaan Penawaran|RFQ/i);
    expect(useRFQStore.getState().items).toHaveLength(1);
    expect(useRFQStore.getState().cartType).toBe("RFQ");
  });

  it("removeItem terakhir mereset cartType jadi null", () => {
    useRFQStore.getState().addItem({ ...baseItem, type: "DIRECT" });
    useRFQStore.getState().removeItem(baseItem.id);
    expect(useRFQStore.getState().items).toHaveLength(0);
    expect(useRFQStore.getState().cartType).toBeNull();
  });

  it("clearCart mereset cartType + items", () => {
    useRFQStore.getState().addItem({ ...baseItem, type: "RFQ" });
    useRFQStore.getState().clearCart();
    expect(useRFQStore.getState().items).toEqual([]);
    expect(useRFQStore.getState().cartType).toBeNull();
  });

  it("setelah clearCart, boleh ganti ke tipe lain", () => {
    useRFQStore.getState().addItem({ ...baseItem, type: "RFQ" });
    useRFQStore.getState().clearCart();
    const res = useRFQStore.getState().addItem({ ...baseItem, type: "DIRECT" });
    expect(res.success).toBe(true);
    expect(useRFQStore.getState().cartType).toBe("DIRECT");
  });

  it("totalPrice & totalItems hitung benar utk DIRECT cart", () => {
    useRFQStore.getState().addItem({ ...baseItem, type: "DIRECT" });
    useRFQStore.getState().addItem({ ...baseItem, type: "DIRECT" });
    useRFQStore.getState().addItem({
      ...baseItem,
      id: "p2",
      productId: "p2",
      price: 500_000,
      type: "DIRECT",
    });
    expect(useRFQStore.getState().totalItems()).toBe(3);
    expect(useRFQStore.getState().totalPrice()).toBe(2_500_000);
  });
});
