/* Hallmark · page: PromoMilenial · genre: modern-minimal · macrostructure: Bundles · design-system: design.md */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { money } from "@/lib/money";
import { serializeProductDecimals } from "@/lib/products";
import {
  promoMilenialBundles,
  calculateBundlePrices,
  buildBundleWaUrl,
  PROMO_MILENIAL_WA_URL,
} from "@/lib/promo-milenial";
import "./promo-milenial.css";

export const metadata: Metadata = {
  title: "Promo Milenial - Lab Starter Pack & Bio-Researcher | AndisLab",
  description:
    "Promo Milenial dari AndisLab: Bundling Lab Starter Pack, Bio-Researcher Kit, dan Precision Squad dengan diskon hingga 20%. Cocok untuk peneliti muda!",
  alternates: { canonical: "/promo-milenial" },
};

export const revalidate = 60; // 60 seconds ISR

export default async function PromoMilenialPage() {
  // Collect all slugs from bundles
  const allSlugs = new Set<string>();
  promoMilenialBundles.forEach((b) => b.itemSlugs.forEach((s) => allSlugs.add(s)));

  // Query products from database
  let dbProducts: any[] = [];
  try {
    const rawProducts = await prisma.product.findMany({
      where: { slug: { in: Array.from(allSlugs) } },
      select: {
        slug: true,
        name: true,
        image: true,
        price: true,
        isReadyStock: true,
        categoryLabel: true,
      },
    });
    dbProducts = rawProducts.map(serializeProductDecimals);
  } catch (e) {
    console.error("PromoMilenialPage: Failed to fetch products", e);
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white font-sans overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative px-6 pt-24 pb-20 lg:px-8 lg:pt-32 lg:pb-28 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-emerald-900/20 -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 blur-3xl rounded-full pointer-events-none -z-10" />
        
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-4 py-1.5 text-xs sm:text-sm font-semibold text-indigo-300 backdrop-blur-sm animate-fade-in-up">
            ✨ Khusus Peneliti Muda & Lab Startup
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-tight animate-fade-in-up animation-delay-100 text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
            Promo Milenial <br /> Bundling Eksklusif
          </h1>
          <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Kombinasi instrumen esensial 100% Ready Stock yang dirancang khusus untuk efisiensi, akurasi, dan kepraktisan. Diskon hingga 20% selama masa promo!
          </p>
          <div className="pt-4 animate-fade-in-up animation-delay-300">
            <a
              href="#bundles"
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-slate-900 px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-bold shadow-xl shadow-indigo-900/20 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-900/40 transition-all duration-300"
            >
              Lihat Bundling
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ===== BUNDLES ===== */}
      <section id="bundles" className="px-6 py-16 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-16 lg:space-y-24">
          {promoMilenialBundles.map((bundle, idx) => {
            const calc = calculateBundlePrices(bundle, dbProducts);
            const isReversed = idx % 2 !== 0;

            return (
              <div
                key={bundle.id}
                className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-center`}
              >
                {/* Visual / Image Side */}
                <div className="w-full lg:w-1/2 relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 sm:p-8 overflow-hidden">
                    <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-3xl">
                      HEMAT {bundle.discountPercent}%
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {bundle.itemSlugs.map((slug, index) => {
                        const product = dbProducts.find((p) => p.slug === slug);
                        if (!product) return null;
                        return (
                          <div
                            key={slug}
                            className={`bg-white rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-sm ${
                              index === 2 ? "col-span-2 aspect-[21/9]" : "aspect-square"
                            }`}
                          >
                            {product.image && (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain p-4 drop-shadow-md"
                              />
                            )}
                            <div className="absolute bottom-2 left-3 right-3 text-center">
                              <span className="text-[10px] sm:text-xs font-semibold text-slate-800 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm line-clamp-1">
                                {product.name}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div>
                    <span className="text-indigo-400 font-bold text-sm uppercase tracking-wider mb-2 block">
                      {bundle.tagline}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                      {bundle.name}
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                      {bundle.description}
                    </p>
                  </div>

                  {/* Items List */}
                  <div className="bg-slate-800/30 rounded-2xl p-4 sm:p-6 border border-slate-700/50 space-y-3">
                    {bundle.itemSlugs.map((slug) => {
                      const product = dbProducts.find((p) => p.slug === slug);
                      if (!product) return null;
                      return (
                        <div key={slug} className="flex gap-3 items-start">
                          <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <div className="flex-1">
                            <Link href={`/katalog/${product.slug}`} className="text-sm sm:text-base font-semibold text-slate-200 hover:text-white transition-colors line-clamp-1">
                              {product.name}
                            </Link>
                            <div className="text-xs text-slate-500">
                              {product.categoryLabel}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pricing & CTA */}
                  {calc.isValid ? (
                    <div className="pt-2">
                      <div className="flex flex-col mb-6">
                        <span className="text-slate-500 line-through text-sm sm:text-base font-medium">
                          {money.formatIDR(calc.totalNormalPrice)}
                        </span>
                        <div className="flex items-end gap-4">
                          <span className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                            {money.formatIDR(calc.bundlePrice)}
                          </span>
                          <span className="text-xs sm:text-sm text-emerald-400 font-bold mb-1.5 bg-emerald-400/10 px-2 py-1 rounded-md">
                            Hemat {money.formatIDR(calc.discountAmount)}!
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1">*Harga belum termasuk PPN 12%</span>
                      </div>
                      
                      <a
                        href={buildBundleWaUrl(bundle, calc)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Pesan Bundle Ini
                      </a>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-xl">
                      <p className="text-sm text-red-400 font-medium">
                        ⚠️ Maaf, bundle ini sedang tidak tersedia karena salah satu item habis stok atau memerlukan request harga. Silakan hubungi kami untuk alternatif.
                      </p>
                      <a
                        href={PROMO_MILENIAL_WA_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-xs font-bold text-white bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        Hubungi Tim Sales
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-800 to-indigo-900/50 rounded-[2rem] border border-slate-700/50 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Punya Kebutuhan Lain?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-lg mx-auto">
              Tim spesialis kami siap membantu Anda menyusun spesifikasi alat lab yang tepat sesuai budget dan kebutuhan riset Anda.
            </p>
            <a
              href={PROMO_MILENIAL_WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 px-6 py-3 font-bold shadow-lg hover:bg-slate-100 transition-colors"
            >
              Konsultasi Gratis via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
