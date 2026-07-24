import { money, type DecimalValue } from "./money";

export type ReadyStockState = "available" | "sold_out" | "rfq";

export interface VariantLike {
  id: string;
  price: DecimalValue;
  stock: number;
  reservedStock: number;
  name?: string;
}

export interface ProductLike {
  isReadyStock?: boolean;
  isRequestPricing?: boolean;
  variants?: VariantLike[];
}

export interface ReadyStockSummary {
  state: ReadyStockState;
  availableVariants: VariantLike[];
  minPrice: number;
  maxPrice: number;
  hasPriceRange: boolean;
  firstAvailable: VariantLike | null;
}

export function getAvailable(v: Pick<VariantLike, "stock" | "reservedStock">): number {
  return Math.max(0, v.stock - v.reservedStock);
}

export function isVariantBuyable(v: VariantLike): boolean {
  return getAvailable(v) > 0 && money.toDecimal(v.price).toNumber() > 0;
}

/**
 * Hitung ringkasan ready-stock untuk sebuah produk: state UI, varian yg bisa dibeli,
 * dan rentang harga (untuk label "Mulai dari Rp ...").
 *
 * - state="rfq": produk bukan ready stock, isRequestPricing, atau semua varian harganya 0 / tidak punya varian sama sekali.
 * - state="sold_out": produk ready stock dan berharga > 0 tapi semua varian habis stoknya.
 * - state="available": ada minimal 1 varian dgn stok tersedia & harga > 0.
 */
export function getReadyStockSummary(product: ProductLike): ReadyStockSummary {
  const variants = product.variants ?? [];

  if (!product.isReadyStock || variants.length === 0) {
    return {
      state: "rfq",
      availableVariants: [],
      minPrice: 0,
      maxPrice: 0,
      hasPriceRange: false,
      firstAvailable: null,
    };
  }

  const available = variants.filter(isVariantBuyable);

  if (available.length === 0) {
    const hasAnyPricedVariant = variants.some((v) => money.toDecimal(v.price).toNumber() > 0);
    if (!hasAnyPricedVariant) {
      return {
        state: "rfq",
        availableVariants: [],
        minPrice: 0,
        maxPrice: 0,
        hasPriceRange: false,
        firstAvailable: null,
      };
    }
    return {
      state: "sold_out",
      availableVariants: [],
      minPrice: 0,
      maxPrice: 0,
      hasPriceRange: false,
      firstAvailable: null,
    };
  }

  const prices = available.map((v) => money.toDecimal(v.price).toNumber());
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return {
    state: product.isRequestPricing ? "rfq" : "available",
    availableVariants: available,
    minPrice,
    maxPrice,
    hasPriceRange: minPrice !== maxPrice,
    firstAvailable: available[0],
  };
}
