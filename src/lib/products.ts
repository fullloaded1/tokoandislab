export type Category = "lovibond" | "daihan-labtech" | "pyrex" | "andislab-custom" | "general-equipment" | "aczet" | "aelab" | "labex" | "milwaukee" | "taitec" | "yamato";

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
  brochureUrl?: string | null;
  description: string;
  specs: ProductSpec[];
  relatedSlugs: string[];
  isRequestPricing: boolean;
  isReadyStock: boolean;
  warrantyPeriod?: string | null;
  leadTime?: string | null;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  "lovibond": "Lovibond",
  "daihan-labtech": "Daihan Labtech",
  "pyrex": "Pyrex®",
  "andislab-custom": "Andislab Custom",
  "general-equipment": "General Equipment",
  "aczet": "Aczet",
  "aelab": "Aelab",
  "labex": "Labex",
  "milwaukee": "Milwaukee Instruments",
  "taitec": "Taitec",
  "yamato": "Yamato Scientific",
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  "lovibond": "Kebutuhan pengujian kualitas air industri, laboratorium, lingkungan, dan water treatment berkualitas dari Lovibond®.",
  "daihan-labtech": "General peralatan laboratorium umum yang sering dipakai. Magnetic stirrer, hotplate, sentrifuge, dan peralatan umum laboratorium.",
  "pyrex": "Peralatan kaca borosilicate berkualitas tinggi: beaker, Erlenmeyer, labu ukur, pipet, dan kelengkapan glassware lab.",
  "andislab-custom": "Custom lab dan furniture fabrikasi meja lab, lemari penyimpanan, fume hood, wet scrubber standar keselamatan internasional.",
  "general-equipment": "Peralatan umum laboratorium untuk mendukung berbagai kebutuhan operasional, riset, dan analisis harian.",
  "aczet": "Timbangan analitik dan presisi berkualitas tinggi dari Aczet untuk kebutuhan penimbangan akurat di laboratorium.",
  "aelab": "Peralatan laboratorium presisi dari Aelab: micropipette, PCR cabinet, orbital shaker, dan instrumen riset molekuler.",
  "labex": "Mikroskop dan instrumen optik berkualitas dari Labex untuk kebutuhan riset biologi, patologi, dan pendidikan.",
  "milwaukee": "Instrumen pengukuran portabel Milwaukee untuk pH, konduktivitas, dan parameter kualitas air di lapangan.",
  "taitec": "Peralatan laboratorium Jepang presisi tinggi dari Taitec: inkubator, shaker, vortex mixer, dan block heater.",
  "yamato": "Instrumen laboratorium premium Yamato Scientific: inkubator, oven, autoklaf, dan peralatan riset Jepang.",
};


export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function getGroupedProducts(products: any[]): any[] {
  const map = new Map<string, any>();
  
  for (const product of products) {
    const key = `${product.name}-${product.brand}`;
    if (!map.has(key)) {
      map.set(key, { ...product, variantCount: 1 });
    } else {
      const existing = map.get(key)!;
      existing.variantCount += 1;
    }
  }
  
  return Array.from(map.values());
}
