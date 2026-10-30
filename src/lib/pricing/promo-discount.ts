import { Prisma } from "@prisma/client";
import { getMarginZone } from "@/lib/promo-negotiation/marginPolicy";
import { MarginZone } from "@/lib/promo-negotiation/types";

export interface ResolvePromoPriceParams {
  normalPrice: number;
  cost?: number | null;
  isBundle?: boolean;
}

export interface PromoPriceResolution {
  promoPrice: number | null;
  discountPct: number;
  zone: MarginZone;
  status: "publish" | "review";
}

/**
 * Floor round to nearest thousand rupiah.
 * e.g. Rp 18.731.250 * 0.90 = Rp 16.858.125 -> Rp 16.858.000
 */
export function calculateFloorPrice(price: number, discountPct: number): number {
  const discounted = price * (1 - discountPct / 100);
  return Math.floor(discounted / 1000) * 1000;
}

/**
 * Calculates promo price and checks margin policy according to AndisLab rules.
 *
 * Rules:
 * - Cost null or <= 0: status "review", no public discount.
 * - Bundling: 15% discount only accepted if resulting zone is "target" (>= 25%).
 *   "win_mode" (15% - 24.9%) cannot be used for 15% public bundle discount.
 * - Otherwise: tries 10% discount. Accepted if zone is "target" or "win_mode".
 * - If 10% yields "attention" (< 15%) or "overcost": status "review", no discount.
 */
export function resolvePromoPrice({
  normalPrice,
  cost,
  isBundle = false,
}: ResolvePromoPriceParams): PromoPriceResolution {
  if (cost === undefined || cost === null || cost <= 0) {
    return {
      promoPrice: null,
      discountPct: 0,
      zone: "missing_cost",
      status: "review",
    };
  }

  const costDecimal = new Prisma.Decimal(cost);

  // If bundling requested, attempt 15% discount
  if (isBundle) {
    const promoPrice15 = calculateFloorPrice(normalPrice, 15);
    const profit15 = promoPrice15 - cost;
    const margin15 = promoPrice15 > 0 ? (profit15 / promoPrice15) * 100 : 0;
    const zone15 = getMarginZone(margin15, costDecimal);

    // Only accept 15% if zone is strictly "target" (>= 25%)
    if (zone15 === "target") {
      return {
        promoPrice: promoPrice15,
        discountPct: 15,
        zone: zone15,
        status: "publish",
      };
    }
    // Otherwise fallback to 10% evaluation
  }

  // Attempt standard 10% discount
  const promoPrice10 = calculateFloorPrice(normalPrice, 10);
  const profit10 = promoPrice10 - cost;
  const margin10 = promoPrice10 > 0 ? (profit10 / promoPrice10) * 100 : 0;
  const zone10 = getMarginZone(margin10, costDecimal);

  if (zone10 === "target" || zone10 === "win_mode") {
    return {
      promoPrice: promoPrice10,
      discountPct: 10,
      zone: zone10,
      status: "publish",
    };
  }

  // Zone is attention (<15%) or overcost
  return {
    promoPrice: null,
    discountPct: 0,
    zone: zone10,
    status: "review",
  };
}
