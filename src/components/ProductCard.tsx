"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, AlertCircle } from "lucide-react";
import { useRFQStore } from "@/store/useRFQStore";
import { useState } from "react";
import { money } from "@/lib/money";
import { getReadyStockSummary } from "@/lib/readyStock";
import { useToast } from "@/components/Toast";

interface ProductCardProps {
  product: any;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const addItem = useRFQStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const toast = useToast();

  const displayName = product.isReadyStock && product.model ? `${product.name} - ${product.model}` : product.name;

  // TODO: HIDE_PRICES_TEMPORARILY di-set true karena user menunggu pengiriman harga terbaru. 
  // Ubah ke false untuk mengaktifkan kembali Direct Purchase & Ready Stock.
  const HIDE_PRICES_TEMPORARILY = true;

  const summary = getReadyStockSummary(product);
  const isReadyToBuy = HIDE_PRICES_TEMPORARILY ? false : summary.state === "available";
  const isSoldOut = HIDE_PRICES_TEMPORARILY ? false : summary.state === "sold_out";

  // TODO[T3.3]: render harga sesuai Order.priceDisplayMode (include/exclude PPN)
  let priceDisplay: string = "Minta Penawaran";
  if (isReadyToBuy) {
    priceDisplay = summary.hasPriceRange
      ? `Mulai ${money.formatIDR(summary.minPrice)}`
      : money.formatIDR(summary.minPrice);
  } else if (isSoldOut) {
    priceDisplay = "Stok Habis";
  }

  const availableVariant = summary.firstAvailable;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isReadyToBuy && availableVariant) {
      // Masuk ke keranjang Direct Purchase
      const res = addItem({
        id: availableVariant.id,
        productId: product.id,
        variantId: availableVariant.id,
        slug: product.slug,
        name: `${displayName} (${availableVariant.name ?? "Default"})`,
        image: product.image,
        category: product.categoryLabel,
        price: money.toDecimal(availableVariant.price).toNumber(),
        type: "DIRECT"
      });

      if (res?.success === false) {
        toast?.showToast(res.error || "Gagal", "error");
        return;
      }
    } else {
      // Masuk ke keranjang RFQ
      const res = addItem({
        id: product.id,
        productId: product.id,
        slug: product.slug,
        name: displayName,
        image: product.image,
        category: product.categoryLabel,
        price: money.toDecimal(product.price).toNumber(),
        type: "RFQ"
      });

      if (res?.success === false) {
        toast?.showToast(res.error || "Gagal", "error");
        return;
      }
    }
    
    setAdded(true);
    toast?.showToast(`${displayName} ditambahkan ke keranjang`, "success");
    setTimeout(() => setAdded(false), 1500);
  };

  if (compact) {
    return (
      <Link
        href={`/katalog/${product.slug}`}
        className="group flex flex-col overflow-hidden rounded-[1.5rem] bg-white transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
      >
        <div className="relative aspect-square overflow-hidden bg-[#f8f9fa] rounded-[1.5rem] p-4 flex items-center justify-center transition-colors group-hover:bg-slate-100/80">
          <Image
            src={product.image}
            alt={displayName}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
            sizes="200px"
          />
          {product.variantCount > 1 && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-slate-800 shadow-sm border border-slate-100/50">
                {product.variantCount} Tipe
              </span>
            </div>
          )}
        </div>
        <div className="px-2 pt-4 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            {product.brand || product.categoryLabel}
          </p>
          <p className="text-sm font-extrabold text-slate-900 line-clamp-2 leading-snug mb-1">
            {displayName}
          </p>

        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/katalog/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[2rem] bg-white transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 h-full"
    >
      {/* Image Area - Studio Look */}
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-[#f8f9fa] rounded-[2rem] transition-colors group-hover:bg-[#f1f3f5]">
        <Image
          src={product.image}
          alt={displayName}
          fill
          className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Floating Badges inside Image Area */}
        {product.variantCount > 1 && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center rounded-2xl bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm">
              {product.variantCount} Varian
            </span>
          </div>
        )}
        {isSoldOut && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1 rounded-2xl bg-red-500/95 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-white shadow-sm">
              <AlertCircle className="h-3 w-3" /> Habis
            </span>
          </div>
        )}
      </div>

      {/* Content Area - Minimalist */}
      <div className="flex flex-col flex-1 px-4 pt-5 pb-5">
        <div className="mb-4">
           <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-2 truncate">
             {product.brand || product.categoryLabel}
           </p>
           <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
             {displayName}
           </h3>

        </div>
        
        {/* Price and CTA */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          {/* Price or Tag */}
          <div className="flex-1">
             <span className={`text-sm font-bold ${isReadyToBuy ? "text-emerald-600" : isSoldOut ? "text-red-500" : "text-slate-600"}`}>
               {priceDisplay}
             </span>
          </div>

          {/* Quick Action Button - Minimalist Circular or Sleek Pill */}
          <button
            onClick={handleAdd}
            disabled={added}
            className={`flex items-center justify-center h-11 px-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
              added
                ? "bg-emerald-50 text-emerald-600"
                : isReadyToBuy 
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20"
                  : "bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20"
            }`}
          >
            {added ? <Check className="h-4 w-4 mr-2" /> : <ShoppingCart className="h-4 w-4 lg:mr-2" />}
            <span className="hidden lg:inline">{added ? "Ditambahkan" : isReadyToBuy ? "Beli Sekarang" : "Minta Penawaran"}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
