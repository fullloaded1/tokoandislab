import { Prisma } from "@prisma/client";
import { MarginZone, MarginZoneMeta } from "./types";

export const TARGET_MARGIN_PERCENT = 25;
export const MIN_WIN_MARGIN_PERCENT = 15;

/**
 * Determines margin zone using Prisma.Decimal to avoid floating-point inaccuracies.
 * @param marginPercent Decimal or number
 * @param totalCost Decimal
 */
export function getMarginZone(marginPercent: Prisma.Decimal | number, totalCost: Prisma.Decimal): MarginZone {
  const zero = new Prisma.Decimal(0);
  if (totalCost.lessThanOrEqualTo(zero)) {
    return "missing_cost";
  }

  const marginDec = marginPercent instanceof Prisma.Decimal
    ? marginPercent
    : new Prisma.Decimal(marginPercent);

  if (marginDec.lessThan(zero)) {
    return "overcost";
  }
  if (marginDec.lessThan(new Prisma.Decimal(MIN_WIN_MARGIN_PERCENT))) {
    return "attention";
  }
  if (marginDec.lessThan(new Prisma.Decimal(TARGET_MARGIN_PERCENT))) {
    return "win_mode";
  }
  return "target";
}

export function getMarginZoneMeta(zone: MarginZone): MarginZoneMeta {
  switch (zone) {
    case "target":
      return {
        zone,
        label: "DISETUJUI LANGSUNG (PRIORITAS SPH)",
        shortLabel: "Persetujuan Instan",
        badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
        borderClass: "border-emerald-500",
        textClass: "text-emerald-700",
        bgLightClass: "bg-emerald-50",
        icon: "CheckCircle2",
        description: "Nilai pengajuan sesuai kuota harga resmi. Tawaran dapat langsung disetujui untuk penerbitan SPH ber-KOP hari ini.",
      };
    case "win_mode":
      return {
        zone,
        label: "DISETUJUI BERSYARAT (KOMITMEN TERMIN)",
        shortLabel: "Deal Bersyarat",
        badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
        borderClass: "border-amber-400",
        textClass: "text-amber-700",
        bgLightClass: "bg-amber-50",
        icon: "Award",
        description: "Diskon khusus akhir tahun dapat disetujui dengan komitmen termin pembayaran (DP 50% atau Cash).",
      };
    case "attention":
      return {
        zone,
        label: "PERLU REVIEW KHUSUS (PENYESUAIAN PAGU)",
        shortLabel: "Review Khusus",
        badgeClass: "bg-orange-100 text-orange-800 border-orange-300",
        borderClass: "border-orange-400",
        textClass: "text-orange-700",
        bgLightClass: "bg-orange-50",
        icon: "AlertTriangle",
        description: "Nilai pengajuan melampaui kuota diskon standar. Gunakan rekomendasi SPH optimal atau konsultasikan spesifikasi paket.",
      };
    case "overcost":
      return {
        zone,
        label: "MELEWATI BATAS SUBSIDI PROMO",
        shortLabel: "Di Luar Plafon",
        badgeClass: "bg-rose-100 text-rose-800 border-rose-300 font-bold",
        borderClass: "border-rose-500",
        textClass: "text-rose-700 font-bold",
        bgLightClass: "bg-rose-50",
        icon: "Ban",
        description: "Nilai pengajuan berada di bawah batas subsidi promo akhir tahun. Silakan sesuaikan kuantitas atau gunakan fitur Auto-Pack.",
      };
    case "missing_cost":
      return {
        zone,
        label: "PILIH PRODUK PROMO",
        shortLabel: "Belum Lengkap",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
        borderClass: "border-slate-300",
        textClass: "text-slate-600",
        bgLightClass: "bg-slate-50",
        icon: "HelpCircle",
        description: "Pilih minimal satu instrumen ready stock untuk memulai simulasi penawaran.",
      };
  }
}
