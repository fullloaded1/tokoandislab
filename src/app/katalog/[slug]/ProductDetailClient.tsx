"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  FileText,
  Check,
  ShoppingCart,
  ArrowLeft,
  Package,
} from "lucide-react";
import { useRFQStore } from "@/store/useRFQStore";
import ProductCard from "@/components/ProductCard";
import { formatRupiah, type Product } from "@/lib/products";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const addItem = useRFQStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      category: product.categoryLabel,
      price: product.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/katalog" className="hover:text-blue-600 transition-colors">
          Katalog
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-slate-800 truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Back Button */}
      <Link
        href="/katalog"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Katalog
      </Link>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Product Image */}
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-slate-100 bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-6"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/90 backdrop-blur px-4 py-2 text-sm font-semibold text-blue-700 shadow-lg">
              <Package className="h-4 w-4" />
              {product.categoryLabel}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="inline-flex items-center rounded-lg bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 mb-3">
              {product.categoryLabel}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
              {product.name}
            </h1>
            <p className="text-2xl font-black text-blue-700 mb-6">
              {formatRupiah(product.price)}
            </p>
            <p className="text-base text-slate-500 leading-relaxed mb-4">
              {product.description}
            </p>
            <a
              href={`https://andislab.com/${product.category}/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Lihat di andislab.com →
            </a>
          </div>

          {/* Add to RFQ */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <button
              onClick={handleAdd}
              disabled={added}
              className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold transition-all duration-300 ${
                added
                  ? "bg-green-50 text-green-600 border-2 border-green-200"
                  : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              {added ? (
                <>
                  <Check className="h-5 w-5" />
                  Berhasil Ditambahkan!
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  Tambah ke Keranjang
                </>
              )}
            </button>
            <a
              href={`https://wa.me/6282125523466?text=${encodeURIComponent(
                `Halo Andis Lab, saya tertarik dengan produk: ${product.name}. Mohon info harga dan ketersediaan.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-6 py-4 text-base font-bold text-slate-700 transition-all duration-300 hover:border-green-300 hover:text-green-700 hover:shadow-lg hover:-translate-y-0.5"
            >
              <FileText className="h-5 w-5" />
              Tanya via WA
            </a>
          </div>

          {/* Specifications Table */}
          <div className="rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                Spesifikasi Teknis
              </h2>
            </div>
            <div className="divide-y divide-slate-50">
              {product.specs.map((spec, idx) => (
                <div
                  key={idx}
                  className={`flex items-center px-6 py-3.5 ${
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                  }`}
                >
                  <span className="w-2/5 text-sm font-medium text-slate-500">
                    {spec.label}
                  </span>
                  <span className="w-3/5 text-sm font-semibold text-slate-800">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Produk <span className="gradient-text">Terkait</span>
            </h2>
            <p className="text-slate-500 mt-1 text-sm">
              Produk lain yang mungkin Anda butuhkan
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
