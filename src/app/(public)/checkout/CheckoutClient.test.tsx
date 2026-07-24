import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import CheckoutClient from "./CheckoutClient";
import { useRFQStore } from "@/store/useRFQStore";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
  }),
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

describe("CheckoutClient Component Tests (TDD & UI Polish)", () => {
  beforeEach(() => {
    mockPush.mockClear();
    useRFQStore.setState({
      isCartOpen: false,
      cartType: "DIRECT",
      items: [
        {
          id: "prod-2",
          productId: "prod-2",
          slug: "centrifuge-mikro-24-slot",
          name: "Centrifuge Mikro 24 Slot",
          image: "/images/centrifuge.jpg",
          price: 15000000,
          qty: 1,
          category: "centrifuge",
          type: "DIRECT",
        },
      ],
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders checkout form, step badges, and Ready Stock guarantee when items exist in DIRECT mode", () => {
    render(<CheckoutClient />);
    expect(screen.getAllByText(/Langkah 1 dari 2/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Informasi Pengiriman & Kontak/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Garansi 100% Produk Original & Ready Stock/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/PPN 11%/i).length).toBeGreaterThan(0);
  });

  it("redirects to /inquiry if cart contains RFQ items instead of DIRECT items", () => {
    useRFQStore.setState({ cartType: "RFQ" });
    render(<CheckoutClient />);
    expect(mockPush).toHaveBeenCalledWith("/inquiry");
  });

  it("renders empty state properly when DIRECT cart is empty", () => {
    useRFQStore.setState({ items: [] });
    render(<CheckoutClient />);
    expect(screen.getAllByText(/Keranjang Anda Kosong/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Belanja Sekarang/i).length).toBeGreaterThan(0);
  });
});
