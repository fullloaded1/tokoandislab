// Data perbandingan harga Daihan Labtech vs e-Katalog — terverifikasi Juli 2026 (REV2, harga naik 15%).
// SATU sumber kebenaran harga 7 model ini: dipakai tabel /pemerintah, kartu produk,
// halaman detail, dan keranjang. JANGAN ubah angka tanpa verifikasi ulang di INAPROC.
export interface EkatalogRow {
  model: string; // nama tampil lengkap
  code: string; // kode model untuk pencocokan ke product.model / product.name
  andislab: string; // harga tampil
  andislabValue: number; // harga numerik (untuk keranjang)
  ekatalog: string;
  hemat: number; // persen
}

export const EKATALOG_ROWS: EkatalogRow[] = [
  { model: "Analog Water Bath LWB-211A", code: "LWB-211A", andislab: "Rp 6.014.700", andislabValue: 6014700, ekatalog: "Rp 9.990.000", hemat: 40 },
  { model: "Dry Block Heater LBH-T02", code: "LBH-T02", andislab: "Rp 8.108.300", andislabValue: 8108300, ekatalog: "Rp 12.210.000", hemat: 34 },
  { model: "Universal Drying Oven LDO-030E", code: "LDO-030E", andislab: "Rp 14.065.300", andislabValue: 14065300, ekatalog: "Rp 21.090.000", hemat: 33 },
  { model: "Universal Drying Oven LDO-060E", code: "LDO-060E", andislab: "Rp 15.686.800", andislabValue: 15686800, ekatalog: "Rp 29.970.000", hemat: 48 },
  { model: "Forced Convection Oven LDO-080F", code: "LDO-080F", andislab: "Rp 24.886.800", andislabValue: 24886800, ekatalog: "Rp 36.630.000", hemat: 32 },
  { model: "CO2 Incubator Air Jacket LCO-165AI", code: "LCO-165AI", andislab: "Rp 95.036.800", andislabValue: 95036800, ekatalog: "Rp 149.850.000", hemat: 37 },
  { model: "Laboratory Freezer LLF-403SR", code: "LLF-403SR", andislab: "Rp 86.446.300", andislabValue: 86446300, ekatalog: "Rp 140.970.000", hemat: 39 },
];

// Cocokkan produk ke baris e-Katalog berdasarkan kode model yang muncul di nama/model.
// HANYA 7 model Daihan di atas yang cocok.
export function getEkatalogRow(...fields: (string | null | undefined)[]): EkatalogRow | null {
  const hay = fields.filter(Boolean).join(" ").toUpperCase();
  for (const row of EKATALOG_ROWS) {
    if (hay.includes(row.code.toUpperCase())) return row;
  }
  return null;
}

// Persen hemat vs e-Katalog, atau null bila bukan salah satu dari 7 model.
export function getEkatalogSavings(...fields: (string | null | undefined)[]): number | null {
  return getEkatalogRow(...fields)?.hemat ?? null;
}
