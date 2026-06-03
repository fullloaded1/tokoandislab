"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart, ShieldCheck, Truck, Headphones } from "lucide-react";
import { formatRupiah, Product } from "@/lib/products";
import { useRFQStore } from "@/store/useRFQStore";
import type { Product as PrismaProduct } from "@prisma/client";

const features = [
  {
    icon: ShieldCheck,
    title: "Produk Original",
    desc: "Garansi resmi dari principal",
  },
  {
    icon: Truck,
    title: "Pengiriman Nasional",
    desc: "Seluruh wilayah Indonesia",
  },
  {
    icon: Headphones,
    title: "Support Teknis",
    desc: "Tim engineer berpengalaman",
  },
];

const getCategoryStyles = (category: string) => {
  switch (category) {
    case "lovibond": return { bg: "bg-gradient-to-r from-blue-50 to-blue-100", text: "text-blue-600", btn: "bg-blue-600 hover:bg-blue-700" };
    case "pyrex": return { bg: "bg-gradient-to-r from-red-50 to-red-100", text: "text-red-600", btn: "bg-red-600 hover:bg-red-700" };
    case "daihan-labtech": return { bg: "bg-gradient-to-r from-sky-50 to-sky-100", text: "text-sky-600", btn: "bg-sky-600 hover:bg-sky-700" };
    case "andislab-custom": return { bg: "bg-gradient-to-r from-teal-50 to-teal-100", text: "text-teal-600", btn: "bg-teal-600 hover:bg-teal-700" };
    default: return { bg: "bg-gradient-to-r from-indigo-50 to-indigo-100", text: "text-indigo-600", btn: "bg-indigo-600 hover:bg-indigo-700" };
  }
};

export default function HeroSection({ featuredProducts = [] }: { featuredProducts: PrismaProduct[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const addItem = useRFQStore((state) => state.addItem);

  // Auto-play
  useEffect(() => {
    if (featuredProducts.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  if (featuredProducts.length === 0) return null;

  return (
    <section className="w-full bg-white pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* E-Commerce Banner Slider */}
        <div className="relative w-full h-[450px] sm:h-[500px] rounded-3xl overflow-hidden shadow-xl border border-slate-100 group">
          {featuredProducts.map((product, index) => {
            const isActive = index === currentSlide;
            const styles = getCategoryStyles(product.category);
            
            return (
              <div
                key={product.id}
                className={`absolute inset-0 flex flex-col md:flex-row transition-opacity duration-700 ease-in-out ${styles.bg} ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Content Left */}
                <div className="w-full md:w-1/2 h-full flex flex-col justify-center px-8 sm:px-12 py-8 z-20">
                  <span className={`inline-block w-fit text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/60 backdrop-blur border border-white mb-4 ${styles.text}`}>
                    Produk Unggulan • {product.categoryLabel}
                  </span>
                  
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-3">
                    {product.name}
                  </h2>
                  
                  <p className="text-xl sm:text-2xl font-black text-slate-800 mb-4">
                    {formatRupiah(product.price)}
                  </p>
                  
                  <p className="text-slate-600 text-sm sm:text-base mb-8 line-clamp-2 max-w-md">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        addItem({
                          id: product.id,
                          slug: product.slug,
                          name: product.name,
                          image: product.image,
                          category: product.categoryLabel,
                          price: product.price,
                        });
                      }}
                      className={`flex items-center justify-center gap-2 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 ${styles.btn}`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      + Keranjang
                    </button>
                    <Link
                      href={`/katalog/${product.slug}`}
                      className="flex items-center justify-center gap-2 font-bold text-sm px-6 py-3.5 rounded-xl bg-white text-slate-700 border border-slate-200 transition-all hover:bg-slate-50 hover:-translate-y-0.5"
                    >
                      Detail
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Image Right */}
                <div className="absolute right-0 bottom-0 md:relative w-full md:w-1/2 h-full flex items-center justify-end md:justify-center p-8 opacity-30 md:opacity-100 z-10">
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain filter drop-shadow-2xl mix-blend-multiply"
                      priority={index === 0}
                      sizes="(max-width: 768px) 256px, 400px"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2 bg-white/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/50 shadow-sm">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "w-6 bg-slate-800" : "w-2 bg-slate-400 hover:bg-slate-600"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Trust Features (E-Commerce Style Below Banner) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-700 shrink-0">
                <f.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">{f.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
