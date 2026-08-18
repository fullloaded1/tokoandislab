/**
 * Data statis produk Promo MERDEKA HUT RI ke-81.
 * Periode order: 13 Juli – 14 Agustus 2026
 * Pengiriman:    17 – 31 Agustus 2026
 *
 * Semua produk di sini adalah READY STOCK.
 * Harga menggunakan `string` agar konsisten dengan aturan Decimal.
 * JANGAN query Prisma untuk halaman promo — cukup dari file ini.
 */

import { waMeUrl } from "./contact";

export type PromoItem = {
  nama: string;
  kategori: "ready-stock";
  hargaNormal: string;
  hargaPromo: string;
  status: "ready";
};

export const PROMO_MERDEKA_WA_URL =
  waMeUrl("Halo AndisLab, saya mau order Promo MERDEKA");

export const PROMO_BANNER_IMAGE =
  "/images/Banner Promo MERDEKA AndisLab 2026.png";

export const promoMerdekaItems: PromoItem[] = [
  {
    nama: "pH Meter Milwaukee MW102 PRO",
    kategori: "ready-stock",
    hargaNormal: "5500000",
    hargaPromo: "4565000",
    status: "ready",
  },
  {
    nama: "Turbidity Meter Lovibond TB 210 IR",
    kategori: "ready-stock",
    hargaNormal: "32000000",
    hargaPromo: "26560000",
    status: "ready",
  },
  {
    nama: "Erlenmeyer Flask Pyrex 250 mL",
    kategori: "ready-stock",
    hargaNormal: "185000",
    hargaPromo: "153550",
    status: "ready",
  },
  {
    nama: "Beaker Glass Pyrex 500 mL",
    kategori: "ready-stock",
    hargaNormal: "165000",
    hargaPromo: "136950",
    status: "ready",
  },
  {
    nama: "Volumetric Flask Pyrex 100 mL Class A",
    kategori: "ready-stock",
    hargaNormal: "450000",
    hargaPromo: "373500",
    status: "ready",
  },
];

export const PROMO_SUCCESS_MESSAGE = "✨ Promo MERDEKA Sukses Besar! Dipercaya oleh 150+ laboratorium dengan rating 4.8/5";
