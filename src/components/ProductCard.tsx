"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useRFQStore } from "@/store/useRFQStore";
import { useState } from "react";
import { formatRupiah } from "@/lib/products";
import { useToast } from "@/components/Toast";

interface ProductCardProps {
  product: any;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const addItem = useRFQStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  let toast: ReturnType<typeof useToast> | null = null;
  try {
    toast = useToast();
  } catch {
    // Toast provider may not be available in some contexts
  }

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
    toast?.showToast(`${product.name} ditambahkan ke keranjang`, "success");
    setTimeout(() => setAdded(false), 1500);
  };

  const hasPrice = product.price && product.price > 0;

  if (compact) {
    return (
      <Link
        href={`/katalog/${product.slug}`}
        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
      >
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
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
          {hasPrice ? (
            <p className="text-sm font-bold text-blue-700">
              {formatRupiah(product.price)}
            </p>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-600">
              💬 Hubungi untuk Harga
            </span>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/katalog/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 h-full"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center rounded-xl bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
            {product.categoryLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2 min-h-[3rem] mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5rem] mb-4 leading-relaxed">
          {product.description}
        </p>
        
        <div className="mt-auto flex flex-col gap-4">
          {/* Price */}
          <div>
            {hasPrice ? (
              <p className="text-lg font-black text-blue-700">
                {formatRupiah(product.price)}
              </p>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-sm font-semibold text-amber-600">
                💬 Hubungi untuk Harga
              </span>
            )}
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
      </div>
    </Link>
  );
}
