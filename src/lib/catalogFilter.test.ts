import { describe, it, expect } from "vitest";
import {
  getEffectiveProductPrice,
  filterAndSortCatalogProducts,
} from "./catalogFilter";

describe("catalogFilter — getEffectiveProductPrice", () => {
  it("returns null when product is null or undefined", () => {
    expect(getEffectiveProductPrice(null)).toBeNull();
    expect(getEffectiveProductPrice(undefined)).toBeNull();
  });

  it("returns null when isRequestPricing is true even if price exists", () => {
    const product = {
      id: "p-1",
      name: "Spectrophotometer High End",
      price: 150000000,
      isRequestPricing: true,
    };
    expect(getEffectiveProductPrice(product)).toBeNull();
  });

  it("returns price from getReadyStockSummary when variant exists", () => {
    const product = {
      id: "p-2",
      name: "Stirrer Daihan",
      price: 4500000,
      isRequestPricing: false,
      isReadyStock: true,
      variants: [
        { id: "v-1", name: "Standard", price: 3800000, stock: 5, reservedStock: 0 },
        { id: "v-2", name: "Deluxe", price: 5000000, stock: 2, reservedStock: 0 },
      ],
    };
    expect(getEffectiveProductPrice(product)).toBe(3800000);
  });

  it("returns product.price when no variants exist or variants are empty", () => {
    const product = {
      id: "p-3",
      name: "Beaker Pyrex 250ml",
      price: 150000,
      isRequestPricing: false,
      variants: [],
    };
    expect(getEffectiveProductPrice(product)).toBe(150000);
  });
});

describe("catalogFilter — filterAndSortCatalogProducts", () => {
  const mockProducts = [
    {
      id: "p-cheap",
      name: "Pipet 10ml",
      price: 1000000, // 1 Juta
      isRequestPricing: false,
    },
    {
      id: "p-mid",
      name: "Timbangan Analitik Aczet",
      price: 12000000, // 12 Juta
      isRequestPricing: false,
    },
    {
      id: "p-expensive",
      name: "Autoclave Yamato 80L",
      price: 85000000, // 85 Juta
      isRequestPricing: false,
    },
    {
      id: "p-rfq",
      name: "Custom Fume Hood Lab",
      price: 0,
      isRequestPricing: true,
    },
  ];

  it("returns all products when no filter or sort is provided", () => {
    const result = filterAndSortCatalogProducts(mockProducts);
    expect(result).toHaveLength(4);
  });

  it("filters products by minPrice correctly", () => {
    // Only >= 10 Juta
    const result = filterAndSortCatalogProducts(mockProducts, { minPrice: 10000000 });
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.id)).toContain("p-mid");
    expect(result.map((p) => p.id)).toContain("p-expensive");
    expect(result.map((p) => p.id)).not.toContain("p-cheap");
    expect(result.map((p) => p.id)).not.toContain("p-rfq");
  });

  it("filters products by maxPrice correctly", () => {
    // Only <= 15 Juta
    const result = filterAndSortCatalogProducts(mockProducts, { maxPrice: 15000000 });
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.id)).toContain("p-cheap");
    expect(result.map((p) => p.id)).toContain("p-mid");
    expect(result.map((p) => p.id)).not.toContain("p-expensive");
  });

  it("filters products within range minPrice and maxPrice", () => {
    // Between 5 Juta and 50 Juta
    const result = filterAndSortCatalogProducts(mockProducts, {
      minPrice: 5000000,
      maxPrice: 50000000,
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("p-mid");
  });

  it("sorts products by price-asc placing Request Pricing items at the end", () => {
    const result = filterAndSortCatalogProducts(mockProducts, {}, "price-asc");
    expect(result[0].id).toBe("p-cheap");
    expect(result[1].id).toBe("p-mid");
    expect(result[2].id).toBe("p-expensive");
    expect(result[3].id).toBe("p-rfq");
  });

  it("sorts products by price-desc placing Request Pricing items at the end", () => {
    const result = filterAndSortCatalogProducts(mockProducts, {}, "price-desc");
    expect(result[0].id).toBe("p-expensive");
    expect(result[1].id).toBe("p-mid");
    expect(result[2].id).toBe("p-cheap");
    expect(result[3].id).toBe("p-rfq");
  });

  it("sorts products alphabetically by name-asc", () => {
    const result = filterAndSortCatalogProducts(mockProducts, {}, "name-asc");
    expect(result.map((p) => p.name)).toEqual([
      "Autoclave Yamato 80L",
      "Custom Fume Hood Lab",
      "Pipet 10ml",
      "Timbangan Analitik Aczet",
    ]);
  });
});
