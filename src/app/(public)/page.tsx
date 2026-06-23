import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import CategoryGrid from "@/components/CategoryGrid";
import BrandLogos from "@/components/BrandLogos";
import ClientLogos from "@/components/ClientLogos";
import Link from "next/link";
import { ArrowRight, BookOpen, Tag } from "lucide-react";
import { prisma } from "@/lib/db";
import { CATEGORY_LABELS, type Category, getGroupedProducts, serializeProductDecimals } from "@/lib/products";

// ISR: revalidate setiap 60 detik — jauh lebih cepat dari force-dynamic
export const revalidate = 60;

const categoryOrder: Category[] = [
  "lovibond", "daihan-labtech", "pyrex", "andislab-custom", "general-equipment",
  "aczet", "aelab", "labex", "milwaukee", "taitec", "yamato"
];

const categoryLogos: Record<Category, string> = {
  "lovibond": "/images/lovibond-logo.png",
  "daihan-labtech": "/images/daihanlabtechlogo.png",
  "pyrex": "/images/pyrexlogo.PNG",
  "andislab-custom": "/logo.png",
  "general-equipment": "/logo.png",
  "aczet": "/logo.png",
  "aelab": "/logo.png",
  "labex": "/logo.png",
  "milwaukee": "/logo.png",
  "taitec": "/logo.png",
  "yamato": "/logo.png",
};

export default async function HomePage() {
  let allProducts: any[] = [];
  let latestArticles: any[] = [];

  try {
    allProducts = (await prisma.product.findMany({
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
        variants: true,
      },
    })).map(serializeProductDecimals);

    latestArticles = await (prisma as any).article.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch (error) {
    console.error("HomePage: Failed to fetch data from database", error);
  }
  
  // Pick one from each category for the hero slider
  const featuredSliderProducts = [
    allProducts.find((p: any) => p.category === "lovibond"),
    allProducts.find((p: any) => p.category === "daihan-labtech"),
    allProducts.find((p: any) => p.category === "andislab-custom"),
    allProducts.find((p: any) => p.category === "pyrex"),
  ].filter(Boolean) as any[];

  // Filter Ready Stock products and group them, then shuffle them randomly
  const readyStockProducts = getGroupedProducts(allProducts.filter((p: any) => p.isReadyStock))
    .sort(() => Math.random() - 0.5);

  // Only show the 5 exclusive categories on the homepage
  const exclusiveCategories: Category[] = [
    "lovibond", "daihan-labtech", "pyrex", "andislab-custom", "general-equipment"
  ];

  // Group exclusive products by category
  const productsByCategory = exclusiveCategories.map((cat) => {
    const grouped = getGroupedProducts(allProducts.filter((p) => p.category === cat));
    return {
      category: cat,
      label: CATEGORY_LABELS[cat],
      logo: categoryLogos[cat],
      products: grouped,
    };
  }).filter(group => group.products.length > 0);

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
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <a
                href="/api/ready-stock-pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-rose-700 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
              >
                <Tag className="h-4 w-4" />
                Download PDF Ready Stock
              </a>
              <Link
                href="/ready-stock"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:shadow-md transition-all duration-300"
              >
                Lihat Semua
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
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

      {/* Exclusive Products Grouped by Category */}
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

      {/* Article & Guides Section */}
      {latestArticles.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-100">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 mb-2 border border-blue-100">
                📚 Edukasi & Informasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight animate-fade-in">
                Artikel & Panduan Terbaru
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Ikuti tips penggunaan, spesifikasi teknis mendalam, dan berita seputar alat laboratorium.
              </p>
            </div>
            <Link
              href="/artikel"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 hover:shadow-md transition-all duration-300 shrink-0 animate-fade-in"
            >
              Lihat Semua
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article: any) => (
              <article
                key={article.id}
                className="group flex flex-col bg-white rounded-3xl border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 overflow-hidden"
              >
                <Link href={`/artikel/${article.slug}`} className="relative aspect-video w-full bg-slate-100 overflow-hidden block">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                      <BookOpen className="h-10 w-10 text-slate-300" />
                    </div>
                  )}
                </Link>
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-xs text-slate-400 font-semibold mb-2 block">
                    {new Date(article.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    <Link href={`/artikel/${article.slug}`}>{article.title}</Link>
                  </h3>
                  {article.excerpt && (
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="mt-4 pt-4 border-t border-slate-100/50">
                    <Link
                      href={`/artikel/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Baca Selengkapnya
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

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
