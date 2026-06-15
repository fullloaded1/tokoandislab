import { describe, it, expect } from "vitest";
import { OrderStatus } from "@prisma/client";
import { canTransition, getNextStates, requiresTracking } from "./orderState";

describe("orderState — canTransition (T3.7)", () => {
  it("PAID → PROCESSING boleh", () => {
    expect(canTransition(OrderStatus.PAID, OrderStatus.PROCESSING)).toBe(true);
  });

  it("PROCESSING → SHIPPED boleh", () => {
    expect(canTransition(OrderStatus.PROCESSING, OrderStatus.SHIPPED)).toBe(true);
  });

  it("SHIPPED → COMPLETED boleh", () => {
    expect(canTransition(OrderStatus.SHIPPED, OrderStatus.COMPLETED)).toBe(true);
  });

  it("skip step: PAID → SHIPPED ditolak", () => {
    expect(canTransition(OrderStatus.PAID, OrderStatus.SHIPPED)).toBe(false);
  });

  it("mundur: SHIPPED → PROCESSING ditolak", () => {
    expect(canTransition(OrderStatus.SHIPPED, OrderStatus.PROCESSING)).toBe(false);
  });

  it("CANCELLED & COMPLETED terminal", () => {
    expect(getNextStates(OrderStatus.CANCELLED)).toEqual([]);
    expect(getNextStates(OrderStatus.COMPLETED)).toEqual([]);
  });

  it("CANCEL boleh dari pre-shipment", () => {
    expect(canTransition(OrderStatus.PENDING_PAYMENT, OrderStatus.CANCELLED)).toBe(true);
    expect(canTransition(OrderStatus.PAID, OrderStatus.CANCELLED)).toBe(true);
    expect(canTransition(OrderStatus.PROCESSING, OrderStatus.CANCELLED)).toBe(true);
  });

  it("CANCEL setelah SHIPPED ditolak (sudah jalan ke pembeli)", () => {
    expect(canTransition(OrderStatus.SHIPPED, OrderStatus.CANCELLED)).toBe(false);
  });
});

describe("orderState — requiresTracking", () => {
  it("SHIPPED butuh tracking", () => {
    expect(requiresTracking(OrderStatus.SHIPPED)).toBe(true);
  });
  it("status lain tidak butuh", () => {
    expect(requiresTracking(OrderStatus.PROCESSING)).toBe(false);
    expect(requiresTracking(OrderStatus.COMPLETED)).toBe(false);
    expect(requiresTracking(OrderStatus.CANCELLED)).toBe(false);
  });
});
