import { describe, it, expect } from "vitest";
import { Prisma } from "@prisma/client";
import {
  calculateTotals,
  simulateCustomerBid,
  maximizeBudget,
} from "./negotiationEngine";
import { getMarginZone } from "./marginPolicy";
import { PromoCalculatorProduct, SelectedItem } from "./types";

const mockProducts: PromoCalculatorProduct[] = [
  {
    code: "A-01",
    tier: "A",
    name: "pH Meter Benchtop Laboratorium",
    brand: "Standar",
    model: "PH Benchtop",
    price: 12500000,
    cost: 10000000, // 25% markup (10jt -> 12.5jt, profit 2.5jt = 20% margin)
    stock: 5,
    unit: "Unit",
    category: "Smart Budget",
  },
  {
    code: "B-01",
    tier: "B",
    name: "Autoclave Vertical 45L",
    brand: "Daihan Labtech",
    model: "LAC-1045SV",
    price: 40000000,
    cost: 30000000, // profit 10jt = 25% margin
    stock: 2,
    unit: "Unit",
    category: "Core Instruments",
  },
];

describe("negotiationEngine test suite", () => {
  it("should accurately calculate catalog total and procurement cost with Decimal", () => {
    const items: SelectedItem[] = [
      { product: mockProducts[0], qty: 2 }, // 25,000,000 catalog, 20,000,000 cost
      { product: mockProducts[1], qty: 1 }, // 40,000,000 catalog, 30,000,000 cost
    ];

    const { catalogTotal, totalCost } = calculateTotals(items);
    expect(catalogTotal.toString()).toBe("65000000");
    expect(totalCost.toString()).toBe("50000000");
  });

  it("should classify margin zones correctly (Target >=25%, Win Mode 15-24.9%, Attention <15%, Overcost <0%)", () => {
    const cost = new Prisma.Decimal("10000000");
    expect(getMarginZone(new Prisma.Decimal("28"), cost)).toBe("target");
    expect(getMarginZone(new Prisma.Decimal("25"), cost)).toBe("target");
    expect(getMarginZone(new Prisma.Decimal("20"), cost)).toBe("win_mode");
    expect(getMarginZone(new Prisma.Decimal("15"), cost)).toBe("win_mode");
    expect(getMarginZone(new Prisma.Decimal("10"), cost)).toBe("attention");
    expect(getMarginZone(new Prisma.Decimal("-5"), cost)).toBe("overcost");
  });

  it("should simulate customer bid, calculating profit, margin, and counter-bid accurately", () => {
    const items: SelectedItem[] = [
      { product: mockProducts[1], qty: 1 }, // Catalog 40,000,000, Cost 30,000,000
    ];

    // Case 1: Customer bids 40,000,000 (Margin = 10jt / 40jt = 25%) => TARGET IDEAL
    const resTarget = simulateCustomerBid(items, 40000000);
    expect(resTarget.zone).toBe("target");
    expect(resTarget.projectMarginPercent).toBe(25);
    expect(resTarget.discountPercent).toBe(0);

    // Case 2: Customer asks for discount to 36,000,000 (Margin = 6jt / 36jt = 16.7%) => WIN_MODE
    const resWin = simulateCustomerBid(items, 36000000);
    expect(resWin.zone).toBe("win_mode");
    expect(resWin.projectMarginPercent).toBe(16.7);
    expect(resWin.discountPercent).toBe(10);
    expect(resWin.suggestedTerms).toContain("DP 50%");

    // Case 3: Customer bids 32,000,000 (Margin = 2jt / 32jt = 6.3%) => ATTENTION
    const resAttention = simulateCustomerBid(items, 32000000);
    expect(resAttention.zone).toBe("attention");
    expect(resAttention.suggestedCounterBid).toBe("40000000"); // 30jt / 0.75 = 40jt

    // Case 4: Customer bids 28,000,000 (Below cost 30,000,000) => OVERCOST
    const resOvercost = simulateCustomerBid(items, 28000000);
    expect(resOvercost.zone).toBe("overcost");
    expect(resOvercost.statusHeadline).not.toContain("Modal");
    expect(resTarget.statusHeadline).not.toContain("25%");
  });

  it("should maximize budget without exceeding target limit", () => {
    const budget = 50000000;
    const res = maximizeBudget(budget, mockProducts);

    const totalNum = Number(res.totalAbsorbed);
    expect(totalNum).toBeLessThanOrEqual(budget);
    expect(res.selectedItems.length).toBeGreaterThan(0);
    expect(Number(res.remainingBudget) + totalNum).toBe(budget);
  });
});
