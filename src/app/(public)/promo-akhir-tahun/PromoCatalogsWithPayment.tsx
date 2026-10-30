"use client";

import React, { useState } from "react";
import {
  PromoCatalog,
  PromoPaymentMethodId,
  promoPaymentTiers,
} from "@/data/promo-akhir-tahun";
import CatalogSection from "./CatalogSection";
import { Coins, CheckCircle2, Tag } from "lucide-react";

interface PromoCatalogsWithPaymentProps {
  catalogs: PromoCatalog[];
  promoPhase?: string;
}

export default function PromoCatalogsWithPayment({
  catalogs,
  promoPhase = "active",
}: PromoCatalogsWithPaymentProps) {
  const [selectedPaymentId, setSelectedPaymentId] =
    useState<PromoPaymentMethodId>("cash");

  const activeTier =
    promoPaymentTiers.find((t) => t.id === selectedPaymentId) ||
    promoPaymentTiers[0];

  return (
    <div>
      {/* Interactive Payment Method & Discount Selector Bar */}
      <section
        id="skema-diskon"
        className="scroll-mt-20 bg-white border-b border-slate-200 shadow-xs sticky top-16 z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            {/* Left Info */}
            <div className="flex items-start sm:items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
                <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-slate-900">
                    Pilih Cara Pembayaran (Harga Diskon Otomatis Menyesuaikan):
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 border border-rose-200 px-2.5 py-0.5 text-[11px] font-extrabold text-rose-700">
                    <Coins className="w-3 h-3" />
                    Aktif: {activeTier.shortLabel}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                  {activeTier.terms} — {activeTier.eligibility}
                </p>
              </div>
            </div>

            {/* Right Payment Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
              {promoPaymentTiers.map((tier) => {
                const isSelected = tier.id === selectedPaymentId;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedPaymentId(tier.id)}
                    className={`flex flex-col items-start sm:items-center justify-center px-3 py-2 rounded-xl border text-left sm:text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-1 text-xs font-extrabold">
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                      <span>
                        {tier.id === "cash"
                          ? "Tunai / Cash"
                          : tier.id === "dp50"
                          ? "DP 50%"
                          : tier.id === "dp30"
                          ? "DP 30%"
                          : "Tempo 30 Hari"}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-black ${
                        isSelected
                          ? "text-rose-100"
                          : tier.discountPercent > 0
                          ? "text-rose-600"
                          : "text-slate-500"
                      }`}
                    >
                      {tier.discount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3 Catalogs Sections */}
      <div className="space-y-0">
        {catalogs.map((catalog) => (
          <CatalogSection
            key={catalog.id}
            catalog={catalog}
            promoPhase={promoPhase}
            selectedPaymentId={selectedPaymentId}
            onSelectPayment={setSelectedPaymentId}
          />
        ))}
      </div>
    </div>
  );
}

