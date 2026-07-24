/**
 * Stock Evaluation Scoring Engine
 *
 * Menghitung skor performa produk ready stock untuk rolling bulanan.
 * Skor rendah = kandidat retire, skor tinggi = produk bagus.
 *
 * 6 faktor:
 *   salesCount     (30%) — unit terjual dalam periode
 *   inquiryCount   (20%) — inquiry masuk
 *   recency        (15%) — hari sejak terakhir terjual
 *   turnover       (15%) — rasio terjual vs sisa stok
 *   marginPercent  (10%) — gross margin %
 *   pageViews      (10%) — views halaman produk
 */

import Decimal from "decimal.js";
import { prisma } from "./db";

// ── Scoring Weights ──────────────────────────────────────────────
const W = {
  SALES: 0.3,
  INQUIRY: 0.2,
  RECENCY: 0.15,
  TURNOVER: 0.15,
  MARGIN: 0.1,
  VIEWS: 0.1,
} as const;

const RECENCY_CAP_DAYS = 180; // >180 hari tanpa jual → recency skor 0

// ── Types ────────────────────────────────────────────────────────
export interface ProductScore {
  productId: string;
  productName: string;
  productBrand: string;
  productModel: string;
  salesCount: number;
  inquiryCount: number;
  pageViews: number;
  currentStock: number;
  daysSinceLastSale: number | null;
  marginPercent: number | null;
  score: string; // Decimal string
}

// ── Core scoring ─────────────────────────────────────────────────
function normalize(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(value / max, 1);
}

function recencyScore(daysSinceLastSale: number | null): number {
  if (daysSinceLastSale === null) return 0; // never sold
  return Math.max(0, 1 - daysSinceLastSale / RECENCY_CAP_DAYS);
}

function turnoverScore(sales: number, stock: number): number {
  const total = sales + stock;
  if (total <= 0) return 0;
  return sales / total;
}

/**
 * Hitung skor semua produk ready stock.
 * @param monthsBack jumlah bulan ke belakang untuk data penjualan/inquiry
 */
export async function calculateProductScores(
  monthsBack = 3
): Promise<ProductScore[]> {
  const since = new Date();
  since.setMonth(since.getMonth() - monthsBack);

  // 1. Ambil semua produk ready stock beserta variant ids
  const products = await prisma.product.findMany({
    where: { isReadyStock: true },
    select: {
      id: true,
      name: true,
      brand: true,
      model: true,
      price: true,
      costPrice: true,
      pageViews: true,
      variants: {
        select: {
          id: true,
          stock: true,
          reservedStock: true,
        },
      },
    },
  });

  if (products.length === 0) return [];

  // 2. Hitung sales per product via OrderItem → variant → product
  const variantIdToProductId = new Map<string, string>();
  for (const p of products) {
    for (const v of p.variants) {
      variantIdToProductId.set(v.id, p.id);
    }
  }

  const allVariantIds = Array.from(variantIdToProductId.keys());

  // Sales query — orders yang sudah PAID / COMPLETED / SHIPPED / PROCESSING
  const salesRows = await prisma.orderItem.groupBy({
    by: ["variantId"],
    where: {
      variantId: { in: allVariantIds },
      order: {
        createdAt: { gte: since },
        status: { in: ["PAID", "COMPLETED", "SHIPPED", "PROCESSING"] },
      },
    },
    _sum: { quantity: true },
  });

  const salesByProduct = new Map<string, number>();
  for (const row of salesRows) {
    if (!row.variantId) continue;
    const pid = variantIdToProductId.get(row.variantId);
    if (pid) {
      salesByProduct.set(pid, (salesByProduct.get(pid) ?? 0) + (row._sum.quantity ?? 0));
    }
  }

  // 3. Inquiry count per product
  const inquiryRows = await prisma.inquiryItem.groupBy({
    by: ["productId"],
    where: {
      productId: { in: products.map((p) => p.id) },
      inquiry: { createdAt: { gte: since } },
    },
    _count: { id: true },
  });

  const inquiryByProduct = new Map<string, number>();
  for (const row of inquiryRows) {
    inquiryByProduct.set(row.productId, row._count.id);
  }

  // 4. Last sale date per product
  const lastSaleByProduct = new Map<string, Date>();
  // Query last order per variant
  if (allVariantIds.length > 0) {
    const lastSaleRows = await prisma.orderItem.findMany({
      where: {
        variantId: { in: allVariantIds },
        order: { status: { in: ["PAID", "COMPLETED", "SHIPPED", "PROCESSING"] } },
      },
      select: {
        variantId: true,
        order: { select: { createdAt: true } },
      },
      orderBy: { order: { createdAt: "desc" } },
    });

    for (const row of lastSaleRows) {
      if (!row.variantId) continue;
      const pid = variantIdToProductId.get(row.variantId);
      if (pid) {
        const existing = lastSaleByProduct.get(pid);
        if (!existing || row.order.createdAt > existing) {
          lastSaleByProduct.set(pid, row.order.createdAt);
        }
      }
    }
  }

  // 5. Hitung normalization maximums
  const maxSales = Math.max(1, ...Array.from(salesByProduct.values()));
  const maxInquiry = Math.max(1, ...Array.from(inquiryByProduct.values()));
  const maxViews = Math.max(1, ...products.map((p) => p.pageViews));

  const now = new Date();

  // 6. Hitung skor per produk
  const scores: ProductScore[] = products.map((p) => {
    const sales = salesByProduct.get(p.id) ?? 0;
    const inquiries = inquiryByProduct.get(p.id) ?? 0;
    const views = p.pageViews;
    const totalStock = p.variants.reduce(
      (acc, v) => acc + Math.max(0, v.stock - v.reservedStock),
      0
    );

    const lastSale = lastSaleByProduct.get(p.id);
    const daysSince = lastSale
      ? Math.floor((now.getTime() - lastSale.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    // Margin = (price - costPrice) / price * 100
    const price = new Decimal(p.price.toString());
    const cost = new Decimal(p.costPrice.toString());
    const margin = price.gt(0) ? price.minus(cost).dividedBy(price).times(100).toNumber() : null;

    const compositeScore = new Decimal(normalize(sales, maxSales))
      .times(W.SALES)
      .plus(new Decimal(normalize(inquiries, maxInquiry)).times(W.INQUIRY))
      .plus(new Decimal(recencyScore(daysSince)).times(W.RECENCY))
      .plus(new Decimal(turnoverScore(sales, totalStock)).times(W.TURNOVER))
      .plus(new Decimal(margin !== null ? Math.min(margin / 100, 1) : 0).times(W.MARGIN))
      .plus(new Decimal(normalize(views, maxViews)).times(W.VIEWS));

    return {
      productId: p.id,
      productName: p.name,
      productBrand: p.brand,
      productModel: p.model,
      salesCount: sales,
      inquiryCount: inquiries,
      pageViews: views,
      currentStock: totalStock,
      daysSinceLastSale: daysSince,
      marginPercent: margin !== null ? Math.round(margin * 100) / 100 : null,
      score: compositeScore.toFixed(2),
    };
  });

  // Sort ascending — worst first
  scores.sort((a, b) => parseFloat(a.score) - parseFloat(b.score));

  return scores;
}

/**
 * Ambil N produk dengan skor terendah (kandidat retire).
 */
export async function getBottomProducts(
  count = 10,
  monthsBack = 3
): Promise<ProductScore[]> {
  const all = await calculateProductScores(monthsBack);
  return all.slice(0, count);
}
