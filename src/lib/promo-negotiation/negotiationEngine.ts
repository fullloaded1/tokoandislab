import { Prisma } from "@prisma/client";
import {
  PromoCalculatorProduct,
  SelectedItem,
  BidSimulationResult,
  DiscountTier,
} from "./types";
import {
  getMarginZone,
  getMarginZoneMeta,
  TARGET_MARGIN_PERCENT,
  MIN_WIN_MARGIN_PERCENT,
} from "./marginPolicy";

export const DISCOUNT_TIERS: { tier: DiscountTier; label: string; terms: string }[] = [
  { tier: 0, label: "Normal (0%)", terms: "Termin standar kredit instansi (30 hari)" },
  { tier: 5, label: "Diskon 5%", terms: "DP 30% atau DP 10% tempo 2 minggu" },
  { tier: 10, label: "Diskon 10%", terms: "DP 50% atau DP 30% tempo 2 minggu" },
  { tier: 15, label: "Diskon 15%", terms: "Cash Keras atau DP 50% tempo 2 minggu" },
];

/**
 * Calculates catalog total and total procurement cost using Prisma.Decimal.
 */
export function calculateTotals(items: SelectedItem[]): {
  catalogTotal: Prisma.Decimal;
  totalCost: Prisma.Decimal;
} {
  let catalogTotal = new Prisma.Decimal(0);
  let totalCost = new Prisma.Decimal(0);

  for (const item of items) {
    const qtyDec = new Prisma.Decimal(item.qty);
    const priceDec = new Prisma.Decimal(item.product.price);
    const costDec = new Prisma.Decimal(item.product.cost);

    catalogTotal = catalogTotal.plus(priceDec.times(qtyDec));
    totalCost = totalCost.plus(costDec.times(qtyDec));
  }

  return { catalogTotal, totalCost };
}

/**
 * Simulates a customer bid against target margin and overcost protection.
 */
export function simulateCustomerBid(
  items: SelectedItem[],
  customerBidInput: number | string
): BidSimulationResult {
  const { catalogTotal, totalCost } = calculateTotals(items);
  const bidDec = new Prisma.Decimal(customerBidInput || 0);

  // Discount calculation
  let discountAmount = new Prisma.Decimal(0);
  let discountPercent = 0;

  if (catalogTotal.greaterThan(0)) {
    if (catalogTotal.greaterThan(bidDec)) {
      discountAmount = catalogTotal.minus(bidDec);
      discountPercent = discountAmount.dividedBy(catalogTotal).times(100).toNumber();
    }
  }

  // Profit and Margin calculation
  const projectProfit = bidDec.minus(totalCost);
  let projectMarginPercent = 0;
  if (bidDec.greaterThan(0) && totalCost.greaterThan(0)) {
    projectMarginPercent = projectProfit.dividedBy(bidDec).times(100).toNumber();
  }

  const zone = getMarginZone(new Prisma.Decimal(projectMarginPercent), totalCost);
  const zoneMeta = getMarginZoneMeta(zone);

  // Counter offer to achieve target 25% margin
  // Target 25% margin: profit / bid = 0.25 => bid * 0.75 = totalCost => bid = totalCost / 0.75
  let suggestedCounterBid: string | undefined;
  if (totalCost.greaterThan(0)) {
    const targetBidDec = totalCost.dividedBy(new Prisma.Decimal("0.75"));
    suggestedCounterBid = targetBidDec.toFixed(0);
  }

  // Status headline and strategic recommendations
  let statusHeadline = "";
  let recommendation = "";
  let suggestedTerms = "";

  switch (zone) {
    case "target":
      statusHeadline = "Tawaran Disetujui (Margin Sehat ≥ 25%)";
      recommendation =
        "Tawaran klien masuk zona optimal perusahaan. Anda dapat langsung menerbitkan SPH resmi dan mengunci alokasi unit ready stock.";
      suggestedTerms = "Termin fleksibel: DP 30% atau Kredit Standar Instansi 30 Hari.";
      break;

    case "win_mode":
      statusHeadline = "Tawaran Bersyarat (Posisikan Menang Deal)";
      recommendation =
        "Tawaran berada di zona Mode Menang (15%–24.9%). Agar profit tetap sehat dan cashflow aman, kunci kesepakatan dengan syarat pembayaran DP 50% atau pelunasan di muka.";
      suggestedTerms = "Wajib komitmen DP 50% di awal atau Cash Keras.";
      break;

    case "attention":
      statusHeadline = "Margin Terlalu Tipis (< 15%)";
      recommendation =
        "Tawaran klien memotong margin terlalu dalam. Berikan counter-offer cerdas di batas target Rp " +
        (suggestedCounterBid ? new Intl.NumberFormat("id-ID").format(Number(suggestedCounterBid)) : "-") +
        " dengan tambahan bonus gratis ongkir & glassware pendukung.";
      suggestedTerms = "Wajib DP 50% + Negosiasi ulang ke batas counter-offer.";
      break;

    case "overcost":
      statusHeadline = "DILARANG LEPAS: Nilai Tawaran Di Bawah Modal!";
      recommendation =
        "Nilai tawaran lebih kecil dari modal pengadaan barang. Tawaran ini akan menyebabkan kerugian perusahaan. Tawarkan alternatif instrumen setara atau sesuaikan kuantiti.";
      suggestedTerms = "Tolak tawaran ini atau alihkan ke produk tier yang lebih ekonomis.";
      break;

    case "missing_cost":
    default:
      statusHeadline = "Data Modal Belum Lengkap";
      recommendation = "Lengkapi daftar item untuk memulai kalkulasi simulasi penawaran.";
      suggestedTerms = "Termin standar.";
      break;
  }

  // Eligible bonuses based on total value
  const eligibleBonuses: string[] = [];
  const bidNum = bidDec.toNumber();
  if (bidNum >= 70000000) {
    eligibleBonuses.push("Free Sertifikat Kalibrasi Internal & QC Report");
    eligibleBonuses.push("Free Starter Kit Glassware Lab (5 Pcs)");
    eligibleBonuses.push("Gratis Ongkir Jabodetabek & Instalasi On-Site");
  } else if (bidNum >= 30000000) {
    eligibleBonuses.push("Free Starter Kit Glassware Lab (3 Pcs)");
    eligibleBonuses.push("Gratis Ongkir Jabodetabek & Uji Fungsi");
  } else if (bidNum > 0) {
    eligibleBonuses.push("Gratis Ongkir Jabodetabek");
    eligibleBonuses.push("Uji Fungsi & QC Checklist Sebelum Kirim");
  }

  return {
    catalogTotal: catalogTotal.toFixed(0),
    totalCost: totalCost.toFixed(0),
    customerBid: bidDec.toFixed(0),
    discountAmount: discountAmount.toFixed(0),
    discountPercent: Math.round(discountPercent * 10) / 10,
    projectProfit: projectProfit.toFixed(0),
    projectMarginPercent: Math.round(projectMarginPercent * 10) / 10,
    zone,
    zoneMeta,
    statusHeadline,
    recommendation,
    suggestedCounterBid,
    suggestedTerms,
    eligibleBonuses,
  };
}

/**
 * Budget Maximizer: recommends the best combination of ready stock instruments to absorb budget.
 */
export function maximizeBudget(
  targetBudgetInput: number | string,
  availableProducts: PromoCalculatorProduct[]
): {
  selectedItems: SelectedItem[];
  totalAbsorbed: string;
  remainingBudget: string;
  absorptionRate: number;
} {
  const budget = new Prisma.Decimal(targetBudgetInput || 0);
  if (budget.lessThanOrEqualTo(0) || availableProducts.length === 0) {
    return {
      selectedItems: [],
      totalAbsorbed: "0",
      remainingBudget: "0",
      absorptionRate: 0,
    };
  }

  // Sort products descending by price to pick high-value items first
  const sorted = [...availableProducts].sort((a, b) => b.price - a.price);

  let currentTotal = new Prisma.Decimal(0);
  const chosen: SelectedItem[] = [];

  for (const prod of sorted) {
    const prodPrice = new Prisma.Decimal(prod.price);
    if (currentTotal.plus(prodPrice).lessThanOrEqualTo(budget)) {
      chosen.push({
        product: prod,
        qty: 1,
      });
      currentTotal = currentTotal.plus(prodPrice);
    }
  }

  const remaining = budget.minus(currentTotal);
  const rate = budget.greaterThan(0)
    ? currentTotal.dividedBy(budget).times(100).toNumber()
    : 0;

  return {
    selectedItems: chosen,
    totalAbsorbed: currentTotal.toFixed(0),
    remainingBudget: remaining.toFixed(0),
    absorptionRate: Math.round(rate * 10) / 10,
  };
}
