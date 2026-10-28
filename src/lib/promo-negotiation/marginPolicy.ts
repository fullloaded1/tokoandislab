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
        label: "TARGET IDEAL (≥ 25%)",
        shortLabel: "Deal Optimal",
        badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
        borderClass: "border-emerald-500",
        textClass: "text-emerald-700",
        bgLightClass: "bg-emerald-50",
        icon: "CheckCircle2",
        description: "Margin profit sehat memenuhi target perusahaan (≥ 25%). Tawaran dapat langsung disetujui untuk terbit SPH resmi.",
      };
    case "win_mode":
      return {
        zone,
        label: "MODE MENANG (15% - 24.9%)",
        shortLabel: "Deal Bersyarat",
        badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
        borderClass: "border-amber-400",
        textClass: "text-amber-700",
        bgLightClass: "bg-amber-50",
        icon: "Award",
        description: "Posisikan menang deal! Diskon disetujui jika disertai komitmen termin pembayaran (DP 50% atau Cash).",
      };
    case "attention":
      return {
        zone,
        label: "PERHATIAN KHUSUS (< 15%)",
        shortLabel: "Margin Tipis",
        badgeClass: "bg-orange-100 text-orange-800 border-orange-300",
        borderClass: "border-orange-400",
        textClass: "text-orange-700",
        bgLightClass: "bg-orange-50",
        icon: "AlertTriangle",
        description: "Margin di bawah batas aman. Perlu penyesuaian nilai tawaran (counter-offer) atau penambahan item consumables.",
      };
    case "overcost":
      return {
        zone,
        label: "OVERCOST (RUGI PENJUALAN)",
        shortLabel: "Di Bawah Modal",
        badgeClass: "bg-rose-100 text-rose-800 border-rose-300 font-bold",
        borderClass: "border-rose-500",
        textClass: "text-rose-700 font-bold",
        bgLightClass: "bg-rose-50",
        icon: "Ban",
        description: "DILARANG LEPAS: Nilai tawaran berada di bawah harga modal pengadaan barang.",
      };
    case "missing_cost":
      return {
        zone,
        label: "MODAL BELUM LENGKAP",
        shortLabel: "Cek Modal",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
        borderClass: "border-slate-300",
        textClass: "text-slate-600",
        bgLightClass: "bg-slate-50",
        icon: "HelpCircle",
        description: "Data modal pengadaan belum terverifikasi.",
      };
  }
}
