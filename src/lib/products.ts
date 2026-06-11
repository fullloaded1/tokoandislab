export type Category = "lovibond" | "daihan-labtech" | "pyrex" | "andislab-custom" | "general-equipment";

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
};

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  "lovibond": "Kebutuhan pengujian kualitas air industri, laboratorium, lingkungan, dan water treatment berkualitas dari Lovibond®.",
  "daihan-labtech": "General peralatan laboratorium umum yang sering dipakai. Magnetic stirrer, hotplate, sentrifuge, dan peralatan umum laboratorium.",
  "pyrex": "Peralatan kaca borosilicate berkualitas tinggi: beaker, Erlenmeyer, labu ukur, pipet, dan kelengkapan glassware lab.",
  "andislab-custom": "Custom lab dan furniture fabrikasi meja lab, lemari penyimpanan, fume hood, wet scrubber standar keamanan internasional.",
  "general-equipment": "Peralatan umum laboratorium untuk mendukung berbagai kebutuhan operasional, riset, dan analisis harian.",
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
