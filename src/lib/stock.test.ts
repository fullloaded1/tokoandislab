import { describe, it, expect } from "vitest";
import { OrderStatus } from "@prisma/client";
import { getAvailable, shouldCancelExpiredOrder } from "./stock";

describe("Stock — getAvailable", () => {
  it("tanpa reservasi: stock penuh tersedia", () => {
    expect(getAvailable({ stock: 10, reservedStock: 0 })).toBe(10);
  });

  it("kurangi reservedStock", () => {
    expect(getAvailable({ stock: 10, reservedStock: 3 })).toBe(7);
  });

  it("tidak negatif (anomali stock < reservedStock)", () => {
    expect(getAvailable({ stock: 5, reservedStock: 10 })).toBe(0);
  });
});

describe("Stock — shouldCancelExpiredOrder (T3.6)", () => {
  it("cancel: PENDING_PAYMENT dan tidak ada reservasi tersisa", () => {
    expect(
      shouldCancelExpiredOrder({ status: OrderStatus.PENDING_PAYMENT, reservations: [] })
    ).toBe(true);
  });

  it("jangan cancel: masih ada reservasi aktif", () => {
    expect(
      shouldCancelExpiredOrder({
        status: OrderStatus.PENDING_PAYMENT,
        reservations: [{ id: "r1" }],
      })
    ).toBe(false);
  });

  it("jangan cancel: order sudah PAID", () => {
    expect(
      shouldCancelExpiredOrder({ status: OrderStatus.PAID, reservations: [] })
    ).toBe(false);
  });

  it("jangan cancel: status sudah CANCELLED (idempotent)", () => {
    expect(
      shouldCancelExpiredOrder({ status: OrderStatus.CANCELLED, reservations: [] })
    ).toBe(false);
  });

  it("jangan cancel: order sedang PROCESSING", () => {
    expect(
      shouldCancelExpiredOrder({ status: OrderStatus.PROCESSING, reservations: [] })
    ).toBe(false);
  });
});
