export type Category = "instrumen" | "furnitur" | "reagen" | "consumable";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  categoryLabel: string;
  image: string;
  description: string;
  specs: ProductSpec[];
  relatedSlugs: string[];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  instrumen: "Instrumen Analitik",
  furnitur: "Furnitur Laboratorium",
  reagen: "Reagen & Bahan Kimia",
  consumable: "Consumable & Aksesoris",
};

export const products: Product[] = [
  {
    id: "1",
    slug: "spektrofotometer-uv-vis",
    name: "Spektrofotometer UV-Vis",
    category: "instrumen",
    categoryLabel: "Instrumen Analitik",
    image: "https://picsum.photos/id/60/800/800",
    description:
      "Spektrofotometer UV-Vis presisi tinggi untuk analisis kuantitatif dan kualitatif di laboratorium penelitian dan industri. Dilengkapi detektor ganda, software analisis data terintegrasi, dan rentang panjang gelombang 190–1100 nm. Cocok untuk farmasi, lingkungan, dan riset biokimia.",
    specs: [
      { label: "Merk", value: "Shimadzu" },
      { label: "Model", value: "UV-1900i" },
      { label: "Asal", value: "Jepang" },
      { label: "Rentang Panjang Gelombang", value: "190–1100 nm" },
      { label: "Bandwidth", value: "1 nm" },
      { label: "Akurasi", value: "±0.002 Abs" },
      { label: "Detektor", value: "Silicon Photodiode" },
      { label: "Berat", value: "12 kg" },
    ],
    relatedSlugs: ["reagen-hplc-grade", "kuvet-kuarsa-set", "centrifuge-5000-rpm"],
  },
  {
    id: "2",
    slug: "laminar-flow-hood",
    name: "Laminar Flow Hood",
    category: "furnitur",
    categoryLabel: "Furnitur Laboratorium",
    image: "https://picsum.photos/id/24/800/800",
    description:
      "Laminar Flow Hood kelas II tipe A2 untuk lingkungan kerja steril dan perlindungan operator. Filter HEPA 99.99% efisiensi, aliran udara vertikal, dilengkapi lampu UV dan fluorescent. Ideal untuk laboratorium mikrobiologi, kultur jaringan, dan farmasi.",
    specs: [
      { label: "Merk", value: "Esco" },
      { label: "Model", value: "Airstream Gen 3" },
      { label: "Asal", value: "Singapura" },
      { label: "Kelas", value: "II Tipe A2" },
      { label: "Filter", value: "HEPA 99.99%" },
      { label: "Lebar Kerja", value: "1200 mm" },
      { label: "Kebisingan", value: "< 58 dB" },
      { label: "Berat", value: "180 kg" },
    ],
    relatedSlugs: ["incubator-37c", "micropipette-set", "reagen-hplc-grade"],
  },
  {
    id: "3",
    slug: "centrifuge-5000-rpm",
    name: "Centrifuge 5000 RPM",
    category: "instrumen",
    categoryLabel: "Instrumen Analitik",
    image: "https://picsum.photos/id/119/800/800",
    description:
      "Centrifuge laboratorium kompak dengan kecepatan maksimum 5000 RPM dan kapasitas 12 tabung. Dilengkapi timer digital, sistem keselamatan tutup otomatis, serta rotor sudut tetap. Ideal untuk pemisahan sampel darah, urine, dan suspensi sel.",
    specs: [
      { label: "Merk", value: "Hettich" },
      { label: "Model", value: "EBA 200" },
      { label: "Asal", value: "Jerman" },
      { label: "Kecepatan Maks", value: "5000 RPM" },
      { label: "RCF Maks", value: "3461 × g" },
      { label: "Kapasitas", value: "12 × 15 ml" },
      { label: "Timer", value: "0–30 menit + continuous" },
      { label: "Berat", value: "6.5 kg" },
    ],
    relatedSlugs: ["spektrofotometer-uv-vis", "micropipette-set", "tabung-reaksi-borosilikat"],
  },
  {
    id: "4",
    slug: "incubator-37c",
    name: "Incubator 37°C",
    category: "instrumen",
    categoryLabel: "Instrumen Analitik",
    image: "https://picsum.photos/id/180/800/800",
    description:
      "Incubator laboratorium berkapasitas 50 liter dengan kontrol suhu presisi ±0.1°C. Interior stainless steel, sirkulasi udara natural convection, dan display digital. Ideal untuk kultur mikroba, inkubasi enzim, dan pengujian stabilitas.",
    specs: [
      { label: "Merk", value: "Memmert" },
      { label: "Model", value: "IN55" },
      { label: "Asal", value: "Jerman" },
      { label: "Suhu Maks", value: "80°C" },
      { label: "Akurasi Suhu", value: "±0.1°C" },
      { label: "Kapasitas", value: "53 liter" },
      { label: "Interior", value: "Stainless Steel 304" },
      { label: "Berat", value: "38 kg" },
    ],
    relatedSlugs: ["laminar-flow-hood", "reagen-hplc-grade", "centrifuge-5000-rpm"],
  },
  {
    id: "5",
    slug: "reagen-hplc-grade",
    name: "Reagen HPLC Grade",
    category: "reagen",
    categoryLabel: "Reagen & Bahan Kimia",
    image: "https://picsum.photos/id/30/800/800",
    description:
      "Reagen kualitas HPLC Grade (Methanol, Acetonitrile, Water) untuk analisis kromatografi presisi tinggi. Kemurnian ≥99.9%, partikulat rendah, dan UV cutoff rendah. Dikemas dalam botol amber 2.5 liter dengan sertifikat analisis.",
    specs: [
      { label: "Merk", value: "Merck (Supelco)" },
      { label: "Grade", value: "HPLC Gradient" },
      { label: "Asal", value: "Jerman" },
      { label: "Kemurnian", value: "≥99.9%" },
      { label: "Volume", value: "2.5 L" },
      { label: "UV Cutoff", value: "190 nm" },
      { label: "Kemasan", value: "Botol Amber" },
      { label: "Sertifikasi", value: "CoA tersedia" },
    ],
    relatedSlugs: ["spektrofotometer-uv-vis", "kuvet-kuarsa-set", "tabung-reaksi-borosilikat"],
  },
  {
    id: "6",
    slug: "micropipette-set",
    name: "Micropipette Set",
    category: "consumable",
    categoryLabel: "Consumable & Aksesoris",
    image: "https://picsum.photos/id/96/800/800",
    description:
      "Set micropipette adjustable 3 ukuran (0.5–10 µl, 10–100 µl, 100–1000 µl) dengan akurasi tinggi dan ergonomis. Autoclavable, dilengkapi tip ejector, dan kompatibel dengan universal tips. Cocok untuk biologi molekuler dan analisis klinis.",
    specs: [
      { label: "Merk", value: "Eppendorf" },
      { label: "Model", value: "Research Plus" },
      { label: "Asal", value: "Jerman" },
      { label: "Volume", value: "0.5–10 / 10–100 / 100–1000 µl" },
      { label: "Akurasi", value: "±0.6–1.0%" },
      { label: "Autoclavable", value: "Ya, 121°C" },
      { label: "Isi Set", value: "3 pipette + stand" },
      { label: "Berat", value: "0.3 kg" },
    ],
    relatedSlugs: ["laminar-flow-hood", "centrifuge-5000-rpm", "reagen-hplc-grade"],
  },
  {
    id: "7",
    slug: "kuvet-kuarsa-set",
    name: "Kuvet Kuarsa Set",
    category: "consumable",
    categoryLabel: "Consumable & Aksesoris",
    image: "https://picsum.photos/id/175/800/800",
    description:
      "Set kuvet kuarsa UV 2 pasang (4 buah) dengan path length 10 mm. Transparansi tinggi pada rentang UV-Vis (200–2500 nm), dinding halus optik, dan tahan terhadap asam kuat. Cocok untuk spektrofotometri.",
    specs: [
      { label: "Merk", value: "Hellma" },
      { label: "Model", value: "100-QS" },
      { label: "Asal", value: "Jerman" },
      { label: "Material", value: "Quartz Suprasil" },
      { label: "Path Length", value: "10 mm" },
      { label: "Rentang", value: "200–2500 nm" },
      { label: "Isi", value: "4 buah (2 pasang)" },
      { label: "Volume", value: "3.5 ml" },
    ],
    relatedSlugs: ["spektrofotometer-uv-vis", "reagen-hplc-grade", "tabung-reaksi-borosilikat"],
  },
  {
    id: "8",
    slug: "tabung-reaksi-borosilikat",
    name: "Tabung Reaksi Borosilikat",
    category: "consumable",
    categoryLabel: "Consumable & Aksesoris",
    image: "https://picsum.photos/id/225/800/800",
    description:
      "Tabung reaksi dari kaca borosilikat 3.3 dengan ketahanan termal tinggi dan ketahanan kimia yang unggul. Tersedia dalam ukuran 16×150 mm, dijual per box (100 pcs). Ideal untuk reaksi kimia, kultur bakteri, dan penyimpanan sampel.",
    specs: [
      { label: "Merk", value: "Duran (Schott)" },
      { label: "Material", value: "Borosilikat 3.3" },
      { label: "Asal", value: "Jerman" },
      { label: "Ukuran", value: "16 × 150 mm" },
      { label: "Volume", value: "~20 ml" },
      { label: "Ketahanan Suhu", value: "500°C" },
      { label: "Isi/Box", value: "100 pcs" },
      { label: "Tipe Mulut", value: "Rim (tanpa tutup)" },
    ],
    relatedSlugs: ["centrifuge-5000-rpm", "reagen-hplc-grade", "kuvet-kuarsa-set"],
  },
  {
    id: "9",
    slug: "ph-meter-digital",
    name: "pH Meter Digital",
    category: "instrumen",
    categoryLabel: "Instrumen Analitik",
    image: "https://picsum.photos/id/201/800/800",
    description:
      "pH meter digital benchtop dengan layar LCD besar, kalibrasi otomatis 3 titik, dan kompensasi suhu otomatis (ATC). Dilengkapi elektroda gel kombinasi yang tahan lama. Ideal untuk QC air, laboratorium lingkungan, dan industri F&B.",
    specs: [
      { label: "Merk", value: "Hanna Instruments" },
      { label: "Model", value: "HI2020-01" },
      { label: "Asal", value: "Italia / Romania" },
      { label: "Rentang pH", value: "0.00–14.00" },
      { label: "Resolusi", value: "0.01 pH" },
      { label: "Akurasi", value: "±0.01 pH" },
      { label: "Kalibrasi", value: "Otomatis 3 titik" },
      { label: "Berat", value: "0.8 kg" },
    ],
    relatedSlugs: ["spektrofotometer-uv-vis", "reagen-hplc-grade", "incubator-37c"],
  },
  {
    id: "10",
    slug: "meja-laboratorium-island",
    name: "Meja Laboratorium Island Bench",
    category: "furnitur",
    categoryLabel: "Furnitur Laboratorium",
    image: "https://picsum.photos/id/164/800/800",
    description:
      "Meja laboratorium island bench premium dengan top epoxy resin tahan asam dan basa. Rangka baja powder-coated, laci dan kabinet terintegrasi, serta rak reagen atas. Dirancang untuk laboratorium kimia, riset, dan pendidikan.",
    specs: [
      { label: "Merk", value: "LabFab" },
      { label: "Material Top", value: "Epoxy Resin 25 mm" },
      { label: "Asal", value: "Indonesia" },
      { label: "Dimensi", value: "3000 × 1500 × 850 mm" },
      { label: "Rangka", value: "Baja Powder Coated" },
      { label: "Ketahanan Kimia", value: "Tahan asam/basa" },
      { label: "Fitur", value: "Laci + Kabinet + Rak Reagen" },
      { label: "Garansi", value: "5 tahun" },
    ],
    relatedSlugs: ["laminar-flow-hood", "incubator-37c", "tabung-reaksi-borosilikat"],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(slugs: string[]): Product[] {
  return products.filter((p) => slugs.includes(p.slug));
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter((p) => p.category === category);
}

export function searchProducts(query: string): Product[] {
  const lower = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.categoryLabel.toLowerCase().includes(lower)
  );
}
