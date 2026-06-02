"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useRFQStore } from "@/store/useRFQStore";
import { useState } from "react";
import { formatRupiah, type Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const addItem = useRFQStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      category: product.categoryLabel,
      price: product.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (compact) {
    return (
      <Link
        href={`/katalog/${product.slug}`}
        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
      >
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-3">
          <p className="text-xs font-medium text-cyan-600 mb-1">
            {product.categoryLabel}
          </p>
          <p className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug mb-1">
            {product.name}
          </p>
          <p className="text-xs font-bold text-blue-700">
            {formatRupiah(product.price)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/katalog/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center rounded-xl bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
            {product.categoryLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2 mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-3 flex-1 leading-relaxed">
          {product.description}
        </p>
        <div className="mb-4">
          <p className="text-lg font-black text-blue-700">
            {formatRupiah(product.price)}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleAdd}
          disabled={added}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-all duration-300 ${
            added
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
          }`}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" />
              Ditambahkan!
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Tambah ke Keranjang
            </>
          )}
        </button>
      </div>
    </Link>
  );
}
