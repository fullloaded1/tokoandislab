import { Prisma } from "@prisma/client";
import { money } from "./money";
import { waMeUrl } from "./contact";

export interface PromoBundleDef {
  id: string;
  name: string;
  tagline: string;
  description: string;
  discountPercent: number; // e.g. 15 for 15%
  itemSlugs: string[];
}

export const PROMO_MILENIAL_WA_URL = waMeUrl("Halo AndisLab, saya mau konsultasi tentang Promo Milenial");

// Definisi statis dari bundling (Hanya menyimpan slug produk)
export const promoMilenialBundles: PromoBundleDef[] = [
  {
    id: "starter-pack",
    name: "Lab Starter Pack",
    tagline: "Esensial & Budget-Friendly",
    description: "Paket esensial untuk peneliti muda atau lab startup yang butuh alat dasar untuk preparasi cairan harian yang praktis dan akurat.",
    discountPercent: 15, // Diskon 15%
    itemSlugs: [
      "micropipette-single-channel-10-100ul-ae-mb05-aelab",
      "vortex-mixer-delta-mixer-se-04-taitec",
      "ph-meter-mw-150-milwaukee",
    ],
  },
  {
    id: "bio-researcher",
    name: "Bio-Researcher Kit",
    tagline: "Modern & Ergonomis",
    description: "Paket lengkap untuk riset biologi, mikrobiologi, atau kultur sel. Desain ergonomis cocok untuk milenial yang kerja cepat di lab.",
    discountPercent: 20, // Diskon 20%
    itemSlugs: [
      "biological-microscope-eum-4001-labex",
      "digital-orbital-shaker-sk-o330-pro-aelab",
      "8-channels-adjustable-volume-pipettes-5-50ul-ae-8m50-aelab",
    ],
  },
  {
    id: "precision-squad",
    name: "Precision Squad",
    tagline: "Akurasi Tinggi, Anti-Ribet",
    description: "Untuk riset yang butuh ketelitian tinggi dan pemanasan sampel yang presisi. Tinggal colok, langsung bisa jalan tanpa ribet kalibrasi panjang.",
    discountPercent: 18, // Diskon 18%
    itemSlugs: [
      "precision-balance-cy223-aczet",
      "aluminum-block-bath-dtu-r-taitec",
      "micropipette-single-channel-100-1000ul-ae-ma08-aelab",
    ],
  },
];

export interface BundleCalculation {
  totalNormalPrice: Prisma.Decimal;
  discountAmount: Prisma.Decimal;
  bundlePrice: Prisma.Decimal;
  isValid: boolean;
  missingItems: string[];
  soldOutItems: string[];
}

/**
 * Menghitung harga bundle berdasarkan daftar produk dari database.
 * @param bundle Definisi bundle statis
 * @param dbProducts List produk dari DB yang sesuai dengan itemSlugs
 */
export function calculateBundlePrices(
  bundle: PromoBundleDef,
  dbProducts: { slug: string; price: Prisma.Decimal; isReadyStock: boolean }[]
): BundleCalculation {
  const missingItems: string[] = [];
  const soldOutItems: string[] = [];
  let totalNormalPrice = money.toDecimal(0);

  // Periksa setiap item di bundle
  for (const slug of bundle.itemSlugs) {
    const product = dbProducts.find((p) => p.slug === slug);
    if (!product) {
      missingItems.push(slug);
      continue;
    }

    const price = money.toDecimal(product.price);
    
    // Jika harga 0 (Request for Pricing)
    if (price.lessThanOrEqualTo(0)) {
      missingItems.push(slug);
    } else {
      totalNormalPrice = totalNormalPrice.add(price);
    }

    if (!product.isReadyStock) {
      soldOutItems.push(slug);
    }
  }

  const isValid = missingItems.length === 0 && soldOutItems.length === 0;

  let discountAmount = money.toDecimal(0);
  let bundlePrice = totalNormalPrice;

  if (isValid) {
    const discountMultiplier = money.toDecimal(bundle.discountPercent).dividedBy(100);
    discountAmount = totalNormalPrice.mul(discountMultiplier).toDecimalPlaces(0);
    bundlePrice = totalNormalPrice.minus(discountAmount);
  }

  return {
    totalNormalPrice,
    discountAmount,
    bundlePrice,
    isValid,
    missingItems,
    soldOutItems,
  };
}

export function buildBundleWaUrl(bundle: PromoBundleDef, calc: BundleCalculation): string {
  const text = `Halo AndisLab, saya tertarik dengan Promo Milenial: *${bundle.name}*.\n`
    + `Harga Bundle: ${money.formatIDR(calc.bundlePrice)}\n`
    + `Apakah promo ini masih tersedia?`;
  return waMeUrl(text);
}
