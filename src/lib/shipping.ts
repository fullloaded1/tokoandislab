import { Prisma } from "@prisma/client";

export type ShippingRegionKey = "JABODETABEK" | "LUAR_JABODETABEK";

export interface ShippingRegion {
  key: ShippingRegionKey;
  label: string;
  flatRate: number;
}

// ⚠️ TARIF PLACEHOLDER — BELUM FINAL.
// Update angka di bawah sesuai biaya kurir riil sebelum go-live.
// Lokasi tarif disengaja dibuat di satu tempat supaya gampang diubah.
// TODO[ops]: tentukan tarif final + kemungkinan tambah wilayah (Sumatera, Indonesia Timur, dst.)
export const SHIPPING_REGIONS: ShippingRegion[] = [
  { key: "JABODETABEK", label: "Jabodetabek", flatRate: 50_000 },
  { key: "LUAR_JABODETABEK", label: "Luar Jabodetabek", flatRate: 150_000 },
];

const REGION_LOOKUP: Record<string, ShippingRegion> = SHIPPING_REGIONS.reduce(
  (acc, r) => ({ ...acc, [r.key]: r }),
  {}
);

export function isValidShippingRegion(key: string | null | undefined): key is ShippingRegionKey {
  return !!key && key in REGION_LOOKUP;
}

export function getShippingRegion(key: string | null | undefined): ShippingRegion | null {
  if (!isValidShippingRegion(key)) return null;
  return REGION_LOOKUP[key];
}

/**
 * Hitung ongkir berdasar key wilayah. Return Decimal agar konsisten dgn lib/money.
 * Lempar error bila key tidak dikenal — pemanggil server-action harus validasi input.
 */
export function getShippingFee(key: string | null | undefined): Prisma.Decimal {
  const region = getShippingRegion(key);
  if (!region) {
    throw new Error(`Wilayah pengiriman tidak dikenal: ${key ?? "(kosong)"}`);
  }
  return new Prisma.Decimal(region.flatRate);
}
