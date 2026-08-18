/* Hallmark · page: Home · genre: corporate-b2b · macrostructure: Clean Enterprise */
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import CategoryGrid from "@/components/CategoryGrid";
import BrandLogos from "@/components/BrandLogos";
import ClientLogos from "@/components/ClientLogos";
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, FileText, CheckCircle, ShieldCheck, Factory, FlaskConical, Building2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { CATEGORY_LABELS, type Category, getGroupedProducts, serializeProductDecimals } from "@/lib/products";

// ISR: revalidate setiap 60 detik
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
      
      {/* Premium B2B & e-Katalog Value Proposition Strip - Corporate Clean */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl bg-blue-900 p-5 md:px-8 text-white shadow-md border border-blue-800">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-sm bg-blue-800 px-3 py-1.5 text-xs font-bold text-blue-100 border border-blue-700 shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Tersedia di e-Katalog
            </span>
            <p className="text-sm font-medium text-blue-100 max-w-2xl leading-relaxed">
              Mitra resmi pengadaan alat laboratorium dan bahan kimia. Harga transparan, dokumen SPJ lengkap, dan dukungan instalasi teknis untuk seluruh Indonesia.
            </p>
          </div>
          <Link
            href="/pemerintah#bukti-harga"
            className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-bold text-blue-900 shadow-sm hover:bg-slate-100 transition-colors shrink-0"
          >
            <span>Lihat Harga e-Katalog</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <HeroSection
        featuredProducts={featuredSliderProducts}
        promoBanner={{
          image: "/images/Banner Promo MERDEKA AndisLab 2026.png",
          href: "/promo-merdeka",
          alt: "Promo AndisLab — Diskon Alat Lab",
        }}
      />
      <BrandLogos />
      

      {/* Trust Factors Section (New B2B Section) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center sm:text-left flex flex-col items-center sm:items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">Distributor Resmi</h3>
              <p className="text-sm text-slate-600">Surat penunjukan principal resmi dan garansi pabrik terjamin untuk semua instrumen analitik.</p>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center sm:text-left flex flex-col items-center sm:items-start gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">Dokumen SPJ Lengkap</h3>
              <p className="text-sm text-slate-600">Faktur pajak, berita acara serah terima, dan kelengkapan dokumen untuk kebutuhan administrasi instansi.</p>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center sm:text-left flex flex-col items-center sm:items-start gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-700">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">Dukungan Instalasi</h3>
              <p className="text-sm text-slate-600">Tim teknisi tersertifikasi siap membantu instalasi, kalibrasi, dan training operasional alat di lab Anda.</p>
            </div>
          </div>
        </div>
      </section>

      <CategoryGrid />

      {/* Ready Stock Section - Corporate Clean Stage */}
      {readyStockProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 mb-10" id="ready-stock">
          <div className="bg-white p-6 sm:p-10 border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Ketersediaan Stok (Ready Stock)
                </h2>
                <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
                  Peralatan yang tersedia dan siap dikirim hari ini. Cocok untuk kebutuhan pengadaan mendesak tanpa perlu indent.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href="/api/ready-stock-pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  <FileText className="h-4 w-4" />
                  Unduh Katalog PDF
                </a>
                <Link
                  href="/ready-stock"
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Lihat Semua
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {readyStockProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {readyStockProducts.length > 8 && (
              <div className="mt-8 flex justify-center sm:hidden">
                <Link
                  href="/ready-stock"
                  className="w-full justify-center inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
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
          <div className="flex items-end justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative h-6 w-20">
                  <Image src={group.logo} alt={group.label} fill sizes="80px" className="object-contain object-left grayscale opacity-80" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Produk {group.label}
              </h2>
            </div>
            <Link
              href={`/katalog?category=${group.category}`}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Lihat Semua
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {group.products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}

      {/* Article & Guides Section */}
      {latestArticles.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200 mt-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Publikasi & Panduan Edukasi
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Spesifikasi teknis, standar operasional prosedur, dan panduan kalibrasi alat laboratorium.
              </p>
            </div>
            <Link
              href="/artikel"
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Lihat Semua
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article: any) => (
              <article
                key={article.id}
                className="group flex flex-col bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <Link href={`/artikel/${article.slug}`} className="relative aspect-video w-full bg-slate-50 overflow-hidden block border-b border-slate-100">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                      <BookOpen className="h-8 w-8 text-slate-300" />
                    </div>
                  )}
                </Link>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                    {new Date(article.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                    <Link href={`/artikel/${article.slug}`}>{article.title}</Link>
                  </h3>
                  {article.excerpt && (
                    <p className="text-sm text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  )}
                  <div className="mt-auto pt-4 border-t border-slate-100/50">
                    <Link
                      href={`/artikel/${article.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors"
                    >
                      Baca Dokumen
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

      {/* CTA Section - Professional Corporate */}
      <section className="bg-slate-900 py-20 mt-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Minta Penawaran Spesifikasi
          </h2>
          <p className="text-slate-300 text-base mb-8">
            Kirimkan daftar kebutuhan laboratorium Anda (BoQ). Tim spesialis kami akan menyusun penawaran harga resmi (Quotation) sesuai dengan anggaran dan spesifikasi teknis instansi Anda dalam 1x24 jam.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <WaLinkCTA 
              href="?wa=open&source=homepage_cta&text=Halo%20AndisLab%2C%20saya%20ingin%20minta%20penawaran%20pengadaan%20alat%20lab."
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-blue-500 transition-colors min-w-[240px]"
            >
              Hubungi Representatif (WhatsApp)
            </WaLinkCTA>
            <Link
              href="/katalog"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-800 border border-slate-700 px-8 py-3.5 text-sm font-bold text-white hover:bg-slate-700 transition-colors min-w-[240px]"
            >
              Jelajahi Katalog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

