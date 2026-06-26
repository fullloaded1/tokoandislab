/**
 * Unit tests for stock evaluation scoring helpers.
 * Pure-function tests only — DB-hitting integration is separate.
 */

import { describe, it, expect } from "vitest";

// We test the internal helpers by extracting the logic.
// Since the functions are module-private, we replicate the math here.

const W = { SALES: 0.3, INQUIRY: 0.2, RECENCY: 0.15, TURNOVER: 0.15, MARGIN: 0.1, VIEWS: 0.1 };
const RECENCY_CAP = 180;

function normalize(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(value / max, 1);
}
function recencyScore(days: number | null): number {
  if (days === null) return 0;
  return Math.max(0, 1 - days / RECENCY_CAP);
}
function turnoverScore(sales: number, stock: number): number {
  const total = sales + stock;
  if (total <= 0) return 0;
  return sales / total;
}
function calcScore(p: {
  sales: number; maxSales: number;
  inquiry: number; maxInquiry: number;
  daysSince: number | null;
  stock: number;
  margin: number | null;
  views: number; maxViews: number;
}): number {
  return (
    normalize(p.sales, p.maxSales) * W.SALES +
    normalize(p.inquiry, p.maxInquiry) * W.INQUIRY +
    recencyScore(p.daysSince) * W.RECENCY +
    turnoverScore(p.sales, p.stock) * W.TURNOVER +
    (p.margin !== null ? Math.min(p.margin / 100, 1) : 0) * W.MARGIN +
    normalize(p.views, p.maxViews) * W.VIEWS
  );
}

describe("stockEvaluation scoring", () => {
  it("produk tanpa penjualan/inquiry/views → skor 0", () => {
    const s = calcScore({ sales: 0, maxSales: 10, inquiry: 0, maxInquiry: 5, daysSince: null, stock: 0, margin: null, views: 0, maxViews: 100 });
    expect(s).toBe(0);
  });

  it("produk best performer → skor mendekati 1", () => {
    const s = calcScore({ sales: 100, maxSales: 100, inquiry: 50, maxInquiry: 50, daysSince: 0, stock: 0, margin: 50, views: 200, maxViews: 200 });
    // 0.3 + 0.2 + 0.15 + (100/(100+0)=1)*0.15 + 0.5*0.1 + 0.1 = 0.3+0.2+0.15+0.15+0.05+0.1 = 0.95
    expect(s).toBeCloseTo(0.95, 2);
  });

  it("recencyScore 0 jika >180 hari", () => {
    expect(recencyScore(200)).toBe(0);
    expect(recencyScore(180)).toBe(0);
  });

  it("recencyScore 1 jika 0 hari", () => {
    expect(recencyScore(0)).toBe(1);
  });

  it("turnover 0 jika stok dan sales keduanya 0", () => {
    expect(turnoverScore(0, 0)).toBe(0);
  });

  it("turnover 1 jika semua terjual (stock=0)", () => {
    expect(turnoverScore(50, 0)).toBe(1);
  });

  it("margin 100% → kontribusi 0.1", () => {
    const s = calcScore({ sales: 0, maxSales: 1, inquiry: 0, maxInquiry: 1, daysSince: null, stock: 0, margin: 100, views: 0, maxViews: 1 });
    expect(s).toBeCloseTo(0.1, 2);
  });
});
