import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import DaihanLabtechPage from "./page";
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

describe("DaihanLabtechPage Component Tests (TDD & Brand UI Polish)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders Hero, e-Katalog comparison table, and live category model counts properly", async () => {
    (prisma.product.findMany as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([
      {
        id: "prod-daihan-1",
        name: "Autoclave LAC 60L",
        category: "daihan-labtech",
        subcategory: "Autoclave",
        model: "LAC-0060",
        isReadyStock: true,
        price: new Prisma.Decimal("45000000"),
        images: ["/images/autoclave.jpg"],
        variants: [
          {
            id: "var-1",
            name: "Default",
            price: new Prisma.Decimal("45000000"),
            stock: 2,
            reservedStock: 0,
            isReadyStock: true,
          },
        ],
      },
    ]);

    const jsx = await DaihanLabtechPage();
    render(jsx);

    // Verify header and trust badges
    expect(screen.getAllByText(/Distributor Daihan Labtech Indonesia/i).length).toBeGreaterThan(0);
    
    // Verify e-Katalog comparison table title and columns
    expect(screen.getAllByText(/Bukti Harga: Perbandingan Model-Persis vs e-Katalog/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Harga AndisLab/i).length).toBeGreaterThan(0);
    
    // Verify category cards and live model pill ("model live")
    expect(screen.getAllByText(/Autoclave \/ Sterilizer/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/1 model live/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Mulai Rp 45\.000\.000/i).length).toBeGreaterThan(0);
  });
});
