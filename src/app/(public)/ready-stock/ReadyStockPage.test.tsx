import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import ReadyStockPage from "./page";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

vi.mock("@/lib/db", () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

describe("ReadyStockPage Component Tests (TDD & UI Polish)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders Hero Trust Card with fast-shipping badges when ready stock products exist", async () => {
    (prisma.product.findMany as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([
      {
        id: "prod-rs-1",
        name: "Inkubator Daihan 105L",
        category: "daihan-labtech",
        isReadyStock: true,
        price: new Prisma.Decimal("32000000"),
        images: ["/images/inkubator.jpg"],
        variants: [
          {
            id: "var-1",
            name: "Default",
            price: new Prisma.Decimal("32000000"),
            stock: 3,
            reservedStock: 0,
            isReadyStock: true,
          },
        ],
      },
    ]);

    const jsx = await ReadyStockPage();
    render(jsx);

    expect(screen.getAllByText(/Pengiriman Instan & PO/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Garansi Resmi Principal 1 Tahun/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Siap Kirim Hari Ini/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Inkubator Daihan 105L/i).length).toBeGreaterThan(0);
  });

  it("renders empty state properly when no ready stock products are available", async () => {
    (prisma.product.findMany as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const jsx = await ReadyStockPage();
    render(jsx);

    expect(screen.getAllByText(/Belum ada produk Ready Stock saat ini/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Lihat Semua Katalog/i).length).toBeGreaterThan(0);
  });
});
