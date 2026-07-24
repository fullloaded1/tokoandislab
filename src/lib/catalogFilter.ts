import { getReadyStockSummary } from "./readyStock";

export type PriceSortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

export interface PriceRangeFilter {
  minPrice?: number | null;
  maxPrice?: number | null;
}

/**
 * Returns the effective numerical price of a product for filtering and sorting purposes.
 * - If product is Request Pricing (or has no priced ready stock / variant / base price), returns null.
 * - Uses getReadyStockSummary minPrice if available, or fallback to Number(product.price).
 */
export function getEffectiveProductPrice(product: any): number | null {
  if (!product) return null;
  if (product.isRequestPricing) return null;

  const summaryMin = getReadyStockSummary(product).minPrice;
  if (summaryMin && summaryMin > 0) {
    return summaryMin;
  }

  const rawPrice = Number(product.price || 0);
  if (!isNaN(rawPrice) && rawPrice > 0) {
    return rawPrice;
  }

  // Check if any variant has a positive price
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    const prices = product.variants
      .map((v: any) => Number(v.price || 0))
      .filter((p: number) => !isNaN(p) && p > 0);
    if (prices.length > 0) {
      return Math.min(...prices);
    }
  }

  return null;
}

/**
 * Filters and sorts products by price range and sorting option.
 */
export function filterAndSortCatalogProducts(
  products: any[],
  filter?: PriceRangeFilter,
  sortBy: PriceSortOption = "default"
): any[] {
  if (!Array.isArray(products)) return [];

  // Filter by price range
  let filtered = products.filter((p) => {
    const effPrice = getEffectiveProductPrice(p);

    // If minPrice is set (> 0)
    if (filter?.minPrice != null && filter.minPrice > 0) {
      if (effPrice === null) return false;
      if (effPrice < filter.minPrice) return false;
    }

    // If maxPrice is set (> 0)
    if (filter?.maxPrice != null && filter.maxPrice > 0) {
      if (effPrice === null) return false;
      if (effPrice > filter.maxPrice) return false;
    }

    return true;
  });

  // Sort by option
  if (sortBy === "price-asc") {
    filtered = [...filtered].sort((a, b) => {
      const priceA = getEffectiveProductPrice(a);
      const priceB = getEffectiveProductPrice(b);
      // Put Request Pricing / null at the end
      if (priceA === null && priceB === null) return 0;
      if (priceA === null) return 1;
      if (priceB === null) return -1;
      return priceA - priceB;
    });
  } else if (sortBy === "price-desc") {
    filtered = [...filtered].sort((a, b) => {
      const priceA = getEffectiveProductPrice(a);
      const priceB = getEffectiveProductPrice(b);
      if (priceA === null && priceB === null) return 0;
      if (priceA === null) return 1;
      if (priceB === null) return -1;
      return priceB - priceA;
    });
  } else if (sortBy === "name-asc") {
    filtered = [...filtered].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  } else if (sortBy === "name-desc") {
    filtered = [...filtered].sort((a, b) => (b.name || "").localeCompare(a.name || ""));
  }

  return filtered;
}
