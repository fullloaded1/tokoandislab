import { PRINT_TIER_CATALOGS } from "@/data/promo-print-catalog";
import { PromoCalculatorProduct } from "./types";

function parsePriceToNumber(priceStr: string): number {
  const cleaned = priceStr.replace(/[^0-9]/g, "");
  return parseInt(cleaned, 10) || 0;
}

function parseStockToNumber(stockStr: string): number {
  const match = stockStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
}

function getTierCategory(code: string): string {
  if (code.startsWith("A")) return "Smart Budget (Plafon s/d 30 Jt)";
  if (code.startsWith("B")) return "Core Instruments (Plafon 30-70 Jt)";
  return "Advanced Lab Systems (Plafon 70-200 Jt)";
}

/**
 * Extracts and normalizes all 35 ready stock products from the verified promo print catalog.
 * Cost (modal) is calculated at baseline 80% of selling price (25% markup policy).
 */
export function getAllPromoCalculatorProducts(): PromoCalculatorProduct[] {
  const products: PromoCalculatorProduct[] = [];

  const tierMap: { [key: number]: "A" | "B" | "C" } = {
    1: "A",
    2: "B",
    3: "C",
  };

  for (const sheetNum of [1, 2, 3]) {
    const catalog = PRINT_TIER_CATALOGS[sheetNum];
    const tier = tierMap[sheetNum];
    if (!catalog || !catalog.tableRows) continue;

    for (const row of catalog.tableRows) {
      const price = parsePriceToNumber(row.price);
      // AndisLab markup 25% on cost: price = cost * 1.25 => cost = price / 1.25
      const cost = Math.round(price / 1.25);
      const stock = parseStockToNumber(row.stock);

      products.push({
        code: row.code,
        tier,
        name: row.name,
        brand: row.brand,
        model: row.model,
        price,
        cost,
        stock,
        unit: "Unit",
        category: getTierCategory(row.code),
      });
    }
  }

  return products;
}

export const PROMO_CALCULATOR_PRODUCTS = getAllPromoCalculatorProducts();
