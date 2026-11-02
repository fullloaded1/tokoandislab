/* Hallmark · component: ProductCard · genre: corporate-b2b · 8-state-ui: pass · contrast: pass · decimal-safety: pass */
"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, AlertCircle, ArrowRight, FileText, Tag } from "lucide-react";
import { useRFQStore } from "@/store/useRFQStore";
import { useState } from "react";
import { money } from "@/lib/money";
import { getReadyStockSummary } from "@/lib/readyStock";
import { getEkatalogSavings } from "@/lib/ekatalog";
import { useToast } from "@/components/Toast";
import { calculatePromoPriceByPayment } from "@/lib/promo-akhir-tahun";
import AntiIndentBadge from "@/components/AntiIndentBadge";

interface ProductCardProps {
  product: any;
  compact?: boolean;
  showPromoMerdeka?: boolean;
  showPromoAkhirTahun?: boolean;
  /** Heading level for the product name. Adjust per-page to keep H1→H2→H3 hierarchy. */
  headingLevel?: "h2" | "h3" | "h4";
}

export default function ProductCard({
  product,
  compact = false,
  showPromoMerdeka = false,
  showPromoAkhirTahun = false,
  headingLevel = "h3",
}: ProductCardProps) {
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

  // Baris e-Katalog (% hemat untuk model yang relevan)
  const ekatalogSavings = getEkatalogSavings(product.model, product.name);

  // Cek apakah produk PO Andislab/Daihan dengan harga > 0
  const isPOWithPrice900 =
    !isReadyToBuy &&
    !isSoldOut &&
    (product.category === "andislab-custom" || product.category === "daihan-labtech") &&
    Number(product.price) > 0;

  // Satu produk = satu harga akurat sesuai database & Master Inventory
  let priceDisplay: string = "Minta Penawaran";
  if (isReadyToBuy) {
    priceDisplay = summary.hasPriceRange
      ? `Mulai ${money.formatIDR(summary.minPrice)}`
      : money.formatIDR(summary.minPrice);
  } else if (isSoldOut) {
    priceDisplay = "Stok Habis";
  } else if (isPOWithPrice900) {
    priceDisplay = money.formatIDR(Number(product.price));
  }

  // Promo Akhir Tahun 2026 (Diskon Tunai / Cash 8%)
  const isPromoEligible =
    showPromoAkhirTahun &&
    ((isReadyToBuy && (summary.minPrice > 0 || Number(product.price) > 0)) ||
      (isPOWithPrice900 && Number(product.price) > 0));

  const basePriceNum = isReadyToBuy
    ? summary.minPrice > 0
      ? summary.minPrice
      : Number(product.price) || 0
    : Number(product.price) || 0;

  const promoCalc =
    isPromoEligible && basePriceNum > 0
      ? calculatePromoPriceByPayment(basePriceNum, 8)
      : null;

  const promoDiscountedPriceNum = promoCalc ? Number(promoCalc.discountedPrice) : basePriceNum;
  const promoSavingAmountNum = promoCalc ? Number(promoCalc.savingAmount) : 0;

  const availableVariant = summary.firstAvailable ?? product.variants?.find((v: any) => (v.stock - v.reservedStock) > 0) ?? null;
  const availableStockCount = availableVariant ? Math.max(0, availableVariant.stock - availableVariant.reservedStock) : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isReadyToBuy && availableVariant) {
      let finalPrice = money.toDecimal(availableVariant.price).toNumber();
      if (isPromoEligible) {
        const promoCalc = calculatePromoPriceByPayment(finalPrice, 8);
        finalPrice = Number(promoCalc.discountedPrice);
      }

      // Masuk ke keranjang Direct Purchase
      const res = addItem({
        id: availableVariant.id,
        productId: product.id,
        variantId: availableVariant.id,
        slug: product.slug,
        name: isPromoEligible
          ? `${displayName} (${availableVariant.name ?? "Default"}) - Promo Akhir Tahun`
          : `${displayName} (${availableVariant.name ?? "Default"})`,
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
      let rfqPrice = money.toDecimal(product.price).toNumber();
      if (isPromoEligible && rfqPrice > 0) {
        const promoCalc = calculatePromoPriceByPayment(rfqPrice, 8);
        rfqPrice = Number(promoCalc.discountedPrice);
      }

      // Masuk ke keranjang RFQ
      const res = addItem({
        id: product.id,
        productId: product.id,
        slug: product.slug,
        name: isPromoEligible ? `${displayName} - Promo Akhir Tahun` : displayName,
        image: product.image,
        category: product.categoryLabel,
        price: rfqPrice,
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
        className="group/card flex flex-col overflow-hidden bg-white border border-slate-200 hover:border-blue-400 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded-lg"
      >
        <div className="relative aspect-square overflow-hidden bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4">
          <Image
            src={product.image}
            alt={displayName}
            fill
            className="object-contain mix-blend-multiply p-4 transition-transform duration-300 group-hover/card:scale-105"
            sizes="200px"
          />
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {product.isReadyStock && availableStockCount > 0 ? (
              <span className="inline-flex items-center rounded-sm bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 text-[10px] font-semibold">
                Ready: {availableStockCount} pcs
              </span>
            ) : !product.isReadyStock && !isSoldOut ? (
              <span className="inline-flex items-center rounded-sm bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 text-[10px] font-semibold">
                PO {product.leadTime || ""}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-sm bg-red-50 border border-red-200 text-red-600 px-2 py-0.5 text-[10px] font-semibold">
                Stok habis
              </span>
            )}
            {isPromoEligible && (
              <span className="inline-flex items-center rounded-sm bg-rose-600 text-white px-1.5 py-0.5 text-[9px] font-bold">
                Promo -8%
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 truncate">
            {product.brand || product.categoryLabel}
          </p>
          <CompactHeading className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug group-hover/card:text-blue-700 transition-colors">
            {displayName}
          </CompactHeading>
          <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-100">
            {isPromoEligible ? (
              <div className="truncate">
                <span className="text-[10px] text-slate-400 line-through block leading-none">
                  {summary.hasPriceRange ? `Mulai ${money.formatIDR(basePriceNum)}` : money.formatIDR(basePriceNum)}
                </span>
                <span className="text-xs font-bold text-rose-700 truncate">
                  {summary.hasPriceRange ? `Mulai ${money.formatIDR(promoDiscountedPriceNum)}` : money.formatIDR(promoDiscountedPriceNum)}
                </span>
              </div>
            ) : (
              <span className="text-xs font-bold text-slate-900 truncate">
                {priceDisplay}
              </span>
            )}
            <span className="text-[11px] font-semibold text-blue-600 inline-flex items-center gap-1">
              Detail <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/katalog/${product.slug}`}
      className="group/card flex flex-col overflow-hidden bg-white border border-slate-200 transition-all duration-200 hover:border-blue-400 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 h-full rounded-xl relative"
    >
      {/* Image Area - Corporate Clean */}
      <div className="relative aspect-square shrink-0 overflow-hidden bg-slate-50/80 border-b border-slate-100 w-full">
        <Image
          src={product.image}
          alt={displayName}
          fill
          className="object-contain mix-blend-multiply p-6 transition-transform duration-300 ease-out group-hover/card:scale-105"
          quality={80}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 280px"
        />
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.isReadyStock && availableStockCount > 0 ? (
            <>
              <span className="inline-flex items-center rounded-sm bg-white border border-blue-200 text-blue-700 shadow-sm px-2.5 py-1 text-[11px] font-semibold">
                Ready Stock: {availableStockCount} pcs
              </span>
            </>
          ) : !product.isReadyStock && !isSoldOut ? (
            <span className="inline-flex items-center rounded-sm bg-white border border-slate-200 text-slate-600 shadow-sm px-2.5 py-1 text-[11px] font-semibold">
              Pre-Order {product.leadTime || ""}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-sm bg-white border border-red-200 text-red-600 shadow-sm px-2.5 py-1 text-[11px] font-semibold">
              <AlertCircle className="h-3 w-3" /> Out of Stock
            </span>
          )}
          
          {product.variantCount > 1 && (
            <span className="inline-flex items-center rounded-sm bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 text-[10px] font-semibold">
              {product.variantCount} Varian Spesifikasi
            </span>
          )}
        </div>

        {/* Floating Promo Akhir Tahun Badge */}
        {isPromoEligible && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-white shadow-md">
              <Tag className="h-3 w-3" />
              Promo Akhir Tahun -8%
            </span>
          </div>
        )}

        {showPromoMerdeka && product.isReadyStock && availableStockCount > 0 && Number(product.price) < 20000000 && Number(product.price) > 0 && (
          <div className="absolute bottom-3 right-3 z-10">
            <span className="inline-flex items-center rounded-sm bg-red-700 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
              Promo Kemerdekaan -17%
            </span>
          </div>
        )}
      </div>

      {/* Content Area - B2B Professional */}
      <div className="flex flex-col flex-1 p-5">
        <div className="mb-4">
           <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 truncate group-hover/card:text-blue-600 transition-colors">
             {product.brand || product.categoryLabel}
           </p>
           <Heading className="text-base font-semibold text-slate-900 group-hover/card:text-blue-700 transition-colors line-clamp-2 leading-snug">
             {displayName}
           </Heading>
        </div>
        
        {/* Specs List */}
        <div className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
          {product.description ? (
            <span dangerouslySetInnerHTML={{ __html: product.description.substring(0, 100) + "..." }} />
          ) : (
            "Konsultasikan spesifikasi teknis alat lab ini dengan representatif kami."
          )}
        </div>
        
        {/* Price and CTA */}
        <div className="mt-auto flex flex-col gap-4 pt-4 border-t border-slate-100">
          <div>
             {isPromoEligible ? (
               <div>
                 <div className="flex items-center gap-2 mb-0.5">
                   <span className="text-xs font-semibold text-slate-400 line-through">
                     {summary.hasPriceRange ? `Mulai ${money.formatIDR(basePriceNum)}` : money.formatIDR(basePriceNum)}
                   </span>
                   <span className="inline-flex items-center rounded bg-rose-100 text-rose-700 text-[10px] font-black px-1.5 py-0.5">
                     Diskon 8%
                   </span>
                 </div>
                 <div className="text-xl font-black text-slate-900 tracking-tight">
                   {summary.hasPriceRange ? `Mulai ${money.formatIDR(promoDiscountedPriceNum)}` : money.formatIDR(promoDiscountedPriceNum)}
                 </div>
                 <span className="mt-1 block text-xs font-semibold text-rose-600">
                   Hemat {money.formatIDR(promoSavingAmountNum)} (Skema Tunai Akhir Tahun)
                 </span>
                 {ekatalogSavings !== null && (
                   <span className="mt-0.5 block text-[11px] font-medium text-blue-700">
                     Lebih hemat {ekatalogSavings}% dari e-Katalog
                   </span>
                 )}
               </div>
             ) : showPromoMerdeka && isReadyToBuy && Number(product.price) > 0 ? (
               <>
                 <span className="text-xs font-medium text-slate-400 line-through block">
                   {priceDisplay}
                 </span>
                 <span className="text-lg font-bold text-slate-900">
                   {money.formatIDR(
                     money.toDecimal(product.price).mul(83).dividedBy(100).toDecimalPlaces(0)
                   )}
                 </span>
               </>
             ) : (
               <>
                 <span className={`text-lg font-bold ${isSoldOut ? "text-slate-500" : "text-slate-900"}`}>
                   {priceDisplay}
                 </span>
                 {ekatalogSavings !== null && (
                   <span className="mt-1 block text-xs font-medium text-blue-700">
                     Lebih hemat {ekatalogSavings}% dari e-Katalog
                   </span>
                 )}
               </>
             )}
          </div>

          <button
            onClick={handleAdd}
            disabled={added}
            aria-label={isReadyToBuy ? `Beli Sekarang ${displayName}` : `Minta Penawaran ${displayName}`}
            className={`w-full flex items-center justify-center min-h-[40px] px-4 rounded-md text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              added
                ? "bg-slate-100 text-slate-700 border border-slate-200"
                : isReadyToBuy 
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {added ? (
              <Check className="h-4 w-4 mr-2" />
            ) : isReadyToBuy ? (
              <ShoppingCart className="h-4 w-4 mr-2" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            <span>{added ? "Ditambahkan" : isReadyToBuy ? "Beli Sekarang" : "Minta Penawaran"}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
