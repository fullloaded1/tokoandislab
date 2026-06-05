import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import CategoryGrid from "@/components/CategoryGrid";
import BrandLogos from "@/components/BrandLogos";
import ClientLogos from "@/components/ClientLogos";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { CATEGORY_LABELS, type Category } from "@/lib/products";

export const dynamic = "force-dynamic";

const categoryOrder: Category[] = ["lovibond", "daihan-labtech", "pyrex", "andislab-custom"];

const categoryLogos: Record<Category, string> = {
  "lovibond": "/images/lovibond-logo.png",
  "daihan-labtech": "/images/daihanlabtechlogo.png",
  "pyrex": "/images/pyrexlogo.PNG",
  "andislab-custom": "/logo.png",
};

export default async function HomePage() {
  const allProducts = await prisma.product.findMany();
  
  // Pick one from each category for the hero slider
  const featuredSliderProducts = [
    allProducts.find(p => p.category === "lovibond"),
    allProducts.find(p => p.category === "daihan-labtech"),
    allProducts.find(p => p.category === "andislab-custom"),
    allProducts.find(p => p.category === "pyrex"),
  ].filter(Boolean) as any[];

  // Group all products by category
  const productsByCategory = categoryOrder.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    logo: categoryLogos[cat],
    products: allProducts.filter((p) => p.category === cat),
  }));

  return (
    <>
      <HeroSection featuredProducts={featuredSliderProducts} />
      <BrandLogos />
      <CategoryGrid />

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
                Produk <span className="gradient-text">{group.label}</span>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {group.products.map((product) => (
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
                href="https://wa.me/6282125523466?text=Halo%20AndisLab%2C%20saya%20ingin%20minta%20penawaran%20khusus."
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
