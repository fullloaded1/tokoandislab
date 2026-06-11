import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import CategoryGrid from "@/components/CategoryGrid";
import BrandLogos from "@/components/BrandLogos";
import ClientLogos from "@/components/ClientLogos";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { CATEGORY_LABELS, type Category, getGroupedProducts } from "@/lib/products";

// ISR: revalidate setiap 60 detik — jauh lebih cepat dari force-dynamic
export const revalidate = 60;

const categoryOrder: Category[] = ["lovibond", "daihan-labtech", "pyrex", "andislab-custom", "general-equipment"];

const categoryLogos: Record<Category, string> = {
  "lovibond": "/images/lovibond-logo.png",
  "daihan-labtech": "/images/daihanlabtechlogo.png",
  "pyrex": "/images/pyrexlogo.PNG",
  "andislab-custom": "/logo.png",
  "general-equipment": "/logo.png",
};

export default async function HomePage() {
  const allProducts = await prisma.product.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      category: true,
      categoryLabel: true,
      brand: true,
      model: true,
      subcategory: true,
      image: true,
      description: true,
      price: true,
      isReadyStock: true,
      isRequestPricing: true,
    },
  });
  
  // Pick one from each category for the hero slider
  const featuredSliderProducts = [
    allProducts.find(p => p.category === "lovibond"),
    allProducts.find(p => p.category === "daihan-labtech"),
    allProducts.find(p => p.category === "andislab-custom"),
    allProducts.find(p => p.category === "pyrex"),
  ].filter(Boolean) as any[];

  // Filter Ready Stock products and group them
  const readyStockProducts = getGroupedProducts(allProducts.filter((p: any) => p.isReadyStock));

  // Group all products by category, then group duplicates
  const productsByCategory = categoryOrder.map((cat) => {
    const grouped = getGroupedProducts(allProducts.filter((p) => p.category === cat));
    return {
      category: cat,
      label: CATEGORY_LABELS[cat],
      logo: categoryLogos[cat],
      products: grouped,
    };
  });

  return (
    <>
      <h1 className="sr-only">AndisLab: Pusat Distributor Alat Laboratorium, Reagen, dan Furniture Lab Terpercaya di Indonesia</h1>
      <HeroSection featuredProducts={featuredSliderProducts} />
      <BrandLogos />
      <CategoryGrid />

      {/* Ready Stock Section */}
      {readyStockProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 mt-6" id="ready-stock">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  🔥 Tersedia Sekarang
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                Alat Laboratorium <span className="text-emerald-600">Ready Stock</span>
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-xl">
                STOCK Terbatas! Barang siap kirim ke instansi/perusahaan Anda. Dapatkan diskon khusus hari ini.
              </p>
            </div>
            <Link
              href="/ready-stock"
              className="hidden sm:inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:shadow-md transition-all duration-300 shrink-0"
            >
              Lihat Semua
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
            {readyStockProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {readyStockProducts.length > 8 && (
            <div className="mt-8 flex justify-center sm:hidden">
              <Link
                href="/ready-stock"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
              >
                Lihat Semua Ready Stock
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </section>
      )}

      {/* All Products Grouped by Category */}
      {productsByCategory.map((group) => (
        <section key={group.category} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative h-8 w-24">
                  <img src={group.logo} alt={group.label} className="object-contain w-full h-full object-left" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                Jual Alat Lab & Produk <span className="gradient-text">{group.label}</span>
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {group.products.length} produk tersedia
              </p>
            </div>
            <Link
              href={`/katalog?category=${group.category}`}
              className="hidden sm:inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 hover:shadow-md transition-all duration-300"
            >
              Lihat Semua
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
            {group.products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}

      <ClientLogos />

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 px-8 py-16 sm:px-16 sm:py-20 text-center">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Butuh Penawaran Khusus?
            </h2>
            <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">
              Tim sales kami siap membantu Anda mendapatkan harga terbaik untuk kebutuhan
              laboratorium instansi maupun perusahaan Anda.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="?wa=open&source=homepage_cta&text=Halo%20AndisLab%2C%20saya%20ingin%20minta%20penawaran%20khusus."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-blue-700 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
              >
                Hubungi via WhatsApp
              </a>
              <Link
                href="/katalog"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/30 px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:bg-white/10"
              >
                Lihat Katalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
