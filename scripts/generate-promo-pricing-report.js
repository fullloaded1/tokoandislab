const fs = require('fs');
const path = require('path');

const PRODUCTS = [
  // Tier A
  { code: "A-01", name: "pH Meter Benchtop Laboratorium", model: "PH Benchtop", brand: "Standar", normalPrice: 12500000, stock: 5, notes: "" },
  { code: "A-02", name: "Binocular Zoom Stereo Microscope", model: "SZM-6565", brand: "Labex", normalPrice: 18731250, stock: 2, notes: "" },
  { code: "A-03", name: "Mikroskop Trinocular Laboratorium", model: "A33.5121-TH", brand: "Opto Edu", normalPrice: 20000000, stock: 1, notes: "" },
  { code: "A-04", name: "Mikroskop Trinocular Laboratorium", model: "A12.0205-T", brand: "Opto Edu", normalPrice: 22500000, stock: 1, notes: "" },
  { code: "A-05", name: "Linear Shaker Digital Laboratorium", model: "SHK-L710", brand: "Infitek", normalPrice: 25000000, stock: 1, notes: "" },
  { code: "A-06", name: "Rotator Shaker", model: "RT-50N", brand: "Taitec", normalPrice: 25849125, stock: 1, notes: "" },
  { code: "A-07", name: "Scopepad Kamera Mikroskop", model: "LX97", brand: "Labex", normalPrice: 29703750, stock: 4, notes: "" },
  { code: "A-08", name: "Infrared Thermometer", model: "CAL-01", brand: "CAL", normalPrice: 1375000, stock: 3, notes: "" },
  { code: "A-09", name: "Digital Penetration Probe", model: "HI98501", brand: "Hanna Instruments", normalPrice: 2393750, stock: 2, notes: "" },
  { code: "A-10", name: "Vacuum Pump Laboratorium", model: "VE115N", brand: "Value", normalPrice: 2585625, stock: 1, notes: "" },
  { code: "A-11", name: "Colony Counter Digital", model: "CC-J2S", brand: "Infitek", normalPrice: 10000000, stock: 1, notes: "" },
  { code: "A-12", name: "Kursi Donor Medis", model: "Kursi Donor", brand: "AndisLab", normalPrice: 6000000, stock: 1, notes: "Alkes: Perlu izin edar" },
  { code: "A-13", name: "Scrub Station 1 Person", model: "[ISI model]", brand: "AndisLab", normalPrice: 25000000, stock: 1, notes: "VERIFIKASI: model belum ada" },

  // Tier B
  { code: "B-01", name: "Analytical Balance Presisi Laboratorium", model: "BA-N503", brand: "Infitek", normalPrice: 30164000, stock: 1, notes: "" },
  { code: "B-02", name: "Autoclave Sterilisasi Vertikal Otomatis", model: "LAC-1011SV", brand: "Daihan Labtech", normalPrice: 59125000, stock: 2, notes: "" },
  { code: "B-03", name: "Incubator Laboratorium Presisi Jepang", model: "IC413C", brand: "Yamato", normalPrice: 66600000, stock: 1, notes: "" },
  { code: "B-04", name: "Autoclave Vertikal Otomatis Kapasitas Lebih Besar", model: "LAC-1021SV", brand: "Daihan Labtech", normalPrice: 66625000, stock: 2, notes: "" },
  { code: "B-05", name: "Benchtop Conductivity Meter Profesional", model: "510", brand: "Aelab", normalPrice: 37462500, stock: 1, notes: "" },
  { code: "B-06", name: "Pass Box 400 (Cleanroom Transfer Window)", model: "Pass Box 400", brand: "AndisLab", normalPrice: 37500000, stock: 4, notes: "" },
  { code: "B-07", name: "Aluminum Block Bath Dry Thermo Unit", model: "DTU-R", brand: "Taitec", normalPrice: 51458906, stock: 2, notes: "" },
  { code: "B-08", name: "Pharmacy Refrigerator", model: "YC-130L", brand: "Meling", normalPrice: 56250000, stock: 1, notes: "Alkes: Perlu izin edar" },

  // Tier C
  { code: "C-01", name: "Laminar Air Flow (LAF) 1000 Vertikal Custom", model: "LAF 1000 V", brand: "AndisLab", normalPrice: 76250000, stock: 2, notes: "Ready Stock 2 Unit" },
  { code: "C-02", name: "Biosafety Cabinet Kelas II A2 Ukuran Besar", model: "LCB-0123-A2", brand: "Labtech", normalPrice: 87500000, stock: 1, notes: "Ready 1 Unit" },
  { code: "C-03", name: "Medical Laboratory Freezer", model: "LLF-403SR", brand: "Daihan Labtech", normalPrice: 79875000, stock: 3, notes: "Alkes: Perlu izin edar" },
  { code: "C-04", name: "Upright Ultra Low Freezer", model: "LDF-9010U", brand: "Daihan Labtech", normalPrice: 139187500, stock: 2, notes: "" },
  { code: "C-05", name: "Chest Ultra Low Freezer", model: "LDF-9015S", brand: "Daihan Labtech", normalPrice: 143812500, stock: 1, notes: "" },
  { code: "C-06", name: "Upright Ultra Low Freezer Kapasitas Ekstra", model: "LDF-9020U", brand: "Daihan Labtech", normalPrice: 164625000, stock: 1, notes: "" },
  { code: "C-07", name: "Vaccine Refrigerator", model: "LCV-203GR", brand: "Daihan Labtech", normalPrice: 72375000, stock: 1, notes: "Alkes: Perlu izin edar" },
  { code: "C-08", name: "Inkubator CO2 Air Jacket", model: "LCO-065AI", brand: "Daihan Labtech", normalPrice: 79812500, stock: 4, notes: "" },
  { code: "C-09", name: "Autoclave Kapasitas Besar", model: "LAC-50455P", brand: "Labtech", normalPrice: 81250000, stock: 1, notes: "VERIFIKASI: brand dan harga" },
  { code: "C-10", name: "Autoclave Seri Vacuum Drying", model: "1031SV", brand: "Daihan", normalPrice: 82060000, stock: 3, notes: "VERIFIKASI: brand dan harga" },
  { code: "C-11", name: "Autoclave Seri Vacuum Drying", model: "1031SVF", brand: "Daihan", normalPrice: 87310000, stock: 1, notes: "VERIFIKASI: brand dan harga" },
  { code: "C-12", name: "Drying Oven Yamato", model: "DKN413C", brand: "Yamato", normalPrice: 84490000, stock: 1, notes: "" },
  { code: "C-13", name: "Pass Box Dynamic", model: "Dynamic", brand: "AndisLab", normalPrice: 87500000, stock: 1, notes: "" },
  { code: "C-14", name: "Water Purificator", model: "Expe-CB", brand: "Puris", normalPrice: 162500000, stock: 1, notes: "" },
];

function calculateFloorPrice(price, discountPct) {
  const discounted = price * (1 - discountPct / 100);
  return Math.floor(discounted / 1000) * 1000;
}

const csvRows = [
  [
    "Kode",
    "Produk",
    "Model",
    "Brand",
    "Stok",
    "Harga Normal (Rp)",
    "Modal (Rp)",
    "Diskon (%)",
    "Harga Promo (Rp)",
    "Margin (%)",
    "Zona",
    "Status Publikasi",
    "Catatan"
  ].join(",")
];

for (const p of PRODUCTS) {
  // Sesuai aturan Fase 0: Modal belum diisi -> Mode Tanpa Diskon Publik
  const modal = "[ISI]";
  const diskon = 0;
  const promoPrice = "-";
  const margin = "-";
  const zone = "missing_cost";
  const status = "review"; // Tanpa modal -> status review (tampil harga normal di publik)

  const row = [
    `"${p.code}"`,
    `"${p.name}"`,
    `"${p.model}"`,
    `"${p.brand}"`,
    p.stock,
    p.normalPrice,
    `"${modal}"`,
    diskon,
    `"${promoPrice}"`,
    `"${margin}"`,
    `"${zone}"`,
    `"${status}"`,
    `"${p.notes}"`
  ];
  csvRows.push(row.join(","));
}

const outPath = path.join(__dirname, "..", "reports", "promo-pricing.csv");
fs.writeFileSync(outPath, csvRows.join("\n"), "utf-8");
console.log(`Generated ${csvRows.length - 1} rows to ${outPath}`);
