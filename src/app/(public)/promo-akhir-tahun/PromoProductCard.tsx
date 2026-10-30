"use client";

import Image from "next/image";
import { useState } from "react";
import {
  PromoProduct,
  PromoPaymentMethodId,
  promoPaymentTiers,
} from "@/data/promo-akhir-tahun";
import {
  formatPromoRupiah,
  getStockLabel,
  buildProductSphMessage,
  calculatePromoPriceByPayment,
} from "@/lib/promo-akhir-tahun";
import PromoWaLink from "./PromoWaLink";
import { Check, Sparkles, MessageSquare, Tag } from "lucide-react";

interface PromoProductCardProps {
  product: PromoProduct;
  catalogId: string;
  catalogName: string;
  catalogBonus: string[];
  theme: "blue-amber" | "navy-teal" | "slate-gold";
  promoPhase?: string;
  selectedPaymentId?: PromoPaymentMethodId;
  onSelectPayment?: (id: PromoPaymentMethodId) => void;
}

export default function PromoProductCard({
  product,
  catalogId,
  catalogName,
  catalogBonus,
  theme,
  promoPhase = "active",
  selectedPaymentId,
  onSelectPayment,
}: PromoProductCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    product.image || `/images/promo/${product.slug}.jpg`
  );
  const [localPaymentId, setLocalPaymentId] = useState<PromoPaymentMethodId>("cash");

  const activePaymentId = selectedPaymentId ?? localPaymentId;
  const activeTier =
    promoPaymentTiers.find((t) => t.id === activePaymentId) || promoPaymentTiers[0];

  const handlePaymentSelect = (id: PromoPaymentMethodId) => {
    if (onSelectPayment) {
      onSelectPayment(id);
    } else {
      setLocalPaymentId(id);
    }
  };

  const priceCalc = calculatePromoPriceByPayment(
    product.normalPrice,
    activeTier.discountPercent
  );
  const discountedPriceNum = Number(priceCalc.discountedPrice);
  const savingAmountNum = Number(priceCalc.savingAmount);
  const maxCashCalc = calculatePromoPriceByPayment(product.normalPrice, 8);

  const stockLabel = getStockLabel(product.stock);
  const isLastUnit = product.stock === 1;
  const sphMessage = buildProductSphMessage(
    product.name,
    product.model,
    activeTier.shortLabel,
    formatPromoRupiah(discountedPriceNum)
  );

  // Maksimal 3 chip bonus di kartu
  const topChips = catalogBonus.slice(0, 3);

  // Border and accent styling based on theme
  const themeCardStyles = {
    "blue-amber": "border-blue-100 hover:border-blue-400 group-hover:shadow-blue-500/10",
    "navy-teal": "border-teal-100 hover:border-teal-400 group-hover:shadow-teal-500/10",
    "slate-gold": "border-slate-200 hover:border-amber-400 group-hover:shadow-amber-500/10",
  }[theme];

  const themeBtnStyles = {
    "blue-amber": "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20",
    "navy-teal": "bg-gradient-to-r from-slate-900 to-teal-800 hover:from-slate-950 hover:to-teal-900 text-white shadow-teal-500/20",
    "slate-gold": "bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-slate-950 hover:to-black text-amber-300 border border-amber-500/30 shadow-amber-500/10",
  }[theme];

  return (
    <div
      className={`group relative flex flex-col bg-white rounded-2xl border ${themeCardStyles} shadow-sm hover:shadow-xl transition-all duration-300 ease-[var(--ease-out)] overflow-hidden`}
    >
      {/* Top badges: Stock & Brand */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-xs ${
            isLastUnit
              ? "bg-rose-500 text-white animate-pulse"
              : "bg-slate-900/80 backdrop-blur-md text-white border border-white/20"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isLastUnit ? "bg-white" : "bg-emerald-400"}`}></span>
          {stockLabel}
        </span>

        <span className="inline-flex items-center rounded-lg bg-white/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200/80 shadow-2xs">
          {product.brand}
        </span>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square w-full bg-slate-50/60 p-6 flex items-center justify-center overflow-hidden border-b border-slate-100">
        <Image
          src={imgSrc}
          alt={`${product.name} ${product.model} - ${product.brand}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgSrc("/images/promo/placeholder.svg")}
          loading="lazy"
        />

        {/* Floating Discount Indicator on Image Bottom-Left */}
        {activeTier.discountPercent > 0 && (
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 rounded-lg bg-rose-600 text-white px-2.5 py-1 text-[11px] font-black uppercase tracking-wide shadow-md">
              <Tag className="w-3 h-3 shrink-0" />
              <span>Diskon Promo -{activeTier.discountPercent}%</span>
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        {/* Model code badge */}
        <div className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {product.model}
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* Hook - 1 baris */}
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed line-clamp-1 italic">
          &ldquo;{product.hook}&rdquo;
        </p>

        {/* Spec line: HANYA jika terisi, tidak boleh mengarang */}
        {product.specLine && product.specLine.trim().length > 0 && (
          <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
            {product.specLine}
          </div>
        )}

        {/* Bonus Chips (Max 3) */}
        {topChips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
            {topChips.map((chip, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md bg-blue-50/80 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200/60"
              >
                <Check className="w-3 h-3 text-blue-600 shrink-0" />
                <span className="truncate max-w-[170px]">{chip}</span>
              </span>
            ))}
          </div>
        )}

        {/* Price & Payment Discount Indicator */}
        <div className="mt-auto pt-4">
          {/* Payment Method Mini Selector */}
          <div className="mb-3 rounded-xl bg-slate-50 p-2 border border-slate-200/80">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center justify-between">
              <span>Pilih Cara Bayar (Diskon Otomatis):</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {promoPaymentTiers.map((tier) => {
                const isSelected = tier.id === activePaymentId;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => handlePaymentSelect(tier.id)}
                    className={`px-1.5 py-1 rounded-lg text-[10px] font-bold transition-all text-center leading-tight ${
                      isSelected
                        ? "bg-rose-600 text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                    }`}
                  >
                    <div>
                      {tier.id === "cash"
                        ? "Tunai"
                        : tier.id === "dp50"
                        ? "DP 50%"
                        : tier.id === "dp30"
                        ? "DP 30%"
                        : "Tempo"}
                    </div>
                    <div
                      className={`text-[9px] font-extrabold ${
                        isSelected ? "text-rose-100" : "text-rose-600"
                      }`}
                    >
                      {tier.discountPercent > 0 ? `-${tier.discountPercent}%` : "Normal"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Strikethrough Normal Price & Discounted Promo Price */}
          <div className="flex flex-col mb-2">
            {activeTier.discountPercent > 0 ? (
              <>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="inline-flex items-center rounded-md bg-rose-100 border border-rose-200 px-1.5 py-0.5 text-[11px] font-black text-rose-700">
                    -{activeTier.discountPercent}%
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 line-through font-semibold">
                    {formatPromoRupiah(product.normalPrice)}
                  </span>
                </div>
                <span className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
                  {formatPromoRupiah(discountedPriceNum)}
                </span>
                <span className="mt-1 inline-flex items-center gap-1 self-start rounded-md bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                  <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>
                    Hemat {formatPromoRupiah(savingAmountNum)} ({activeTier.shortLabel})
                  </span>
                </span>
              </>
            ) : (
              <>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Harga Katalog Normal (Tempo 30 Hari)
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {formatPromoRupiah(product.normalPrice)}
                </span>
                <button
                  type="button"
                  onClick={() => handlePaymentSelect("cash")}
                  className="mt-1 inline-flex items-center gap-1 self-start rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2 py-0.5 text-[11px] font-bold text-amber-800 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>
                    Klik Tunai untuk hemat {formatPromoRupiah(Number(maxCashCalc.savingAmount))} (-8%)
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Ready stock label below price */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Ready stock</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 text-[11px] font-normal">Faktur &amp; BAST Resmi</span>
          </div>

          {/* CTA: Minta SPH */}
          <PromoWaLink
            message={sphMessage}
            productName={product.name}
            productModel={product.model}
            catalogId={catalogId}
            catalogName={catalogName}
            promoPhase={promoPhase}
            placement="product_card"
            className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold shadow-md transition-all duration-200 active:scale-[0.98] ${themeBtnStyles}`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>
              Minta SPH ({activeTier.discountPercent > 0 ? `Diskon ${activeTier.discountPercent}%` : "Tempo 30 Hr"})
            </span>
          </PromoWaLink>
        </div>
      </div>
    </div>
  );
}
