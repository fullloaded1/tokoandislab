export type Category = "lovibond" | "daihan-labtech" | "pyrex" | "andislab-custom";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  price: number;
  id: string;
  slug: string;
  name: string;
  category: Category;
  categoryLabel: string;
  brand: string;
  model: string;
  subcategory: string;
  image: string;
  description: string;
  specs: ProductSpec[];
  relatedSlugs: string[];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  "lovibond": "Lovibond",
  "daihan-labtech": "Daihan Labtech",
  "pyrex": "Pyrex®",
  "andislab-custom": "Andislab Custom",
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  "lovibond": "Kebutuhan pengujian kualitas air industri, laboratorium, lingkungan, dan water treatment berkualitas dari Lovibond®.",
  "daihan-labtech": "General peralatan laboratorium umum yang sering dipakai. Magnetic stirrer, hotplate, sentrifuge, dan peralatan umum laboratorium.",
  "pyrex": "Peralatan kaca borosilicate berkualitas tinggi: beaker, Erlenmeyer, labu ukur, pipet, dan kelengkapan glassware lab.",
  "andislab-custom": "Custom lab dan furniture fabrikasi meja lab, lemari penyimpanan, fume hood, wet scrubber standar keamanan internasional.",
};


export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export const products: Product[] = [
  // ==================== LOVIBOND ====================
  {
    id: "1",
    slug: "kabinet-termostatik-bod",
    name: "Kabinet Termostatik BOD",
    category: "lovibond",
    categoryLabel: "Lovibond",
    brand: "Lovibond",
    model: "BOD",
    subcategory: "Uji Kualitas Air",
    image: "https://andislabs.com/images/products/bod_incubator_1780382189257.png",
    price: 35000000,
    description:
      "Kabinet Termostatik BOD dari Lovibond untuk keperluan pengeraman BOD (Biochemical Oxygen Demand) pada suhu presisi. Dirancang untuk pengujian kualitas air industri, laboratorium lingkungan, dan water treatment. Dilengkapi kontrol suhu digital presisi tinggi dan kapasitas besar untuk multiple sampel.",
    specs: [
      { label: "Merk", value: "Lovibond" },
      { label: "Model", value: "BOD" },
      { label: "Aplikasi", value: "Pengeraman BOD" },
      { label: "Kontrol Suhu", value: "Digital Presisi" },
      { label: "Kapasitas", value: "Multiple Sampel" },
      { label: "Sertifikasi", value: "CE Certified" },
    ],
    relatedSlugs: ["thermoreactor-rd-125", "seri-handheld-sd", "kit-uji-air-pendingin"],
  },
  {
    id: "2",
    slug: "thermoreactor-rd-125",
    name: "Thermoreactor RD 125",
    category: "lovibond",
    categoryLabel: "Lovibond",
    brand: "Lovibond",
    model: "RD 125",
    subcategory: "Reaktor Termal",
    image: "https://andislabs.com/images/products/thermoreactor_1780382212554.png",
    price: 28000000,
    description:
      "Thermoreaktor RD 125 dari Lovibond untuk analisis COD (Chemical Oxygen Demand) air industri. Alat ini dirancang untuk pemanasan dan digesti sampel dengan suhu terkontrol. Dilengkapi blok pemanas aluminium dengan kapasitas 25 tabung reaksi dan kontrol temperatur digital.",
    specs: [
      { label: "Merk", value: "Lovibond" },
      { label: "Model", value: "RD 125" },
      { label: "Aplikasi", value: "Analisis COD" },
      { label: "Kapasitas", value: "25 tabung" },
      { label: "Suhu", value: "Hingga 170°C" },
      { label: "Timer", value: "Digital" },
    ],
    relatedSlugs: ["kabinet-termostatik-bod", "floc-tester-et-730", "seri-handheld-sd"],
  },
  {
    id: "3",
    slug: "seri-handheld-sd",
    name: "Seri Handheld SD",
    category: "lovibond",
    categoryLabel: "Lovibond",
    brand: "Lovibond",
    model: "SD Series",
    subcategory: "Portabel Meter",
    image: "https://andislabs.com/images/products/handheld_meter_1780382231708.png",
    price: 8500000,
    description:
      "Meter portabel Seri Handheld SD dari Lovibond untuk pengukuran pH, DO (Dissolved Oxygen), dan Konduktivitas. Dirancang untuk penggunaan di lapangan maupun laboratorium. Desain ergonomis, tahan air (IP67), dan dilengkapi display LCD besar dengan backlighting.",
    specs: [
      { label: "Merk", value: "Lovibond" },
      { label: "Model", value: "SD Series" },
      { label: "Parameter", value: "pH, DO, Konduktivitas" },
      { label: "Proteksi", value: "IP67 Waterproof" },
      { label: "Display", value: "LCD Backlit" },
      { label: "Baterai", value: "Rechargeable" },
    ],
    relatedSlugs: ["kabinet-termostatik-bod", "kit-uji-air-pendingin", "thermoreactor-rd-125"],
  },
  {
    id: "4",
    slug: "floc-tester-et-730",
    name: "Floc Tester ET 730",
    category: "lovibond",
    categoryLabel: "Lovibond",
    brand: "Lovibond",
    model: "ET 730",
    subcategory: "Flokulator",
    image: "https://andislabs.com/images/products/floc_tester_1780382246017.png",
    price: 21000000,
    description:
      "Alat Jar Test Floc Tester ET 730 dari Lovibond. Dirancang untuk simulasi proses koagulasi dan flokulasi dalam pengolahan air. Dilengkapi 6 paddle stirrer dengan kontrol kecepatan independen, timer digital, dan pencahayaan LED untuk observasi flok.",
    specs: [
      { label: "Merk", value: "Lovibond" },
      { label: "Model", value: "ET 730" },
      { label: "Jumlah Paddle", value: "6 unit" },
      { label: "Kecepatan", value: "10–300 RPM" },
      { label: "Pencahayaan", value: "LED Terintegrasi" },
      { label: "Timer", value: "Digital" },
    ],
    relatedSlugs: ["thermoreactor-rd-125", "kit-uji-air-pendingin", "seri-handheld-sd"],
  },
  {
    id: "5",
    slug: "kit-uji-air-pendingin",
    name: "Kit Uji Air Pendingin",
    category: "lovibond",
    categoryLabel: "Lovibond",
    brand: "Lovibond",
    model: "Cooling Water",
    subcategory: "Test Kit",
    image: "https://andislabs.com/images/products/test_kit_1780382258811.png",
    price: 1500000,
    description:
      "Perlengkapan komplit Kit Uji Air Pendingin dari Lovibond untuk pengujian cepat parameter air pendingin (cooling water). Termasuk reagen uji, tabung sampel, dan color comparator. Cocok untuk monitoring kualitas air di sistem HVAC, cooling tower, dan chiller industri.",
    specs: [
      { label: "Merk", value: "Lovibond" },
      { label: "Model", value: "Cooling Water Kit" },
      { label: "Jenis", value: "Test Kit Komplit" },
      { label: "Aplikasi", value: "Cooling Water" },
      { label: "Parameter", value: "Multi-parameter" },
      { label: "Metode", value: "Colorimetric" },
    ],
    relatedSlugs: ["seri-handheld-sd", "kabinet-termostatik-bod", "floc-tester-et-730"],
  },

  // ==================== DAIHAN LABTECH ====================
  {
    id: "6",
    slug: "incubator-oven-do-150f",
    name: "Incubator Oven DO-150F",
    category: "daihan-labtech",
    categoryLabel: "Daihan Labtech",
    brand: "Daihan Labtech",
    model: "DO-150F",
    subcategory: "Oven & Incubator",
    image: "https://andislabs.com/images/products/incubator_oven_1780381906452.png",
    price: 18000000,
    description:
      "Incubator Oven DO-150F dari Daihan Labtech berkualitas tinggi untuk keperluan laboratorium. Dilengkapi forced convection untuk distribusi panas merata, kontrol suhu PID digital, dan interior stainless steel. Ideal untuk pengeringan, sterilisasi, dan inkubasi sampel.",
    specs: [
      { label: "Merk", value: "Daihan Labtech" },
      { label: "Model", value: "DO-150F" },
      { label: "Jenis", value: "Forced Convection" },
      { label: "Suhu Maks", value: "250°C" },
      { label: "Kapasitas", value: "150 Liter" },
      { label: "Interior", value: "Stainless Steel" },
      { label: "Kontrol", value: "PID Digital" },
    ],
    relatedSlugs: ["centrifuge-cf-10", "hotplate-hp-300", "water-bath-wb-22"],
  },
  {
    id: "7",
    slug: "centrifuge-cf-10",
    name: "Centrifuge CF-10",
    category: "daihan-labtech",
    categoryLabel: "Daihan Labtech",
    brand: "Daihan Labtech",
    model: "CF-10",
    subcategory: "Centrifuge",
    image: "https://andislabs.com/images/products/centrifuge_1780382108972.png",
    price: 22500000,
    description:
      "Centrifuge CF-10 dari Daihan Labtech, centrifuge handal untuk pemisahan sampel cair. Dilengkapi rotor sudut tetap, sistem keselamatan tutup otomatis, timer digital, dan kecepatan variabel. Cocok untuk laboratorium klinis, penelitian, dan industri.",
    specs: [
      { label: "Merk", value: "Daihan Labtech" },
      { label: "Model", value: "CF-10" },
      { label: "Kecepatan Maks", value: "10.000 RPM" },
      { label: "Rotor", value: "Sudut Tetap" },
      { label: "Kapasitas", value: "12 × 15 ml" },
      { label: "Timer", value: "Digital" },
      { label: "Safety", value: "Auto Lock Lid" },
    ],
    relatedSlugs: ["incubator-oven-do-150f", "hotplate-hp-300", "water-bath-wb-22"],
  },
  {
    id: "8",
    slug: "hotplate-hp-300",
    name: "Hotplate",
    category: "daihan-labtech",
    categoryLabel: "Daihan Labtech",
    brand: "Daihan Labtech",
    model: "HP-300",
    subcategory: "Pemanas",
    image: "https://andislabs.com/images/products/hotplate_1780382145396.png",
    price: 4200000,
    description:
      "Hotplate HP-300 dari Daihan Labtech, pemanas plat untuk berbagai preparasi laboratorium. Permukaan pemanas keramik berlapis anti korosi, kontrol suhu digital, dan desain kompak. Ideal untuk pemanasan sampel, penguapan pelarut, dan preparasi kimia.",
    specs: [
      { label: "Merk", value: "Daihan Labtech" },
      { label: "Model", value: "HP-300" },
      { label: "Permukaan", value: "Keramik Anti Korosi" },
      { label: "Suhu Maks", value: "380°C" },
      { label: "Ukuran Plat", value: "300 × 300 mm" },
      { label: "Kontrol", value: "Digital PID" },
    ],
    relatedSlugs: ["incubator-oven-do-150f", "centrifuge-cf-10", "water-bath-wb-22"],
  },
  {
    id: "9",
    slug: "water-bath-wb-22",
    name: "Water Bath",
    category: "daihan-labtech",
    categoryLabel: "Daihan Labtech",
    brand: "Daihan Labtech",
    model: "WB-22",
    subcategory: "Pemanas",
    image: "https://andislabs.com/images/products/water_bath_1780382174865.png",
    price: 6500000,
    description:
      "Water Bath WB-22 dari Daihan Labtech, penangas air dengan pengaturan digital presisi. Interior stainless steel anti korosi, tutup berengsel dengan lubang ring, dan kontrol suhu PID. Cocok untuk inkubasi sampel, pencairan, dan reaksi enzimatis.",
    specs: [
      { label: "Merk", value: "Daihan Labtech" },
      { label: "Model", value: "WB-22" },
      { label: "Kapasitas", value: "22 Liter" },
      { label: "Suhu Maks", value: "100°C" },
      { label: "Akurasi", value: "±0.2°C" },
      { label: "Interior", value: "Stainless Steel" },
      { label: "Kontrol", value: "PID Digital" },
    ],
    relatedSlugs: ["incubator-oven-do-150f", "centrifuge-cf-10", "hotplate-hp-300"],
  },

  // ==================== PYREX ====================
  {
    id: "10",
    slug: "gelas-piala-beaker-250ml",
    name: "Gelas Piala (Beaker) 250ml",
    category: "pyrex",
    categoryLabel: "Pyrex®",
    brand: "Pyrex®",
    model: "Pyrex 1000",
    subcategory: "Gelas Lab",
    image: "https://andislabs.com/images/products/beaker_1780382271924.png",
    price: 125000,
    description:
      "Gelas Piala (Beaker) 250ml dari Pyrex® dengan standar borosilicate tinggi. Tahan terhadap perubahan suhu ekstrem, bahan kimia korosif, dan benturan ringan. Dilengkapi skala pengukuran yang jelas dan spout untuk kemudahan penuangan. Ideal untuk pencampuran, pemanasan, dan penyimpanan larutan.",
    specs: [
      { label: "Merk", value: "Pyrex®" },
      { label: "Model", value: "Pyrex 1000" },
      { label: "Volume", value: "250 ml" },
      { label: "Material", value: "Borosilicate Glass 3.3" },
      { label: "Ketahanan Suhu", value: "500°C" },
      { label: "Fitur", value: "Graduated, Spout" },
    ],
    relatedSlugs: ["labu-erlenmeyer-250ml", "labu-takar-volumetrik-250ml", "silinder-ukur"],
  },
  {
    id: "11",
    slug: "labu-erlenmeyer-250ml",
    name: "Labu Erlenmeyer 250ml",
    category: "pyrex",
    categoryLabel: "Pyrex®",
    brand: "Pyrex®",
    model: "Pyrex 4980",
    subcategory: "Gelas Lab",
    image: "/images/products/pyrex-erlenmeyer.jpeg",
    price: 150000,
    description:
      "Labu Erlenmeyer 250ml dari Pyrex®, desain klasik untuk titrasi dan pencampuran larutan kimia. Bentuk kerucut dengan leher sempit mencegah tumpahan dan penguapan berlebih. Material borosilicate glass tahan panas dan kimia. Tersedia dalam berbagai ukuran.",
    specs: [
      { label: "Merk", value: "Pyrex®" },
      { label: "Model", value: "Pyrex 4980" },
      { label: "Volume", value: "250 ml" },
      { label: "Material", value: "Borosilicate Glass 3.3" },
      { label: "Tipe", value: "Narrow Neck" },
      { label: "Aplikasi", value: "Titrasi & Pencampuran" },
    ],
    relatedSlugs: ["gelas-piala-beaker-250ml", "labu-takar-volumetrik-250ml", "pipet-ukur"],
  },
  {
    id: "12",
    slug: "labu-takar-volumetrik-250ml",
    name: "Labu Takar (Volumetrik) 250ml",
    category: "pyrex",
    categoryLabel: "Pyrex®",
    brand: "Pyrex®",
    model: "Pyrex Vol",
    subcategory: "Gelas Ukur",
    image: "/images/products/labu-takar-placeholder.png",
    price: 320000,
    description:
      "Labu Takar Volumetrik 250ml dari Pyrex® dengan keakuratan tinggi Class A. Dirancang untuk preparasi larutan standar dan pengenceran presisi. Dilengkapi stopper kaca dan tanda batas yang jelas. Material borosilicate glass tahan termal dan kimia.",
    specs: [
      { label: "Merk", value: "Pyrex®" },
      { label: "Model", value: "Pyrex Vol" },
      { label: "Volume", value: "250 ml" },
      { label: "Kelas", value: "Class A" },
      { label: "Material", value: "Borosilicate Glass 3.3" },
      { label: "Stopper", value: "Glass Stopper" },
    ],
    relatedSlugs: ["gelas-piala-beaker-250ml", "silinder-ukur", "pipet-ukur"],
  },
  {
    id: "13",
    slug: "silinder-ukur",
    name: "Silinder Ukur (Measuring Cylinder)",
    category: "pyrex",
    categoryLabel: "Pyrex®",
    brand: "Pyrex®",
    model: "Pyrex MC",
    subcategory: "Gelas Ukur",
    image: "/images/products/pyrex-cylinder.jpeg",
    price: 180000,
    description:
      "Silinder Ukur (Measuring Cylinder) dari Pyrex® untuk pengukuran volume cairan rutin di laboratorium. Skala berskala presisi dengan graduation jelas, dasar heksagonal anti-roll, dan material borosilicate glass. Tersedia dalam berbagai kapasitas.",
    specs: [
      { label: "Merk", value: "Pyrex®" },
      { label: "Model", value: "Pyrex MC" },
      { label: "Material", value: "Borosilicate Glass 3.3" },
      { label: "Dasar", value: "Hexagonal Anti-Roll" },
      { label: "Skala", value: "White Enamel" },
      { label: "Kelas", value: "Class A" },
    ],
    relatedSlugs: ["gelas-piala-beaker-250ml", "labu-takar-volumetrik-250ml", "pipet-ukur"],
  },
  {
    id: "14",
    slug: "pipet-ukur",
    name: "Pipet Ukur",
    category: "pyrex",
    categoryLabel: "Pyrex®",
    brand: "Pyrex®",
    model: "Pyrex Pipette",
    subcategory: "Pipet",
    image: "/images/products/pipet-ukur-placeholder.png",
    price: 250000,
    description:
      "Pipet Ukur dari Pyrex® untuk transfer cairan dengan akurasi tinggi. Graduation presisi, material borosilicate glass, dan ujung runcing untuk dispensing tepat. Kompatibel dengan pipette filler standar. Tersedia dalam berbagai volume.",
    specs: [
      { label: "Merk", value: "Pyrex®" },
      { label: "Model", value: "Pyrex Pipette" },
      { label: "Material", value: "Borosilicate Glass 3.3" },
      { label: "Tipe", value: "Graduated (Mohr)" },
      { label: "Kelas", value: "Class A/AS" },
      { label: "Sertifikasi", value: "ISO 835" },
    ],
    relatedSlugs: ["gelas-piala-beaker-250ml", "labu-erlenmeyer-250ml", "silinder-ukur"],
  },

  // ==================== ANDISLAB CUSTOM ====================
  {
    id: "15",
    slug: "lemari-penyimpanan-korosif",
    name: "Lemari Penyimpanan Korosif Bahan Kimia",
    category: "andislab-custom",
    categoryLabel: "Andislab Custom",
    brand: "Andis Lab",
    model: "ALC-Corrosive",
    subcategory: "Lemari Penyimpanan",
    image: "/images/products/corrosive-storage.jpeg",
    price: 45000000,
    description:
      "Lemari Penyimpanan Korosif dari Andislab Custom, dirancang khusus untuk penyimpanan bahan kimia korosif seperti asam dan basa pekat. Material polypropylene (PP) tahan korosi, dilengkapi sistem ventilasi, perangkap tumpahan, dan kunci pengaman. Memenuhi standar keamanan internasional.",
    specs: [
      { label: "Merk", value: "Andis Lab" },
      { label: "Model", value: "ALC-Corrosive" },
      { label: "Material", value: "Polypropylene (PP)" },
      { label: "Ventilasi", value: "Terintegrasi" },
      { label: "Keamanan", value: "Kunci Pengaman" },
      { label: "Standar", value: "OSHA Compliant" },
    ],
    relatedSlugs: ["lemari-penyimpanan-mudah-terbakar", "lemari-asam-fume-hood", "wet-scrubber"],
  },
  {
    id: "16",
    slug: "lemari-penyimpanan-mudah-terbakar",
    name: "Lemari Penyimpanan Mudah Terbakar",
    category: "andislab-custom",
    categoryLabel: "Andislab Custom",
    brand: "Andis Lab",
    model: "ALC-Flammable",
    subcategory: "Lemari Penyimpanan",
    image: "/images/products/flammable-storage.jpeg",
    price: 55000000,
    description:
      "Lemari Penyimpanan Mudah Terbakar dari Andislab Custom untuk menyimpan bahan kimia flammable secara aman. Konstruksi baja lapis ganda dengan isolasi tahan api, dilengkapi grounding wire, self-closing door, dan perangkap tumpahan. Memenuhi standar NFPA 30 dan OSHA.",
    specs: [
      { label: "Merk", value: "Andis Lab" },
      { label: "Model", value: "ALC-Flammable" },
      { label: "Material", value: "Baja Lapis Ganda" },
      { label: "Pintu", value: "Self-Closing" },
      { label: "Grounding", value: "Wire Tersedia" },
      { label: "Standar", value: "NFPA 30 / OSHA" },
    ],
    relatedSlugs: ["lemari-penyimpanan-korosif", "lemari-asam-fume-hood", "wet-scrubber"],
  },
  {
    id: "17",
    slug: "flokulator-portabel-fb-4s",
    name: "Flokulator Portabel FB-4S",
    category: "andislab-custom",
    categoryLabel: "Andislab Custom",
    brand: "Andis Lab",
    model: "FB-4S",
    subcategory: "Peralatan Uji",
    image: "/images/products/flokulator.png",
    price: 12000000,
    description:
      "Flokulator Portabel FB-4S dari Andislab untuk simulasi jar test portabel di lapangan. Desain ringkas dan mudah dibawa, dilengkapi 4 paddle stirrer dengan kontrol kecepatan variabel. Ideal untuk pengujian kualitas air di lokasi proyek water treatment.",
    specs: [
      { label: "Merk", value: "Andis Lab" },
      { label: "Model", value: "FB-4S" },
      { label: "Jumlah Paddle", value: "4 unit" },
      { label: "Kecepatan", value: "Variabel" },
      { label: "Desain", value: "Portabel" },
      { label: "Aplikasi", value: "Jar Test Lapangan" },
    ],
    relatedSlugs: ["lemari-penyimpanan-korosif", "lemari-asam-fume-hood", "wet-scrubber"],
  },
  {
    id: "18",
    slug: "lemari-asam-fume-hood",
    name: "Lemari Asam (Fume Hood) FH",
    category: "andislab-custom",
    categoryLabel: "Andislab Custom",
    brand: "Andis Lab",
    model: "FH Series",
    subcategory: "Fume Hood",
    image: "/images/products/fume-hood.jpeg",
    price: 65000000,
    description:
      "Lemari Asam (Fume Hood) seri FH dari Andislab Custom dengan standar keamanan internasional. Dirancang untuk melindungi operator dari paparan uap kimia berbahaya. Dilengkapi sash kaca tempered, blower exhaust, baffle adjustable, dan workspace keramik tahan asam. Custom size tersedia.",
    specs: [
      { label: "Merk", value: "Andis Lab" },
      { label: "Model", value: "FH Series" },
      { label: "Sash", value: "Kaca Tempered" },
      { label: "Blower", value: "Exhaust Terintegrasi" },
      { label: "Worktop", value: "Keramik Tahan Asam" },
      { label: "Custom", value: "Ukuran Bisa Disesuaikan" },
    ],
    relatedSlugs: ["lemari-penyimpanan-korosif", "wet-scrubber", "lemari-penyimpanan-mudah-terbakar"],
  },
  {
    id: "19",
    slug: "wet-scrubber",
    name: "Wet Scrubber Anti Pencemaran",
    category: "andislab-custom",
    categoryLabel: "Andislab Custom",
    brand: "Andis Lab",
    model: "WS Series",
    subcategory: "Pengolahan Udara",
    image: "/images/products/wet-scrubber.jpeg",
    price: 72000000,
    description:
      "Wet Scrubber Anti Pencemaran dari Andislab Custom untuk menangkap dan menetralisir gas buang berbahaya dari laboratorium. Menggunakan prinsip scrubbing air untuk menyerap partikulat dan gas korosif sebelum dibuang ke atmosfer. Material PP/PVC tahan korosi, efisiensi tinggi.",
    specs: [
      { label: "Merk", value: "Andis Lab" },
      { label: "Model", value: "WS Series" },
      { label: "Material", value: "PP / PVC Anti Korosi" },
      { label: "Prinsip", value: "Water Scrubbing" },
      { label: "Efisiensi", value: "> 95%" },
      { label: "Custom", value: "Kapasitas Disesuaikan" },
    ],
    relatedSlugs: ["lemari-asam-fume-hood", "lemari-penyimpanan-korosif", "lemari-penyimpanan-mudah-terbakar"],
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
      p.categoryLabel.toLowerCase().includes(lower) ||
      p.brand.toLowerCase().includes(lower) ||
      p.subcategory.toLowerCase().includes(lower)
  );
}
