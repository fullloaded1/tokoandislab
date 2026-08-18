/* Hallmark · page: PromoMerdeka · genre: modern-minimal · macrostructure: Marquee Hero · design-system: design.md */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  PROMO_MERDEKA_WA_URL,
  PROMO_BANNER_IMAGE,
} from "@/lib/promo-merdeka";
import { prisma } from "@/lib/db";
import { serializeProductDecimals, getGroupedProducts } from "@/lib/products";
import { money } from "@/lib/money";
import Countdown from "./Countdown";
import SuccessMetrics from "./SuccessMetrics";
import TopProducts from "./TopProducts";
import "./promo-merdeka.css";

export const metadata: Metadata = {
  title: "Promo MERDEKA Sukses! 150+ Lab Telah Order — Diskon 17% | AndisLab",
  description:
    "Promo MERDEKA sukses besar! 1,287 pesanan, rating 4.8/5. Diskon 17%, bundling gratis, dipercaya 150+ laboratorium. Order sekarang 13 Juli–14 Agustus 2026.",
  alternates: { canonical: "/promo-merdeka" },
  openGraph: {
    title: "Promo MERDEKA Alat Laboratorium — Diskon 17% | AndisLab",
    description:
      "Diskon 17% ready stock di bawah Rp 20 juta, bundling gratis consumables alat di atas Rp 20 juta, dan poin belanja. Order 13 Juli–14 Agustus 2026.",
    type: "website",
    siteName: "AndisLab",
    images: [
      {
        url: PROMO_BANNER_IMAGE,
        width: 1920,
        height: 640,
        alt: "Promo MERDEKA AndisLab — HUT RI ke-81",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Promo MERDEKA Sukses! 150+ Lab — Diskon 17% | AndisLab",
    description: "Promo MERDEKA sukses besar! Rating 4.8/5. Diskon 17%, bundling gratis consumables.",
    images: [PROMO_BANNER_IMAGE],
  },
};

// ISR: revalidate setiap 60 detik agar sinkron dengan data ready stock
export const revalidate = 60;

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

const keuntungan = [
  {
    icon: "🏷️",
    title: "Diskon 17% Ready Stock",
    desc: "Semua produk ready stock di bawah Rp 20 juta mendapatkan potongan langsung 17%. Berlaku untuk alat lab, glassware, reagen, dan perlengkapan lab yang tersedia.",
  },
  {
    icon: "🎁",
    title: "Bundling Gratis",
    desc: "Beli alat lab di atas Rp 20 juta, dapatkan consumables pilihan secara gratis. Hemat lebih banyak untuk belanja lab Anda.",
  },
  {
    icon: "⭐",
    title: "Poin Belanja",
    desc: "Setiap kelipatan Rp 10 juta belanja = 1 poin ☆. Kumpulkan 10 poin, tukarkan dengan hadiah eksklusif dari AndisLab.",
  },
];

const langkahOrder = [
  {
    step: 1,
    title: "Pilih Produk",
    desc: "Jelajahi katalog alat & consumables promo di halaman ini atau katalog lengkap kami.",
  },
  {
    step: 2,
    title: "Hubungi via WhatsApp",
    desc: "Minta penawaran resmi dengan harga promo MERDEKA langsung ke tim sales kami.",
  },
  {
    step: 3,
    title: "Tanda Tangan PO",
    desc: "Harga promo langsung terkunci begitu Purchase Order ditandatangani — aman dari kenaikan harga.",
  },
  {
    step: 4,
    title: "Barang Dikirim",
    desc: "Pengiriman dilakukan 17–31 Agustus 2026. Tepat waktu untuk kebutuhan lab Anda.",
  },
];

const syaratKetentuan = [
  "Periode order ditutup pada 14 Agustus 2026.",
  "Pengiriman barang dijadwalkan 17–31 Agustus 2026.",
  "Harga promo terkunci saat Purchase Order (PO) ditandatangani.",
  "Harga belum termasuk PPN 12%.",
  "Berlaku selama stok dan/atau kuota promo tersedia.",
];

export default async function PromoMerdekaPage() {
  // Query semua produk ready stock dari database
  let readyStockProducts: any[] = [];
  try {
    const allProducts = (await prisma.product.findMany({
      where: { isReadyStock: true },
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        categoryLabel: true,
        brand: true,
        image: true,
        price: true,
        isReadyStock: true,
        isRequestPricing: true,
        variants: true,
      },
    })).map(serializeProductDecimals);
    readyStockProducts = getGroupedProducts(allProducts)
      .filter((p: any) => {
        // Hanya tampilkan produk yang punya harga > 0
        const price = money.toDecimal(p.price as any);
        return price.greaterThan(0);
      })
      .sort((a: any, b: any) => {
        const priceA = money.toDecimal(a.price as any);
        const priceB = money.toDecimal(b.price as any);
        return priceA.minus(priceB).toNumber();
      });
  } catch (error) {
    console.error("PromoMerdekaPage: Failed to fetch ready stock products", error);
  }
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: "Promo MERDEKA AndisLab — HUT RI ke-81",
            description:
              "Diskon 17% produk ready stock, bundling alat lab, dan poin belanja dari AndisLab.",
            startDate: "2026-07-13",
            endDate: "2026-08-14",
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode:
              "https://schema.org/OnlineEventAttendanceMode",
            location: {
              "@type": "VirtualLocation",
              url: "https://andislab.com/promo-merdeka",
            },
            organizer: {
              "@type": "Organization",
              name: "PT Andis Sentral Laboratorium",
              url: "https://www.andislab.com",
            },
            offers: {
              "@type": "Offer",
              description:
                "Diskon 17% untuk semua produk ready stock",
              priceCurrency: "IDR",
              availability: "https://schema.org/InStock",
              validFrom: "2026-07-13",
              validThrough: "2026-08-14",
            },
          }),
        }}
      />

      {/* ===== 1. HERO ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-2 pb-8">
        <div className="promo-hero">
          <Image
            src={PROMO_BANNER_IMAGE}
            alt="Banner Promo MERDEKA AndisLab 2026"
            fill
            className="promo-hero-bg"
            priority
            quality={80}
            sizes="(max-width: 768px) 100vw, 1280px"
          />
          <div className="promo-hero-overlay" />
          <div className="promo-hero-content">
            <div className="max-w-md sm:max-w-lg">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-1.5 text-sm font-bold text-white mb-4">
                🇮🇩 HUT RI ke-81 • 13 Juli – 14 Agustus 2026
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
                Promo MERDEKA Sukses!
                <br />
                <span className="text-yellow-300">AndisLab</span>
              </h1>
              <p className="text-base sm:text-lg text-white/90 max-w-md sm:max-w-lg mb-4 leading-relaxed drop-shadow">
                Dipercaya oleh 150+ laboratorium! Diskon 17% ready stock, bundling gratis consumables,
                <br />
                dan rating 4.8/5 dari ribuan pelanggan puas. Order 13 Juli – 14 Agustus 2026.
              </p>
              <div className="mb-6">
                <Countdown />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={PROMO_MERDEKA_WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="promo-cta"
                  id="promo-cta-hero"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Order via WhatsApp
                </a>
                <a
                  href="/api/promo-merdeka-pdf"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/40 px-6 py-4 text-sm font-bold text-white hover:bg-white hover:text-red-600 transition-all duration-200 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98] shadow-lg"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Katalog PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 1.5 SUCCESS METRICS ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <SuccessMetrics />
      </section>

      {/* ===== 1.6 TOP PRODUCTS ===== */}
      <section>
        <TopProducts />
      </section>

      {/* ===== 2. KEUNTUNGAN PROMO ===== */}
      <section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
        id="keuntungan-promo"
      >
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-bold text-red-700 mb-3">
            🎯 Kenapa Harus Ikut?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            3 Keuntungan{" "}
            <span className="text-red-600">Promo MERDEKA</span>
          </h2>
          <div className="promo-divider mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {keuntungan.map((item) => (
            <div key={item.title} className="keuntungan-card">
              <div className="keuntungan-icon">{item.icon}</div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 3. CARA ORDER ===== */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
          id="cara-order"
        >
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-bold text-red-700 mb-3">
              📋 Langkah Mudah
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Cara <span className="text-red-600">Order Promo</span>
            </h2>
            <div className="promo-divider mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {langkahOrder.map((item, idx) => (
              <div key={item.step} className="step-card">
                {idx < langkahOrder.length - 1 && (
                  <div className="step-connector" aria-hidden="true" />
                )}
                <div className="step-number">{item.step}</div>
                <h3 className="font-bold text-slate-800 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. PRODUK PROMO ===== */}
      <section
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
        id="produk-promo"
      >
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-bold text-red-700 mb-3">
            🔥 Harga Spesial Ready Stock
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Produk <span className="text-red-600">Promo MERDEKA</span>
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Diskon 17% untuk item di bawah Rp 20 juta. Alat di atas Rp 20 juta mendapat bundling gratis consumables. Harga belum termasuk PPN 12%.
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="/api/promo-merdeka-pdf"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Unduh Katalog Resmi Promo MERDEKA (PDF)
            </a>
          </div>
          <div className="promo-divider mt-6" />
        </div>

        {readyStockProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
            {readyStockProducts.map((product: any) => {
              const hargaNormal = money.toDecimal(product.price as any);
              const threshold = money.toDecimal(20000000);
              const isBelowThreshold = hargaNormal.lessThan(threshold);

              if (isBelowThreshold) {
                const hargaPromo = hargaNormal.mul(83).dividedBy(100).toDecimalPlaces(0); // diskon 17%
                return (
                  <div key={product.id} className="promo-product-card flex flex-col justify-between">
                    <div>
                      <span className="promo-badge">-17%</span>
                      <div className="mb-3">
                        <span className="inline-block text-[0.7rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">
                          ✅ Ready Stock
                        </span>
                      </div>
                      {product.image && (
                        <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden bg-slate-50">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        </div>
                      )}
                      <h3 className="font-bold text-slate-800 text-sm mb-1 pr-16 leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-400 mb-3">{product.categoryLabel}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="harga-coret">
                          {money.formatIDR(hargaNormal)}
                        </span>
                        <span className="harga-promo">
                          {money.formatIDR(hargaPromo)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                      <a
                        href={`${PROMO_MERDEKA_WA_URL}%20untuk%20${encodeURIComponent(product.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-green-700 hover:text-green-800 transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Order Sekarang
                      </a>
                      <Link
                        href={`/katalog/${product.slug}`}
                        className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors ml-auto"
                      >
                        Detail →
                      </Link>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={product.id} className="promo-product-card flex flex-col justify-between">
                    <div>
                      <span className="promo-badge-bundling">🎁 Bundling: Gratis Consumables</span>
                      <div className="mb-3">
                        <span className="inline-block text-[0.7rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700">
                          ✅ Ready Stock
                        </span>
                      </div>
                      {product.image && (
                        <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden bg-slate-50">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        </div>
                      )}
                      <h3 className="font-bold text-slate-800 text-sm mb-1 pr-16 leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-400 mb-3">{product.categoryLabel}</p>
                      <div className="flex flex-col gap-1">
                        <span className="harga-promo text-slate-800">
                          {money.formatIDR(hargaNormal)}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700 leading-normal bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100/50">
                          Gratis consumables pilihan — minta penawaran untuk detail bundling
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                      <a
                        href={`${PROMO_MERDEKA_WA_URL}%20untuk%20${encodeURIComponent(product.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-green-700 hover:text-green-800 transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Order Sekarang
                      </a>
                      <Link
                        href={`/katalog/${product.slug}`}
                        className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors ml-auto"
                      >
                        Detail →
                      </Link>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        ) : (
          <p className="text-center text-slate-400">Memuat produk promo...</p>
        )}

        <div className="text-center mt-10">
          <a
            href={PROMO_MERDEKA_WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="promo-cta"
            id="promo-cta-produk"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Order via WhatsApp
          </a>
        </div>
      </section>

      {/* ===== BLOK INSTANSI PEMERINTAH ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-red-50 to-slate-50 border border-red-200 rounded-[2rem] p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 mb-4">
              🏛️ Layanan Khusus
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-3">
              Untuk Instansi Pemerintah
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              Pengadaan bisa melalui PO/SPK resmi atau e-Katalog (INAPROC). Dokumen lengkap untuk SPJ. Harga promo terkunci saat PO ditandatangani.
            </p>
          </div>
          <div className="shrink-0 w-full md:w-auto text-right">
            <Link
              href="/pemerintah"
              className="inline-flex w-full md:w-auto justify-center items-center gap-2 rounded-2xl bg-red-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-red-700 transition-all duration-300"
            >
              Pelajari Pengadaan Pemerintah
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION (ACCORDION) ===== */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Pertanyaan Umum <span className="text-red-600">(FAQ)</span>
          </h2>
          <div className="promo-divider mt-4" />
        </div>

        <div className="space-y-4">
          <details className="faq-details group bg-white border border-slate-200 rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between font-bold text-slate-800 cursor-pointer outline-none">
              <span>Apakah bisa order lewat e-Katalog/INAPROC?</span>
              <span className="faq-icon text-slate-400 group-open:rotate-180 transition-transform duration-300">▼</span>
            </summary>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
              Bisa, storefront kami: <a href="https://katalog.inaproc.id/andis-sentral-laboratorium" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline font-semibold">katalog.inaproc.id/andis-sentral-laboratorium</a>. Sebutkan Promo MERDEKA saat menghubungi sales agar harga disesuaikan.
            </p>
          </details>

          <details className="faq-details group bg-white border border-slate-200 rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between font-bold text-slate-800 cursor-pointer outline-none">
              <span>Apa maksudnya harga terkunci saat PO?</span>
              <span className="faq-icon text-slate-400 group-open:rotate-180 transition-transform duration-300">▼</span>
            </summary>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
              Begitu PO ditandatangani sebelum 14 Agustus 2026, harga promo berlaku permanen untuk order tersebut, aman dari kenaikan harga.
            </p>
          </details>

          <details className="faq-details group bg-white border border-slate-200 rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between font-bold text-slate-800 cursor-pointer outline-none">
              <span>Kapan barang dikirim?</span>
              <span className="faq-icon text-slate-400 group-open:rotate-180 transition-transform duration-300">▼</span>
            </summary>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
              Pengiriman dijadwalkan 17–31 Agustus 2026 dengan pengiriman mudah dan cepat ke seluruh Indonesia.
            </p>
          </details>

          <details className="faq-details group bg-white border border-slate-200 rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center justify-between font-bold text-slate-800 cursor-pointer outline-none">
              <span>Apakah harga sudah termasuk PPN?</span>
              <span className="faq-icon text-slate-400 group-open:rotate-180 transition-transform duration-300">▼</span>
            </summary>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
              Belum, harga di halaman ini belum termasuk PPN 12%.
            </p>
          </details>
        </div>
      </section>

      {/* ===== 5. SYARAT & KETENTUAN ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Syarat &{" "}
            <span className="text-red-600">Ketentuan</span>
          </h2>
          <div className="promo-divider mt-4" />
        </div>

        <div className="snk-section max-w-2xl mx-auto">
          {syaratKetentuan.map((item, idx) => (
            <div key={idx} className="snk-item">
              <span className="snk-bullet">{idx + 1}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA Bottom ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-red-600 via-red-700 to-red-900 px-8 py-16 sm:px-16 sm:py-20 text-center">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-yellow-500/5" />

          <div className="relative">
            <p className="text-yellow-300 font-bold text-sm uppercase tracking-widest mb-3">
              🇮🇩 Promo MERDEKA • HUT RI ke-81
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Jangan Lewatkan Kesempatan Ini!
            </h2>
            <p className="text-red-100 text-lg max-w-xl mx-auto mb-8">
              Order sebelum 14 Agustus 2026 dan dapatkan harga terbaik
              untuk kebutuhan laboratorium Anda.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <a
                href={PROMO_MERDEKA_WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-base font-bold text-red-700 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
                id="promo-cta-bottom"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#25D366"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Order via WhatsApp Sekarang
              </a>
              <a
                href="/api/promo-merdeka-pdf"
                className="inline-flex items-center gap-3 rounded-2xl bg-red-900/80 border border-white/30 px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-red-900 transition-all duration-200 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Katalog PDF
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MOBILE STICKY CTA BAR ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-5 py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] md:hidden flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Periode Terbatas</span>
          <span className="text-sm font-black text-red-600">Promo s.d. 14 Agustus</span>
        </div>
        <a
          href={PROMO_MERDEKA_WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-5 py-3 text-xs font-bold text-white shadow-md hover:shadow-lg transition-all duration-200 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] active:scale-[0.95]"
          id="promo-cta-mobile-sticky"
        >
          Order via WhatsApp
        </a>
      </div>

      {/* Extra space at the bottom to prevent layout overlap on mobile */}
      <div className="h-24 md:hidden" />
    </>
  );
}
