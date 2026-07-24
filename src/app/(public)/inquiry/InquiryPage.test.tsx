import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import InquiryPage from "./page";
import { useRFQStore } from "@/store/useRFQStore";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

describe("InquiryPage Component Tests (TDD & UI Polish)", () => {
  beforeEach(() => {
    useRFQStore.setState({
      isCartOpen: false,
      cartType: "RFQ",
      items: [
        {
          id: "prod-1",
          productId: "prod-1",
          slug: "autoclave-daihan-60l",
          name: "Autoclave Daihan 60L",
          image: "/images/autoclave.jpg",
          price: 45000000,
          qty: 2,
          category: "daihan-labtech",
          type: "RFQ",
        },
      ],
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders step headers and SLA guarantee box when RFQ items exist", () => {
    render(<InquiryPage />);
    expect(screen.getAllByText(/Langkah 1 dari 2/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Detail Instansi \/ Perusahaan/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Garansi Layanan & SPJ Resmi/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/1x24 jam kerja/i).length).toBeGreaterThan(0);
  });

  it("renders empty state properly when RFQ cart is empty", () => {
    useRFQStore.setState({ items: [] });
    render(<InquiryPage />);
    expect(screen.getAllByText(/Keranjang RFQ Kosong/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Jelajahi Katalog/i).length).toBeGreaterThan(0);
  });
});
