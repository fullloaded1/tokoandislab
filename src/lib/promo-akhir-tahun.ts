import { Prisma } from "@prisma/client";
import {
  PROMO_START,
  PROMO_END,
  PO_CUTOFF_JAWA,
  PO_CUTOFF_LUAR_JAWA,
  WA_NUMBER,
  catalogs,
  PromoCatalog,
  PromoProduct,
} from "@/data/promo-akhir-tahun";

export type PromoMode = "upcoming" | "active" | "ended";
export type PromoPhaseId = "upcoming" | "early-bird" | "serapan" | "last-call" | "ended";

export interface PromoState {
  mode: PromoMode;
  phaseId: PromoPhaseId;
  phaseName: string;
  message: string;
  bannerText: string;
  isCutoffPassed: boolean;
  targetDate: string; // ISO string to countdown towards
  cutoffJawaLabel: string;
  cutoffLuarJawaLabel: string;
}

const MONTH_NAMES_ID = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

/**
 * Format string tanggal YYYY-MM-DD menjadi format ringkas Indonesia, misal "22 Des".
 */
export function formatCutoffDate(dateStr: string): string {
  const parts = dateStr.split("-");
  if (parts.length < 3) return dateStr;
  const day = parseInt(parts[2], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const monthName = MONTH_NAMES_ID[monthIdx] || parts[1];
  return `${day} ${monthName}`;
}

/**
 * Menghitung fase promo saat ini berdasarkan waktu referensi (WIB).
 */
export function getPromoState(referenceTime: Date = new Date()): PromoState {
  const nowMs = referenceTime.getTime();
  const startMs = new Date(PROMO_START).getTime();
  const endMs = new Date(PROMO_END).getTime();

  // Cut-off berlaku sampai akhir hari tanggal cut-off (23:59:59 WIB)
  const cutoffJawaMs = new Date(`${PO_CUTOFF_JAWA}T23:59:59+07:00`).getTime();
  const isCutoffPassed = nowMs > cutoffJawaMs;

  const cutoffJawaLabel = formatCutoffDate(PO_CUTOFF_JAWA);
  const cutoffLuarJawaLabel = formatCutoffDate(PO_CUTOFF_LUAR_JAWA);

  // 1. Sebelum PROMO_START
  if (nowMs < startMs) {
    return {
      mode: "upcoming",
      phaseId: "upcoming",
      phaseName: "Segera Hadir",
      message: "Promo Akhir Tahun segera hadir. Kunci kebutuhan alat lab Anda menjelang pembukaan resmi.",
      bannerText: "Segera Hadir: Promo Akhir Tahun 2026 AndisLab — Buka 30 Okt 2026",
      isCutoffPassed: false,
      targetDate: PROMO_START,
      cutoffJawaLabel,
      cutoffLuarJawaLabel,
    };
  }

  // 2. Setelah PROMO_END
  if (nowMs > endMs) {
    return {
      mode: "ended",
      phaseId: "ended",
      phaseName: "Promo Berakhir",
      message: "Promo Akhir Tahun telah berakhir. Hubungi kami untuk kebutuhan pengadaan reguler atau cek ketersediaan stok.",
      bannerText: "Promo Akhir Tahun 2026 telah berakhir. Hubungi tim sales untuk pengadaan reguler.",
      isCutoffPassed: true,
      targetDate: PROMO_END,
      cutoffJawaLabel,
      cutoffLuarJawaLabel,
    };
  }

  // 3. Fase Aktif
  const earlyBirdEndIso = "2026-11-20T23:59:59+07:00";
  const serapanEndIso = "2026-12-15T23:59:59+07:00";
  const cutoffJawaIso = `${PO_CUTOFF_JAWA}T23:59:59+07:00`;

  const earlyBirdEndMs = new Date(earlyBirdEndIso).getTime();
  const serapanEndMs = new Date(serapanEndIso).getTime();

  if (nowMs <= earlyBirdEndMs) {
    const msg = "Kunci stok dan harga sekarang selagi unit masih lengkap. SPH bisa terbit segera untuk pengajuan anggaran.";
    return {
      mode: "active",
      phaseId: "early-bird",
      phaseName: "Early Bird",
      message: msg,
      bannerText: `Fase 1 Early Bird: ${msg}`,
      isCutoffPassed: false,
      targetDate: earlyBirdEndIso,
      cutoffJawaLabel,
      cutoffLuarJawaLabel,
    };
  }

  if (nowMs <= serapanEndMs) {
    const msg = "Kejar PO akhir tahun. Pilih alat ready stock agar anggaran departemen terserap tepat guna.";
    return {
      mode: "active",
      phaseId: "serapan",
      phaseName: "Serapan Anggaran",
      message: msg,
      bannerText: `Fase 2 Serapan Anggaran: ${msg}`,
      isCutoffPassed: false,
      targetDate: serapanEndIso,
      cutoffJawaLabel,
      cutoffLuarJawaLabel,
    };
  }

  // Fase 3: Last Call (16 - 30 Des)
  if (isCutoffPassed) {
    const msg = "Cut-off pengiriman terlewati. Hubungi kami untuk cek ketersediaan dan jadwal.";
    return {
      mode: "active",
      phaseId: "last-call",
      phaseName: "Last Call",
      message: msg,
      bannerText: `Fase 3 Last Call: ${msg}`,
      isCutoffPassed: true,
      targetDate: PROMO_END,
      cutoffJawaLabel,
      cutoffLuarJawaLabel,
    };
  }

  const msg = `Ready stock siap kirim. PO masuk paling lambat ${cutoffJawaLabel} (Jawa) atau ${cutoffLuarJawaLabel} (luar Jawa) agar faktur dan BAST dapat diproses sebelum tutup buku.`;
  return {
    mode: "active",
    phaseId: "last-call",
    phaseName: "Last Call",
    message: msg,
    bannerText: `Fase 3 Last Call: ${msg}`,
    isCutoffPassed: false,
    targetDate: cutoffJawaIso,
    cutoffJawaLabel,
    cutoffLuarJawaLabel,
  };
}

/**
 * Menghitung harga promo dan penghematan berdasarkan persentase diskon cara pembayaran
 * menggunakan Prisma.Decimal (tetap masuk aturan keuntungan di atas modal).
 */
export function calculatePromoPriceByPayment(
  normalPrice: number | string,
  discountPercent: number = 8
): {
  normalPrice: string;
  discountedPrice: string;
  savingAmount: string;
  discountPercent: number;
} {
  const priceDec = new Prisma.Decimal(normalPrice || 0);
  const pctDec = new Prisma.Decimal(discountPercent || 0).dividedBy(new Prisma.Decimal(100));
  const savingDec = priceDec
    .times(pctDec)
    .toDecimalPlaces(0, Prisma.Decimal.ROUND_FLOOR);
  const discountedDec = priceDec.minus(savingDec);

  return {
    normalPrice: priceDec.toString(),
    discountedPrice: discountedDec.toString(),
    savingAmount: savingDec.toString(),
    discountPercent,
  };
}

/**
 * Menghitung estimasi penghematan maksimal (Diskon Tunai/Cash 8%) dengan Prisma.Decimal.
 */
export function calculateMaxTermSaving(
  normalPrice: number | string,
  discountPercent: number = 8
): {
  savingAmount: string;
  discountedPrice: string;
} {
  const res = calculatePromoPriceByPayment(normalPrice, discountPercent);
  return {
    savingAmount: res.savingAmount,
    discountedPrice: res.discountedPrice,
  };
}

/**
 * Format mata uang Rupiah standar IDR (contoh: "Rp 25.000.000")
 * Membersihkan non-breaking space yang kadang dihasilkan oleh Intl.NumberFormat.
 */
export function formatPromoRupiah(amount: number): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return formatted.replace(/\u00A0/g, " ");
}

/**
 * Mengurutkan produk per katalog dari harga tertinggi ke terendah.
 */
export function sortProductsByPrice(products: PromoProduct[]): PromoProduct[] {
  return [...products].sort((a, b) => {
    const priceA = a.promoPrice !== null ? a.promoPrice : a.normalPrice;
    const priceB = b.promoPrice !== null ? b.promoPrice : b.normalPrice;
    return priceB - priceA;
  });
}

/**
 * Mendapatkan label stok resmi.
 * Jika stock === 1: "Unit terakhir", selain itu "Tersisa X unit".
 */
export function getStockLabel(stock: number): string {
  if (stock === 1) return "Unit terakhir";
  return `Tersisa ${stock} unit`;
}

/**
 * Membuat pesan WhatsApp untuk tombol Minta SPH produk individual.
 */
export function buildProductSphMessage(
  name: string,
  model: string,
  paymentTermsLabel?: string,
  discountedPriceFormatted?: string
): string {
  if (paymentTermsLabel && discountedPriceFormatted) {
    return `Halo AndisLab, saya mau minta SPH untuk ${name} ${model} (Promo Akhir Tahun - Skema ${paymentTermsLabel}: ${discountedPriceFormatted}).`;
  }
  return `Halo AndisLab, saya mau minta SPH untuk ${name} ${model} (Promo Akhir Tahun).`;
}

/**
 * Membuat pesan WhatsApp untuk CTA utama Hero / umum.
 */
export const HERO_SPH_MESSAGE = "Halo AndisLab, saya mau minta SPH untuk Promo Akhir Tahun.";

/**
 * Membuat URL wa.me resmi.
 */
export function buildPromoWaUrl(message: string): string {
  const cleanNumber = WA_NUMBER.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Mengambil katalog berdasarkan nomor 1, 2, atau 3.
 */
export function getCatalogByNumber(n: number | string): PromoCatalog | undefined {
  const num = typeof n === "string" ? parseInt(n, 10) : n;
  return catalogs.find((c) => c.number === num);
}
