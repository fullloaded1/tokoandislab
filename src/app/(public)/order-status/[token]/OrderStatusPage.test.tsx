import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import OrderStatusPage from "./page";
import { prisma } from "@/lib/db";
import { Prisma, OrderStatus } from "@prisma/client";

vi.mock("@/lib/db", () => ({
  prisma: {
    order: {
      findUnique: vi.fn(),
    },
  },
}));

describe("OrderStatusPage Component Tests (TDD & Institutional Tracking UI)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders 5-step Progress Timeline Bar, order status badges, and item calculations properly for valid token", async () => {
    (prisma.order.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "ord-1",
      orderNo: "PO-ANDIS-2026-001",
      guestAccessToken: "valid-token-123",
      status: OrderStatus.PROCESSING,
      createdAt: new Date("2026-07-13T08:00:00Z"),
      subtotal: new Prisma.Decimal("15000000"),
      taxAmount: new Prisma.Decimal("1650000"),
      shippingFee: new Prisma.Decimal("100000"),
      totalAmount: new Prisma.Decimal("16750000"),
      shippingAddress: "RSUD Cibinong\nJl. KSR Dadi Kusmayadi No.27, Bogor",
      trackingNumber: "JNE-TRACK-999",
      customer: {
        name: "Dr. Budi Santoso",
        email: "budi.s@rsudcibinong.go.id",
        phone: "08123456789",
      },
      items: [
        {
          id: "item-1",
          name: "Centrifuge Mikro 24 Slot",
          price: new Prisma.Decimal("15000000"),
          quantity: 1,
        },
      ],
    });

    const jsx = await OrderStatusPage({ params: Promise.resolve({ token: "valid-token-123" }) });
    render(jsx);

    // Verify header & progress timeline
    expect(screen.getAllByText(/Status & Pelacakan Pesanan Resmi/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/PO-ANDIS-2026-001/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Alur Pengadaan & Pengiriman/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Pesanan Dibuat/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Diproses \/ SPJ/i).length).toBeGreaterThan(0);
    
    // Verify status alert box & tracking number
    expect(screen.getAllByText(/Sedang Diproses/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/JNE-TRACK-999/i).length).toBeGreaterThan(0);

    // Verify institutional customer & totals
    expect(screen.getAllByText(/Dr\. Budi Santoso/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Unduh Invoice Komersial/i).length).toBeGreaterThan(0);
  });

  it("renders expired notice when guest access token is expired", async () => {
    (prisma.order.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "ord-2",
      orderNo: "PO-ANDIS-OLD",
      guestAccessToken: "expired-token",
      status: OrderStatus.COMPLETED,
      guestAccessTokenExpiresAt: new Date("2025-01-01T00:00:00Z"),
    });

    const jsx = await OrderStatusPage({ params: Promise.resolve({ token: "expired-token" }) });
    render(jsx);

    expect(screen.getAllByText(/Link Kedaluwarsa/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/melewati batas waktu yang diizinkan/i).length).toBeGreaterThan(0);
  });
});
