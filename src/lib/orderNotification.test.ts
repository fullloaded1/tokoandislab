import { describe, it, expect } from "vitest";
import { buildOrderStatusUrl, buildOrderMessage } from "./orderNotification";

describe("orderNotification — buildOrderStatusUrl", () => {
  it("gabung base + token", () => {
    const url = buildOrderStatusUrl("abc123");
    expect(url).toMatch(/\/order-status\/abc123$/);
  });
});

describe("orderNotification — buildOrderMessage", () => {
  const ctx = {
    customerName: "Budi",
    orderNo: "ORD-260615-A1B2C3",
    total: "Rp 1.500.000",
    statusUrl: "https://www.andislab.com/order-status/tkn",
  };

  it("CREATED memuat orderNo, total, link status", () => {
    const m = buildOrderMessage("CREATED", ctx);
    expect(m).toContain("Budi");
    expect(m).toContain("ORD-260615-A1B2C3");
    expect(m).toContain("Rp 1.500.000");
    expect(m).toContain("https://www.andislab.com/order-status/tkn");
    expect(m.toLowerCase()).toContain("menunggu pembayaran");
  });

  it("PAID berbicara tentang konfirmasi bayar", () => {
    const m = buildOrderMessage("PAID", ctx);
    expect(m).toContain("pembayaran");
    expect(m).toContain(ctx.statusUrl);
  });

  it("SHIPPED berbicara tentang dikirim", () => {
    const m = buildOrderMessage("SHIPPED", ctx);
    expect(m.toLowerCase()).toContain("dikirim");
  });

  it("CANCELLED berbicara tentang dibatalkan", () => {
    const m = buildOrderMessage("CANCELLED", ctx);
    expect(m.toLowerCase()).toContain("dibatalkan");
  });

  it("setiap varian selalu sertakan statusUrl (untuk guest)", () => {
    const kinds = ["CREATED", "PAID", "SHIPPED", "CANCELLED"] as const;
    for (const k of kinds) {
      expect(buildOrderMessage(k, ctx)).toContain(ctx.statusUrl);
    }
  });
});
