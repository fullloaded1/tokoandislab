"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Headphones } from "lucide-react";
import { products } from "@/lib/products";
import ProductCard from "./ProductCard";

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

export default function HeroSection() {
  const heroProducts = products.slice(0, 5);
  const centerProduct = heroProducts[0];
  const surroundingProducts = heroProducts.slice(1, 5);

  return (
    <section className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-cyan-100/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-indigo-100/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Top Badge */}
        <div className="flex justify-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-5 py-2 text-sm font-medium text-blue-700">
            <Sparkles className="h-4 w-4 text-blue-500" />
            Distributor Terpercaya Sejak 2010
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Solusi Lengkap{" "}
            <span className="gradient-text">Alat Laboratorium</span>{" "}
            untuk Indonesia
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Instrumen analitik, furnitur lab, reagen, dan consumable berkualitas tinggi.
            Minta penawaran langsung — tanpa ribet.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link
              href="/katalog"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 pulse-glow"
            >
              Jelajahi Katalog
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="https://wa.me/6281234567890?text=Halo%20AndisLab%2C%20saya%20ingin%20konsultasi%20produk."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 transition-all duration-300 hover:border-blue-300 hover:text-blue-700 hover:shadow-lg hover:-translate-y-0.5"
            >
              Hubungi Kami
            </a>
          </div>
        </div>

        {/* Product Showcase */}
        <div className="relative max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
          {/* Center Product Image */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-slate-200/60 bg-white shadow-2xl shadow-blue-500/10">
              <Image
                src={centerProduct.image}
                alt={centerProduct.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 512px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <span className="inline-flex items-center rounded-xl bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold text-blue-700 mb-3">
                  {centerProduct.categoryLabel}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {centerProduct.name}
                </h3>
                <p className="text-sm text-white/80 line-clamp-2">
                  {centerProduct.description}
                </p>
              </div>
            </div>
          </div>

          {/* Surrounding Product Cards */}
          <div className="hidden lg:block">
            {/* Top left */}
            <div className="absolute -top-4 -left-8 w-40 animate-float" style={{ animationDelay: "0s" }}>
              <ProductCard product={surroundingProducts[0]} compact />
            </div>
            {/* Top right */}
            <div className="absolute -top-4 -right-8 w-40 animate-float" style={{ animationDelay: "0.5s" }}>
              <ProductCard product={surroundingProducts[1]} compact />
            </div>
            {/* Bottom left */}
            <div className="absolute -bottom-8 left-4 w-40 animate-float" style={{ animationDelay: "1s" }}>
              <ProductCard product={surroundingProducts[2]} compact />
            </div>
            {/* Bottom right */}
            <div className="absolute -bottom-8 right-4 w-40 animate-float" style={{ animationDelay: "1.5s" }}>
              <ProductCard product={surroundingProducts[3]} compact />
            </div>
          </div>

          {/* Mobile: Grid of surrounding products */}
          <div className="grid grid-cols-2 gap-3 mt-6 lg:hidden">
            {surroundingProducts.map((p) => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </div>
        </div>

        {/* Trust Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/60 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 mb-3">
                <f.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">{f.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
