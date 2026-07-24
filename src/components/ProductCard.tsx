/* Hallmark · component: ProductCard · genre: modern-minimal · 8-state-ui: pass · contrast: pass · decimal-safety: pass */
"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, AlertCircle } from "lucide-react";
import { useRFQStore } from "@/store/useRFQStore";
import { useState } from "react";
import { money } from "@/lib/money";
import { getReadyStockSummary } from "@/lib/readyStock";
import { getEkatalogRow } from "@/lib/ekatalog";
import { useToast } from "@/components/Toast";
import AntiIndentBadge from "@/components/AntiIndentBadge";

interface ProductCardProps {
  product: any;
  compact?: boolean;
  showPromoMerdeka?: boolean;
  /** Heading level for the product name. Adjust per-page to keep H1→H2→H3 hierarchy. */
  headingLevel?: "h2" | "h3" | "h4";
}

export default function ProductCard({ product, compact = false, showPromoMerdeka = false, headingLevel = "h3" }: ProductCardProps) {
  // Dynamic heading tag to maintain proper heading hierarchy per page context
  const Heading = headingLevel;
  const compactHeadingMap = { h2: "h3" as const, h3: "h4" as const, h4: "h5" as const };
  const CompactHeading = compactHeadingMap[headingLevel] ?? "h4";
  const addItem = useRFQStore((s) => s.addItem);
  const setCartOpen = useRFQStore((s) => s.setCartOpen);
  const [added, setAdded] = useState(false);

  const toast = useToast();

  const displayName = product.isReadyStock && product.model ? `${product.name} - ${product.model}` : product.name;

  // Harga sudah dimasukkan dari supplier price list (Juni 2026).
  const HIDE_PRICES_TEMPORARILY = false;

  const summary = getReadyStockSummary(product);
  const isReadyToBuy = HIDE_PRICES_TEMPORARILY ? false : summary.state === "available";
  const isSoldOut = HIDE_PRICES_TEMPORARILY ? false : summary.state === "sold_out";

  // Baris e-Katalog (7 model Daihan) — sumber harga & % hemat tunggal untuk model ini.
  const ekatalogRow = getEkatalogRow(product.model, product.name);
  const ekatalogSavings = ekatalogRow?.hemat ?? null;

  // Helper: ubah akhiran harga display → .700 (ready stock) atau .900 (PO Andislab/Daihan)
  const adjustPriceSuffix = (price: number, suffix: 700 | 900): number => {
    return Math.floor(price / 1000) * 1000 + suffix - 1000;
  };

  // Cek apakah produk PO Andislab/Daihan dengan harga > 0
  const isPOWithPrice900 =
    !isReadyToBuy &&
    !isSoldOut &&
    (product.category === "andislab-custom" || product.category === "daihan-labtech") &&
    Number(product.price) > 0;

  // Satu produk = satu harga, tanpa coretan.
  let priceDisplay: string = "Minta Penawaran";
  if (ekatalogRow) {
    priceDisplay = ekatalogRow.andislab;
  } else if (isReadyToBuy) {
    const adjustedMinPrice = adjustPriceSuffix(summary.minPrice, 700);
    priceDisplay = summary.hasPriceRange
      ? `Mulai ${money.formatIDR(adjustedMinPrice)}`
      : money.formatIDR(adjustedMinPrice);
  } else if (isSoldOut) {
    priceDisplay = "Stok Habis";
  } else if (isPOWithPrice900) {
    priceDisplay = money.formatIDR(adjustPriceSuffix(Number(product.price), 900));
  }

  const availableVariant = summary.firstAvailable ?? product.variants?.find((v: any) => (v.stock - v.reservedStock) > 0) ?? null;
  const availableStockCount = availableVariant ? Math.max(0, availableVariant.stock - availableVariant.reservedStock) : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isReadyToBuy && availableVariant) {
      // Untuk 7 model Daihan, harga keranjang = harga e-Katalog (sumber tunggal) agar konsisten dgn tampilan.
      const finalPrice = ekatalogRow ? ekatalogRow.andislabValue : money.toDecimal(availableVariant.price).toNumber();

      // Masuk ke keranjang Direct Purchase
      const res = addItem({
        id: availableVariant.id,
        productId: product.id,
        variantId: availableVariant.id,
        slug: product.slug,
        name: `${displayName} (${availableVariant.name ?? "Default"})`,
        image: product.image,
        category: product.categoryLabel,
        price: finalPrice,
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
    setCartOpen(true);
    toast?.showToast(`${displayName} ditambahkan ke keranjang`, "success");
    setTimeout(() => setAdded(false), 1500);
  };

    if (compact) {
      return (
        <Link
          href={`/katalog/${product.slug}`}
          className="group/card flex flex-col overflow-hidden rounded-[1.75rem] bg-white border border-slate-200/80 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-emerald-950/10 hover:border-emerald-500/40 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
        >
          <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-slate-50/90 via-slate-50/40 to-slate-100/60 rounded-[1.5rem] m-2 p-4 flex items-center justify-center transition-colors duration-300 group-hover/card:from-emerald-50/40 group-hover/card:to-teal-50/30">
            <Image
              src={product.image}
              alt={displayName}
              fill
              className="object-contain mix-blend-multiply p-6 transition-transform duration-500 ease-out group-hover/card:scale-110"
              sizes="200px"
            />
            {product.variantCount > 1 && (
              <div className="absolute top-2.5 right-2.5 z-10">
                <span className="inline-flex items-center rounded-full bg-slate-900/85 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-black text-emerald-300 shadow-sm border border-emerald-500/30">
                  {product.variantCount} Tipe
                </span>
              </div>
            )}
            <div className="absolute top-2.5 left-2.5 z-10">
              {product.isReadyStock && availableStockCount > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-[10px] font-black shadow-sm">
                  Ready {availableStockCount} pcs
                </span>
              ) : !product.isReadyStock && !isSoldOut ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-600 px-2.5 py-0.5 text-[10px] font-black text-white shadow-sm">
                  PO {product.leadTime || ""}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-rose-300 shadow-sm">
                  Stok habis
                </span>
              )}
            </div>
            {showPromoMerdeka && product.isReadyStock && availableStockCount > 0 && Number(product.price) < 20000000 && Number(product.price) > 0 && (
              <div className="absolute bottom-2.5 right-2.5 z-10">
                <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-black text-white shadow-sm animate-pulse">
                  🔥 -17%
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1 px-4 pt-2.5 pb-4">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 truncate">
              {product.brand || product.categoryLabel}
            </p>
            <CompactHeading className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover/card:text-emerald-600 transition-colors">
              {displayName}
            </CompactHeading>
            <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs font-black text-slate-900 truncate">
                {priceDisplay}
              </span>
              <span className="text-[11px] font-black text-emerald-600 group-hover/card:translate-x-1 transition-transform inline-flex items-center gap-1">
                Detail →
              </span>
            </div>
          </div>
        </Link>
      );
    }

  return (
    <Link
      href={`/katalog/${product.slug}`}
      className="group/card flex flex-col overflow-hidden rounded-[2.25rem] bg-white border border-slate-200/80 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-emerald-950/10 hover:border-emerald-500/50 hover:-translate-y-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 h-full relative"
    >
      {/* Image Area - Studio Glass Look */}
      <div className="relative aspect-square shrink-0 overflow-hidden bg-gradient-to-b from-slate-50/90 via-slate-50/50 to-slate-100/60 rounded-[2rem] m-2.5 transition-colors duration-500 group-hover/card:from-emerald-50/40 group-hover/card:to-teal-50/30 w-[calc(100%-1.25rem)]">
        <Image
          src={product.image}
          alt={displayName}
          fill
          className="object-contain mix-blend-multiply p-8 transition-transform duration-700 ease-out group-hover/card:scale-110"
          quality={80}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 280px"
        />
        
        {/* Floating Badges inside Image Area */}
        {product.variantCount > 1 && (
          <div className="absolute top-3.5 right-3.5 z-10">
            <span className="inline-flex items-center rounded-2xl bg-slate-900/85 backdrop-blur-md px-3 py-1.5 text-[11px] font-black text-emerald-300 shadow-md border border-emerald-500/30 tracking-wide">
              {product.variantCount} Varian
            </span>
          </div>
        )}
        {/* Stock Badge inside Image Area */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-col gap-1 items-start">
          {product.isReadyStock && availableStockCount > 0 ? (
            <>
              <AntiIndentBadge variant="compact" />
              <span className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white backdrop-blur-md px-3.5 py-1 text-[11px] font-black shadow-lg shadow-emerald-600/30 border border-white/20">
                <span className="flex h-2 w-2 rounded-full bg-emerald-300 animate-ping"></span>
                Ready Stock: {availableStockCount} pcs
              </span>
            </>
          ) : !product.isReadyStock && !isSoldOut ? (
            <span className="inline-flex items-center gap-1 rounded-2xl bg-amber-600/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-black text-white shadow-md border border-white/20">
              PO {product.leadTime || ""}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-2xl bg-slate-800/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-rose-300 shadow-md border border-rose-500/30">
              <AlertCircle className="h-3.5 w-3.5 text-rose-400" /> Stok habis
            </span>
          )}
        </div>
        {/* Promo MERDEKA Badge */}
        {showPromoMerdeka && product.isReadyStock && availableStockCount > 0 && Number(product.price) < 20000000 && Number(product.price) > 0 && (
          <div className="absolute bottom-3.5 right-3.5 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 px-3.5 py-1.5 text-xs font-black text-white shadow-lg shadow-red-600/40 animate-pulse border border-white/25">
              🔥 -17% 🇮🇩
            </span>
          </div>
        )}
      </div>

      {/* Content Area - Scientific Trust Studio */}
      <div className="flex flex-col flex-1 px-5 pt-3.5 pb-5">
        <div className="mb-4">
           <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700/80 mb-1.5 truncate group-hover/card:text-emerald-600 transition-colors">
             {product.brand || product.categoryLabel}
           </p>
           <Heading className="text-lg font-black text-slate-900 group-hover/card:text-emerald-700 transition-colors line-clamp-2 leading-snug">
             {displayName}
           </Heading>
        </div>
        
        {/* Price and CTA */}
        <div className="mt-auto flex flex-col gap-3.5 pt-3.5 border-t border-slate-100">
          {/* Price or Tag */}
          <div>
             {showPromoMerdeka && isReadyToBuy && Number(product.price) > 0 ? (
               <>
                 <span className="text-xs font-semibold text-slate-400 line-through block">
                   {priceDisplay}
                 </span>
                 <span className="text-lg font-black text-red-600 tracking-tight">
                   {money.formatIDR(
                     money.toDecimal(product.price).mul(83).dividedBy(100).toDecimalPlaces(0)
                   )}
                 </span>
                 <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-black text-red-600 bg-red-50 px-2.5 py-0.5 rounded-lg border border-red-200">
                   🔥 Promo MERDEKA 🇮🇩
                 </span>
               </>
             ) : (
               <>
                 <span className={`text-lg font-black tracking-tight ${isReadyToBuy || ekatalogRow ? "text-emerald-600" : isSoldOut ? "text-red-500" : "text-slate-900"}`}>
                   {priceDisplay}
                 </span>
                 {ekatalogSavings !== null && (
                   <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-gradient-to-r from-emerald-50 to-teal-50 px-2.5 py-1 rounded-xl border border-emerald-300/60 shadow-2xs">
                     ✨ Hemat {ekatalogSavings}% vs e-Katalog
                   </span>
                 )}
               </>
             )}
          </div>

          <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
            <span>💬 Butuh spec khusus? <span className="text-emerald-600 font-bold underline">Konsultasi gratis</span></span>
          </p>

          {/* Quick Action Button - Touch-safe min-h-[44px] */}
          <button
            onClick={handleAdd}
            disabled={added}
            aria-label={isReadyToBuy ? `Beli Sekarang ${displayName}` : `Minta Penawaran ${displayName}`}
            className={`w-full flex items-center justify-center min-h-[44px] px-4 rounded-2xl text-sm font-black transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 active:scale-[0.98] ${
              added
                ? "bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs"
                : isReadyToBuy 
                  ? "bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-600/35 hover:-translate-y-0.5"
                  : "bg-slate-900 text-white shadow-md shadow-slate-900/20 group-hover/card:bg-gradient-to-r group-hover/card:from-emerald-600 group-hover/card:to-teal-700 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5"
            }`}
          >
            {added ? <Check className="h-4 w-4 mr-2 text-emerald-600" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
            <span>{added ? "Ditambahkan" : isReadyToBuy ? "Beli Sekarang" : "Minta Penawaran"}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
