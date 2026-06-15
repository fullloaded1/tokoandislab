import { describe, it, expect } from "vitest";
import {
  SHIPPING_REGIONS,
  getShippingFee,
  getShippingRegion,
  isValidShippingRegion,
} from "./shipping";

describe("Shipping helper", () => {
  it("expose dua wilayah dasar", () => {
    const keys = SHIPPING_REGIONS.map((r) => r.key).sort();
    expect(keys).toEqual(["JABODETABEK", "LUAR_JABODETABEK"]);
  });

  it("isValidShippingRegion menerima key valid", () => {
    expect(isValidShippingRegion("JABODETABEK")).toBe(true);
    expect(isValidShippingRegion("LUAR_JABODETABEK")).toBe(true);
  });

  it("isValidShippingRegion menolak key kosong / asing", () => {
    expect(isValidShippingRegion(null)).toBe(false);
    expect(isValidShippingRegion(undefined)).toBe(false);
    expect(isValidShippingRegion("")).toBe(false);
    expect(isValidShippingRegion("BALI")).toBe(false);
  });

  it("getShippingRegion mengembalikan flat rate yang benar", () => {
    expect(getShippingRegion("JABODETABEK")?.flatRate).toBe(50_000);
    expect(getShippingRegion("LUAR_JABODETABEK")?.flatRate).toBe(150_000);
  });

  it("getShippingFee mengembalikan Decimal yang bisa dijumlah lossless", () => {
    const fee = getShippingFee("JABODETABEK");
    expect(fee.toNumber()).toBe(50_000);
    // pastikan bisa diaritmetika tanpa floating point error
    expect(fee.add(150_000).toNumber()).toBe(200_000);
  });

  it("getShippingFee melempar error utk wilayah asing", () => {
    expect(() => getShippingFee("BALI")).toThrow(/tidak dikenal/i);
    expect(() => getShippingFee(null)).toThrow(/tidak dikenal/i);
  });
});
