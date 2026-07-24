import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import ProductCard from "./ProductCard";

describe("ProductCard component tests (TDD & Accessibility)", () => {
  afterEach(() => {
    cleanup();
  });

  const mockProduct = {
    id: "prod-pyrex-1",
    slug: "beaker-glass-pyrex",
    name: "Beaker Glass Pyrex 500ml",
    model: "1000-500",
    brand: "Pyrex",
    category: "alat-gelas",
    categoryLabel: "Alat Gelas",
    price: 250000,
    image: "/images/beaker.jpg",
    isReadyStock: true,
    isRequestPricing: false,
    variantCount: 1,
    variants: [
      {
        id: "var-pyrex-1",
        name: "Standard",
        price: 250000,
        stock: 10,
        reservedStock: 2,
      },
    ],
  };

  it("renders product name and brand clearly in standard mode", () => {
    render(<ProductCard product={mockProduct} compact={false} />);
    expect(screen.getByText(/Beaker Glass Pyrex 500ml/i)).toBeDefined();
    expect(screen.getAllByText(/Pyrex/i).length).toBeGreaterThan(0);
  });

  it("has accessible button with aria-label containing product name in standard mode", () => {
    render(<ProductCard product={mockProduct} compact={false} />);
    const button = screen.getByLabelText(/Beli Sekarang Beaker Glass Pyrex 500ml - 1000-500|Tambah Beaker Glass Pyrex 500ml - 1000-500/i);
    expect(button).toBeDefined();
  });

  it("shows price indicator in compact mode so cards on slider / ready-stock are informative", () => {
    render(<ProductCard product={mockProduct} compact={true} />);
    expect(screen.getAllByText(/Rp 249.700|249.700|Mulai/i).length).toBeGreaterThan(0);
  });
});
