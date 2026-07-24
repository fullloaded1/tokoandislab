/* Hallmark · component: HeroSection · genre: modern-minimal · macrostructure: Marquee Hero · 8-state-ui: pass · contrast: pass */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, ShoppingCart, ShieldCheck, Truck, Headphones } from "lucide-react";
import { money } from "@/lib/money";
import { useRFQStore } from "@/store/useRFQStore";
import { useToast } from "@/components/Toast";
import AntiIndentBadge from "@/components/AntiIndentBadge";

const features = [
  {
    icon: ShieldCheck,
    title: "100% Original & Garansi",
    desc: "Sertifikat resmi langsung dari principal",
  },
  {
    icon: Truck,
    title: "Pengiriman Nasional",
    desc: "Melayani Jabodetabek & seluruh Indonesia",
  },
  {
    icon: Headphones,
    title: "Engineering Support",
    desc: "Konsultasi teknis & instalasi laboratorium",
  },
  {
    icon: ShieldCheck,
    title: "e-Katalog INAPROC",
    desc: "Terdaftar resmi untuk pengadaan pemerintah & SPJ",
  },
];

const getCategoryStyles = (category: string) => {
  switch (category) {
    case "lovibond": return { bg: "bg-gradient-to-r from-blue-50 via-slate-50 to-blue-100/80", text: "text-blue-700 border-blue-200", btn: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/30" };
    case "pyrex": return { bg: "bg-gradient-to-r from-red-50 via-slate-50 to-red-100/80", text: "text-red-700 border-red-200", btn: "bg-red-600 hover:bg-red-700 shadow-red-600/30" };
    case "daihan-labtech": return { bg: "bg-gradient-to-r from-sky-50 via-slate-50 to-sky-100/80", text: "text-sky-700 border-sky-200", btn: "bg-sky-700 hover:bg-sky-800 shadow-sky-700/30" };
    case "andislab-custom": return { bg: "bg-gradient-to-r from-emerald-50 via-slate-50 to-teal-100/80", text: "text-emerald-700 border-emerald-200", btn: "bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/30" };
    default: return { bg: "bg-gradient-to-r from-slate-50 via-white to-indigo-50/80", text: "text-indigo-700 border-indigo-200", btn: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30" };
  }
};

type PromoBanner = {
  image: string;
  href: string;
  alt: string;
};

export default function HeroSection({ featuredProducts = [], promoBanner }: { featuredProducts: any[]; promoBanner?: PromoBanner }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const addItem = useRFQStore((state) => state.addItem);
  const toast = useToast();

  const hasPromo = !!promoBanner;
  const totalSlides = featuredProducts.length + (hasPromo ? 1 : 0);

  // Auto-play
  useEffect(() => {
    if (totalSlides === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  if (totalSlides === 0) return null;

  return (
    <section className="w-full relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pt-6 pb-16 border-b border-slate-200/60">
      {/* Subtle scientific coordinate grid watermark */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AntiIndentBadge variant="banner" showConsultText={true} className="mb-6 w-full" />
        
        {/* E-Commerce Banner Slider - Studio Glass Framework */}
        <div className="relative w-full h-[450px] sm:h-[520px] rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-white/80 ring-1 ring-slate-900/5 group bg-slate-900">
          {/* Promo Banner Slide (first slide when present) */}
          {hasPromo && (
            <Link
              href={promoBanner.href as Route}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out block bg-[#CE1126] ${
                currentSlide === 0 ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={promoBanner.image}
                alt={promoBanner.alt}
                fill
                className="object-contain"
                priority
                quality={85}
                sizes="(max-width: 768px) 100vw, 1280px"
              />
            </Link>
          )}
          {featuredProducts.map((product, index) => {
            const slideIndex = hasPromo ? index + 1 : index;
            const isActive = slideIndex === currentSlide;
            const styles = getCategoryStyles(product.category);
            const productAny = product as any;
            const availableVariant = productAny.variants?.find((v: any) => v.stock - v.reservedStock > 0 && money.toDecimal(v.price).toNumber() > 0);
            const isReadyToBuy = productAny.isReadyStock && availableVariant;
            const readyStockPrice = isReadyToBuy ? money.toDecimal(availableVariant.price).toNumber() : 0;
            
            return (
              <div
                key={product.id}
                className={`absolute inset-0 flex flex-col md:flex-row transition-opacity duration-700 ease-in-out ${styles.bg} ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Content Left */}
                <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-8 sm:px-12 py-8 z-20">
                  <span className={`inline-block w-fit text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/60 backdrop-blur border border-white mb-3 ${styles.text}`}>
                    Produk Unggulan • {product.categoryLabel}
                  </span>
                  
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-3">
                    {product.name}
                  </h2>
                  
                  {isReadyToBuy ? (
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <AntiIndentBadge variant="card" />
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur border border-emerald-300 px-4 py-1.5 text-sm font-bold text-emerald-700 shadow-sm">
                        🔥 Stok Tersedia • {money.formatIDR(readyStockPrice)}
                      </span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur border border-amber-200 px-4 py-1.5 text-sm font-semibold text-amber-600 mb-4 w-fit">
                      💬 Minta Penawaran Dulu
                    </span>
                  )}
                  
                  <p className="text-slate-600 text-sm sm:text-base mb-8 line-clamp-2 max-w-md">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        if (isReadyToBuy && availableVariant) {
                          const res = addItem({
                            id: availableVariant.id,
                            productId: product.id,
                            variantId: availableVariant.id,
                            slug: product.slug,
                            name: `${product.name} (${availableVariant.name})`,
                            image: product.image,
                            category: product.categoryLabel,
                            price: readyStockPrice,
                            type: "DIRECT"
                          });
                          if (res?.success === false) {
                            toast?.showToast(res.error || "Gagal", "error");
                            return;
                          }
                        } else {
                          const res = addItem({
                            id: product.id,
                            productId: product.id,
                            slug: product.slug,
                            name: product.name,
                            image: product.image,
                            category: product.categoryLabel,
                            price: money.toDecimal(product.price as any).toNumber(),
                            type: "RFQ"
                          });
                          if (res?.success === false) {
                            toast?.showToast(res.error || "Gagal", "error");
                            return;
                          }
                        }
                        toast?.showToast(`${product.name} ditambahkan ke keranjang`, "success");
                      }}
                      className={`flex items-center justify-center gap-2 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all duration-200 ease-[var(--ease-out)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] active:scale-[0.98] ${
                        isReadyToBuy ? "bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/30" : styles.btn
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {isReadyToBuy ? "Beli Langsung" : "+ Keranjang"}
                    </button>
                    <Link
                      href={`/katalog/${product.slug}`}
                      className="flex items-center justify-center gap-2 font-bold text-sm px-6 py-3.5 rounded-xl bg-white text-slate-700 border border-slate-200 transition-all duration-200 ease-[var(--ease-out)] hover:bg-slate-50 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] active:scale-[0.98]"
                    >
                      Detail
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Image Right */}
                <div className="absolute right-0 bottom-0 md:relative w-full md:w-1/2 h-full flex items-center justify-end md:justify-center p-8 opacity-20 md:opacity-100 z-10">
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain drop-shadow-lg"
                      priority={index === 0}
                      fetchPriority={index === 0 ? "high" : undefined}
                      quality={75}
                      sizes="(max-width: 768px) 128px, 384px"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Dots Indicator - UI/UX Pro Max 44px min touch targets */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full active:scale-90 transition-all"
                aria-label={`Ke slide ${index + 1}`}
              >
                <span
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "w-7 bg-emerald-400 shadow-sm" : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Trust Features (4-Column Bento Glass Cards Below Banner) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {features.map((f) => (
            <div
              key={f.title}
              className="group/feature flex items-center gap-4 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:shadow-xl hover:border-emerald-500/50 hover:-translate-y-1.5 transition-all duration-300 ease-out"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/15 via-slate-50 to-teal-50 text-emerald-700 shrink-0 transition-transform duration-300 group-hover/feature:scale-110 group-hover/feature:bg-gradient-to-br group-hover/feature:from-emerald-600 group-hover/feature:to-teal-700 group-hover/feature:text-white shadow-sm border border-emerald-500/20">
                <f.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight group-hover/feature:text-emerald-700 transition-colors">{f.title}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
