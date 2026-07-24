/* Hallmark · page: Home · genre: modern-minimal · macrostructure: Marquee Hero · design-system: design.md */
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import CategoryGrid from "@/components/CategoryGrid";
import BrandLogos from "@/components/BrandLogos";
import ClientLogos from "@/components/ClientLogos";
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Tag } from "lucide-react";
import { prisma } from "@/lib/db";
import { CATEGORY_LABELS, type Category, getGroupedProducts, serializeProductDecimals } from "@/lib/products";

// ISR: revalidate setiap 60 detik — jauh lebih cepat dari force-dynamic
export const revalidate = 60;

export const metadata = {
  title: "Distributor Alat Laboratorium Indonesia | AndisLab",
  description:
    "Alat lab ready stock, harga Daihan hingga 48% di bawah e-Katalog, dokumen lengkap untuk SPJ. Dipercaya Kemenkes, BRIN, ITB, UI. Penawaran 1 hari kerja.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Distributor Alat Laboratorium Indonesia | AndisLab",
    description:
      "Alat lab ready stock, harga Daihan hingga 48% di bawah e-Katalog, dokumen lengkap untuk SPJ. Dipercaya Kemenkes, BRIN, ITB, UI. Penawaran 1 hari kerja.",
    type: "website",
    siteName: "AndisLab",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "AndisLab Indonesia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Distributor Alat Laboratorium Indonesia | AndisLab",
    description:
      "Alat lab ready stock, harga Daihan hingga 48% di bawah e-Katalog, dokumen lengkap untuk SPJ.",
    images: ["/logo.png"],
  },
};

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

  // Filter Ready Stock products and group them, then sort by price ascending (cheapest first)
  const readyStockProducts = getGroupedProducts(allProducts.filter((p: any) => p.isReadyStock))
    .sort((a: any, b: any) => Number(a.price || 0) - Number(b.price || 0));

  // Only show the 5 exclusive categories on the homepage
  const exclusiveCategories: Category[] = [
    "lovibond", "daihan-labtech", "pyrex", "andislab-custom", "general-equipment"
  ];

  // Group exclusive products by category — hanya PO (bukan ready stock)
  const productsByCategory = exclusiveCategories.map((cat) => {
    const grouped = getGroupedProducts(allProducts.filter((p) => p.category === cat && !p.isReadyStock));
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
      
      {/* Premium B2B & e-Katalog Value Proposition Strip - Scientific Dark Console */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-3 animate-fade-in">
        <div className="relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 rounded-[2rem] bg-gradient-to-r from-slate-950 via-indigo-950/90 to-slate-950 p-6 md:px-8 md:py-6 shadow-2xl text-white border border-cyan-500/30 group/ekatalog transition-all duration-300 hover:border-cyan-400/60 hover:shadow-cyan-500/10">
          {/* Ambient cyan glow backdrop */}
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none group-hover/ekatalog:bg-cyan-500/25 transition-all duration-500"></div>
          <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-blue-600/15 blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left">
            <span className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500/15 px-4 py-2 text-xs font-black text-cyan-300 border border-cyan-400/30 shadow-inner shrink-0">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
              ⚡ Resmi e-Katalog & SPJ Lengkap
            </span>
            <p className="text-xs sm:text-sm font-medium text-slate-300 max-w-2xl leading-relaxed">
              Barang datang tepat waktu. Harga masuk anggaran. Dokumen lengkap untuk SPJ. Puluhan produk <strong className="text-white font-extrabold underline decoration-cyan-400/60">ready stock</strong>, siap kirim minggu ini ke laboratorium instansi Anda.
            </p>
          </div>
          <Link
            href="/pemerintah#bukti-harga"
            className="relative z-10 inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all duration-200 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] active:scale-[0.98] shrink-0"
          >
            <span>Bandingkan Harga Daihan (-48%)</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover/ekatalog:translate-x-1" />
          </Link>
        </div>
      </section>

      <HeroSection
        featuredProducts={featuredSliderProducts}
        promoBanner={{
          image: "/images/Banner Promo MERDEKA AndisLab 2026.png",
          href: "/promo-merdeka",
          alt: "Promo MERDEKA AndisLab — Diskon 17% Alat Lab, Order 13 Juli–14 Agustus 2026",
        }}
      />
      <BrandLogos />
      <CategoryGrid />

      {/* Ready Stock Section - High-Impact Workbench Bento Stage */}
      {readyStockProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 mt-10 mb-10" id="ready-stock">
          <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-b from-emerald-950/5 via-slate-50/90 to-white p-6 sm:p-10 lg:p-12 border-2 border-emerald-500/20 shadow-2xl">
            {/* Background watermark typography */}
            <div className="absolute right-6 top-6 select-none pointer-events-none opacity-[0.04] text-right">
              <span className="text-8xl sm:text-9xl font-black tracking-tighter block text-slate-900 leading-none">READY</span>
              <span className="text-7xl sm:text-8xl font-black tracking-tighter block text-emerald-900 leading-none">STOCK</span>
            </div>
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-1.5 text-xs font-black text-white shadow-md shadow-emerald-600/25">
                    <span className="flex h-2 w-2 rounded-full bg-white animate-pulse"></span>
                    ⚡ Tersedia & Siap Kirim Hari Ini
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Alat Laboratorium <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Ready Stock</span>
                </h2>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    JULY
                  </span>
                  <span className="text-sm font-bold text-slate-600 uppercase tracking-widest bg-emerald-100/80 border border-emerald-300/60 px-3 py-1 rounded-xl">
                    Stok Tercepat
                  </span>
                </div>
                <p className="text-sm sm:text-base text-slate-600 mt-4 max-w-2xl font-medium leading-relaxed">
                  Barang telah lolos QA &amp; siap kirim ke seluruh Indonesia. Pengiriman mudah &amp; cepat dengan dokumen resmi lengkap untuk SPJ instansi atau kebutuhan proyek mendesak.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href="/api/ready-stock-pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-700 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-rose-600/25 hover:from-rose-500 hover:to-red-600 hover:-translate-y-0.5 transition-all duration-300 ease-[var(--ease-out)]"
                >
                  <Tag className="h-4 w-4" />
                  Download PDF Ready Stock
                </a>
                <Link
                  href="/ready-stock"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-300/80 bg-white px-6 py-3 text-sm font-extrabold text-slate-800 shadow-md hover:border-emerald-500 hover:text-emerald-700 hover:shadow-xl transition-all duration-200 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] active:scale-[0.98]"
                >
                  Lihat Semua ({readyStockProducts.length})
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Promo MERDEKA Banner Strip inside Ready Stock Stage */}
            <Link
              href="/promo-merdeka"
              className="relative z-10 group flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-600 px-6 py-4 mb-8 shadow-xl shadow-red-600/20 hover:shadow-2xl hover:shadow-red-600/30 hover:-translate-y-0.5 transition-all duration-200 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] active:scale-[0.99] border border-red-400/40"
            >
              <div className="flex items-center gap-3.5">
                <span className="text-2xl animate-bounce">🇮🇩</span>
                <div>
                  <span className="text-sm sm:text-base font-black text-white block">
                    Promo MERDEKA — Diskon 17% Produk Ready Stock / Bundling Gratis!
                  </span>
                  <span className="text-xs text-red-100/90 hidden sm:block">Periode Campaign: 13 Juli – 14 Agustus 2026</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-black text-red-900 bg-yellow-300 px-3.5 py-1.5 rounded-xl shadow-sm group-hover:bg-white transition-colors whitespace-nowrap shrink-0">
                Lihat Detail →
              </span>
            </Link>
            
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
              {readyStockProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} showPromoMerdeka />
              ))}
            </div>
            
            {readyStockProducts.length > 8 && (
              <div className="mt-10 flex justify-center sm:hidden relative z-10">
                <Link
                  href="/ready-stock"
                  className="w-full justify-center inline-flex items-center gap-2 rounded-2xl border-2 border-emerald-500 bg-white px-6 py-3.5 text-sm font-extrabold text-emerald-700 shadow-md hover:bg-emerald-50 transition-colors"
                >
                  Lihat Semua Ready Stock ({readyStockProducts.length})
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Exclusive Products Grouped by Category */}
      {productsByCategory.map((group) => (
        <section key={group.category} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative h-8 w-24">
                  <Image src={group.logo} alt={group.label} fill sizes="96px" className="object-contain object-left" />
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
              className="hidden sm:inline-flex items-center gap-2 rounded-2xl border border-[var(--color-rule)]/60 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 hover:shadow-md transition-all duration-200 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] active:scale-[0.98]"
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
              className="inline-flex items-center gap-2 rounded-2xl border border-[var(--color-rule)]/60 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700 hover:shadow-md transition-all duration-200 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] active:scale-[0.98] shrink-0 animate-fade-in"
            >
              Lihat Semua
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article: any) => (
              <article
                key={article.id}
                className="group flex flex-col bg-white rounded-3xl border border-[var(--color-rule)]/50 hover:shadow-xl hover:border-blue-100 transition-all duration-200 ease-[var(--ease-out)] overflow-hidden"
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
                  <span className="text-xs text-slate-500 font-semibold mb-2 block">
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
              <WaLinkCTA 
                href="?wa=open&source=homepage_cta&text=Halo%20AndisLab%2C%20saya%20ingin%20minta%20penawaran%20khusus."
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-blue-700 shadow-xl transition-all duration-200 ease-[var(--ease-out)] hover:shadow-2xl hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]"
              >
                Hubungi via WhatsApp
              </WaLinkCTA>
              <Link
                href="/katalog"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/30 px-8 py-4 text-base font-bold text-white transition-all duration-200 ease-[var(--ease-out)] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]"
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
