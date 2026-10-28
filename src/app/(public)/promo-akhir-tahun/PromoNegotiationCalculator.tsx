"use client";

import React, { useState, useMemo } from "react";
import {
  Calculator,
  CheckCircle2,
  Award,
  AlertTriangle,
  Ban,
  Sparkles,
  Plus,
  Minus,
  Trash2,
  Send,
  SlidersHorizontal,
  Layers,
  ShieldCheck,
  Search,
  Check,
  Gift,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { PROMO_CALCULATOR_PRODUCTS } from "@/lib/promo-negotiation/promoCatalogItems";
import {
  simulateCustomerBid,
  maximizeBudget,
  DISCOUNT_TIERS,
} from "@/lib/promo-negotiation/negotiationEngine";
import { PromoCalculatorProduct, SelectedItem } from "@/lib/promo-negotiation/types";
import { WA_NUMBER } from "@/data/promo-akhir-tahun";

type ActiveTab = "negotiation" | "maximizer" | "terms";

const BUDGET_PRESETS = [
  { label: "Plafon Rp 25 Juta", amount: 25000000, desc: "Peremajaan instrumen dasar & QC rutin" },
  { label: "Plafon Rp 50 Juta", amount: 50000000, desc: "Upgrade unit utama (shaker / rotary)" },
  { label: "Plafon Rp 70 Juta", amount: 70000000, desc: "Plafon Tier B (Oven, Incubator, Autoclave)" },
  { label: "Plafon Rp 100 Juta", amount: 100000000, desc: "Paket lengkap riset & pengujian analitik" },
  { label: "Plafon Rp 150 Juta", amount: 150000000, desc: "Paket multi-instrumen farmasi & QC" },
  { label: "Plafon Rp 200 Juta", amount: 200000000, desc: "Plafon Tier C (Spectro, Biosafety, Muffle)" },
];

export default function PromoNegotiationCalculator() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("negotiation");

  // Selected items state
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(() => {
    // Default preset: A-01 (pH Meter) + B-01 (Oven)
    const p1 = PROMO_CALCULATOR_PRODUCTS.find((p) => p.code === "A-01") || PROMO_CALCULATOR_PRODUCTS[0];
    return [{ product: p1, qty: 1 }];
  });

  // Filter & Search states
  const [selectedTierFilter, setSelectedTierFilter] = useState<"ALL" | "A" | "B" | "C">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Customer bid state
  const [customBidInput, setCustomBidInput] = useState<string>("");

  // Filtered available products for selection modal/drawer
  const filteredProducts = useMemo(() => {
    return PROMO_CALCULATOR_PRODUCTS.filter((p) => {
      if (selectedTierFilter !== "ALL" && p.tier !== selectedTierFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.model.toLowerCase().includes(q)
      );
    });
  }, [selectedTierFilter, searchQuery]);

  // Catalog total for default bid initialization
  const rawCatalogTotal = useMemo(() => {
    return selectedItems.reduce((acc, it) => acc + it.product.price * it.qty, 0);
  }, [selectedItems]);

  // Current active bid amount
  const activeBidAmount = useMemo(() => {
    if (customBidInput !== "") {
      const parsed = parseInt(customBidInput.replace(/[^0-9]/g, ""), 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return rawCatalogTotal;
  }, [customBidInput, rawCatalogTotal]);

  // Simulation calculation
  const simulation = useMemo(() => {
    return simulateCustomerBid(selectedItems, activeBidAmount);
  }, [selectedItems, activeBidAmount]);

  // Add product handler
  const handleAddProduct = (prod: PromoCalculatorProduct) => {
    setSelectedItems((prev) => {
      const existing = prev.find((it) => it.product.code === prod.code);
      if (existing) {
        return prev.map((it) =>
          it.product.code === prod.code ? { ...it, qty: it.qty + 1 } : it
        );
      }
      return [...prev, { product: prod, qty: 1 }];
    });
    setCustomBidInput(""); // Reset custom bid to match new catalog total
  };

  // Update qty handler
  const handleUpdateQty = (code: string, delta: number) => {
    setSelectedItems((prev) => {
      return prev
        .map((it) => {
          if (it.product.code === code) {
            const newQty = it.qty + delta;
            return newQty > 0 ? { ...it, qty: newQty } : null;
          }
          return it;
        })
        .filter(Boolean) as SelectedItem[];
    });
    setCustomBidInput("");
  };

  // Remove product handler
  const handleRemoveProduct = (code: string) => {
    setSelectedItems((prev) => prev.filter((it) => it.product.code !== code));
    setCustomBidInput("");
  };

  // Preset discount setter
  const handleApplyDiscountPreset = (discountPct: number) => {
    const discounted = Math.round(rawCatalogTotal * (1 - discountPct / 100));
    setCustomBidInput(discounted.toString());
  };

  // Preset Budget Maximizer handler
  const handleApplyBudgetPreset = (budgetAmount: number) => {
    const res = maximizeBudget(budgetAmount, PROMO_CALCULATOR_PRODUCTS);
    if (res.selectedItems.length > 0) {
      setSelectedItems(res.selectedItems);
      setCustomBidInput(res.totalAbsorbed);
      setActiveTab("negotiation");
    }
  };

  // WhatsApp Message Generator
  const generateWhatsAppLink = () => {
    const itemsList = selectedItems
      .map(
        (it) =>
          `• [${it.product.code}] ${it.product.name} (${it.product.brand} ${it.product.model}) x ${it.qty} unit`
      )
      .join("%0A");

    const totalKatalogStr = new Intl.NumberFormat("id-ID").format(
      Number(simulation.catalogTotal)
    );
    const tawaranStr = new Intl.NumberFormat("id-ID").format(
      Number(simulation.customerBid)
    );

    const text =
      `Halo Tim Sales AndisLab, saya ingin mengajukan penawaran Promo Akhir Tahun:%0A%0A` +
      `*Daftar Produk Ready Stock Terpilih:*%0A${itemsList}%0A%0A` +
      `*Total Katalog:* Rp ${totalKatalogStr}%0A` +
      `*Target Tawaran / Anggaran Kami:* Rp ${tawaranStr} (Diskon ${simulation.discountPercent}%)%0A` +
      `*Skema Pembayaran yang Diajukan:* ${simulation.suggestedTerms}%0A` +
      `*Klaim Bonus:* ${simulation.eligibleBonuses.join(", ")}%0A%0A` +
      `Mohon konfirmasi persetujuan harga dan penerbitan Surat Penawaran Harga (SPH) resmi sebelum tutup tahun. Terima kasih!`;

    return `https://wa.me/${WA_NUMBER}?text=${text}`;
  };

  return (
    <section
      id="kalkulator-promo"
      className="relative overflow-hidden bg-slate-900 text-slate-100 py-16 sm:py-24 border-y border-slate-800"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-400/30 px-4 py-1.5 text-xs font-bold text-blue-300 mb-4 backdrop-blur-md">
            <Calculator className="w-4 h-4 text-blue-400" />
            <span>Kalkulator Negosiasi &amp; Optimasi Anggaran Promo</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Simulasikan Anggaran &amp; Diskon Promo Terbaik
          </h2>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Punya sisa anggaran akhir tahun yang harus diserap? Pilih instrumen ready stock,
            masukkan pagu atau target tawaran Anda, dan lihat rekomendasi skema penawaran resmi
            dalam hitungan detik.
          </p>

          {/* Navigation Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveTab("negotiation")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "negotiation"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700/80 border border-slate-700"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>1. Nego Tawaran Paket</span>
            </button>

            <button
              onClick={() => setActiveTab("maximizer")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "maximizer"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700/80 border border-slate-700"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>2. Habiskan Sisa Anggaran (Auto-Pack)</span>
            </button>

            <button
              onClick={() => setActiveTab("terms")}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "terms"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700/80 border border-slate-700"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>3. Matriks Diskon &amp; Termin</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: CUSTOMER BID SIMULATOR & NEGOTIATION ENGINE        */}
        {/* ========================================================= */}
        {activeTab === "negotiation" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Product Picker & Cart (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Selected Cart Table */}
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <h3 className="text-base font-bold text-white">
                      Instrumen Promo Terpilih ({selectedItems.length})
                    </h3>
                  </div>
                  {selectedItems.length > 0 && (
                    <button
                      onClick={() => setSelectedItems([])}
                      className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors"
                    >
                      Hapus Semua
                    </button>
                  )}
                </div>

                {selectedItems.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 space-y-2">
                    <Layers className="w-10 h-10 mx-auto text-slate-500 stroke-1" />
                    <p className="text-sm font-medium">Belum ada instrumen yang dipilih.</p>
                    <p className="text-xs text-slate-400">
                      Pilih produk dari daftar di bawah untuk memulai simulasi.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-700/60 mt-3 max-h-72 overflow-y-auto pr-1">
                    {selectedItems.map((it) => (
                      <div
                        key={it.product.code}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                              {it.product.code}
                            </span>
                            <span className="font-bold text-slate-100">{it.product.name}</span>
                          </div>
                          <p className="text-xs text-slate-400">
                            {it.product.brand} • {it.product.model} • Ready {it.product.stock} Unit
                          </p>
                          <div className="text-xs font-semibold text-emerald-400">
                            Rp {new Intl.NumberFormat("id-ID").format(it.product.price)} / unit
                          </div>
                        </div>

                        {/* Qty & Remove */}
                        <div className="flex items-center gap-3 justify-between sm:justify-end">
                          <div className="flex items-center border border-slate-600 rounded-lg bg-slate-900/60 overflow-hidden">
                            <button
                              onClick={() => handleUpdateQty(it.product.code, -1)}
                              className="px-2.5 py-1 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                              title="Kurangi Qty"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 py-1 text-xs font-bold text-white min-w-[28px] text-center">
                              {it.qty}
                            </span>
                            <button
                              onClick={() => handleUpdateQty(it.product.code, 1)}
                              className="px-2.5 py-1 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                              title="Tambah Qty"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="font-extrabold text-white text-sm min-w-[100px] text-right">
                            Rp{" "}
                            {new Intl.NumberFormat("id-ID").format(
                              it.product.price * it.qty
                            )}
                          </span>

                          <button
                            onClick={() => handleRemoveProduct(it.product.code)}
                            className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                            title="Hapus Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subtotal Catalog */}
                <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between text-sm">
                  <span className="text-slate-300 font-medium">Total Harga Katalog:</span>
                  <span className="text-lg font-black text-white">
                    Rp {new Intl.NumberFormat("id-ID").format(rawCatalogTotal)}
                  </span>
                </div>
              </div>

              {/* Product Picker Accordion */}
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 backdrop-blur-md shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-blue-400" />
                    <span>Tambah Produk Ready Stock ke Penawaran</span>
                  </h4>

                  {/* Tier Tabs */}
                  <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-700 text-xs">
                    {(["ALL", "A", "B", "C"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTierFilter(t)}
                        className={`px-2.5 py-1 rounded font-bold transition-all ${
                          selectedTierFilter === t
                            ? "bg-blue-600 text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {t === "ALL" ? "Semua Tier" : `Tier ${t}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative mb-3">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari instrumen (mis: Autoclave, pH meter, Mikroskop, Daihan)..."
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Product List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
                  {filteredProducts.map((p) => {
                    const isSelected = selectedItems.some((it) => it.product.code === p.code);
                    return (
                      <div
                        key={p.code}
                        onClick={() => handleAddProduct(p)}
                        className={`group cursor-pointer p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "bg-blue-950/40 border-blue-500/50 hover:bg-blue-950/60"
                            : "bg-slate-900/40 border-slate-700/60 hover:bg-slate-900/80 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {p.code}
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-400">
                            Ready {p.stock} Unit
                          </span>
                        </div>
                        <div className="font-bold text-xs text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {p.brand} • {p.model}
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <span className="font-extrabold text-amber-400">
                            Rp {new Intl.NumberFormat("id-ID").format(p.price)}
                          </span>
                          <span className="text-[11px] font-bold text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                            + Tambah
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Live Negotiation & Margin Simulator (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-800/90 rounded-2xl border-2 border-slate-700 p-5 sm:p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-extrabold text-white">
                      Simulator Batas Nego &amp; Tawaran
                    </h3>
                  </div>
                  <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Live Engine
                  </span>
                </div>

                {/* Input Nilai Tawaran / Sisa Anggaran */}
                <div className="space-y-2 mb-5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Target Tawaran / Anggaran Anda:
                    </label>
                    <span className="text-xs font-semibold text-slate-400">
                      Diskon:{" "}
                      <strong className="text-white">
                        {simulation.discountPercent}%
                      </strong>
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-extrabold text-slate-400">
                      Rp
                    </span>
                    <input
                      type="text"
                      value={
                        customBidInput !== ""
                          ? customBidInput
                          : new Intl.NumberFormat("id-ID").format(activeBidAmount)
                      }
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setCustomBidInput(val);
                      }}
                      placeholder="Masukkan nilai anggaran..."
                      className="w-full bg-slate-900 border-2 border-slate-600 rounded-xl pl-11 pr-4 py-3 text-base sm:text-lg font-black text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-medium mr-1">
                      Pilihan Cepat:
                    </span>
                    <button
                      onClick={() => handleApplyDiscountPreset(0)}
                      className="text-[11px] font-bold px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => handleApplyDiscountPreset(5)}
                      className="text-[11px] font-bold px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                    >
                      -5% (DP 30%)
                    </button>
                    <button
                      onClick={() => handleApplyDiscountPreset(10)}
                      className="text-[11px] font-bold px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                    >
                      -10% (DP 50%)
                    </button>
                    <button
                      onClick={() => handleApplyDiscountPreset(15)}
                      className="text-[11px] font-bold px-2 py-1 rounded bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-500/30 transition-colors"
                    >
                      -15% (Cash)
                    </button>
                  </div>
                </div>

                {/* Status Box (Margin Zone Indicator) */}
                <div
                  className={`rounded-xl border p-4 mb-5 transition-all ${
                    simulation.zone === "target"
                      ? "bg-emerald-950/40 border-emerald-500/60"
                      : simulation.zone === "win_mode"
                      ? "bg-amber-950/40 border-amber-500/60"
                      : simulation.zone === "attention"
                      ? "bg-orange-950/40 border-orange-500/60"
                      : "bg-rose-950/40 border-rose-500/60"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {simulation.zone === "target" && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {simulation.zone === "win_mode" && (
                      <Award className="w-5 h-5 text-amber-400 shrink-0" />
                    )}
                    {simulation.zone === "attention" && (
                      <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />
                    )}
                    {simulation.zone === "overcost" && (
                      <Ban className="w-5 h-5 text-rose-400 shrink-0" />
                    )}

                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      {simulation.statusHeadline}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {simulation.recommendation}
                  </p>

                  {/* Counter offer recommendation if under 25% target */}
                  {simulation.zone !== "target" && simulation.suggestedCounterBid && (
                    <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-semibold">
                        Counter-Offer Target 25%:
                      </span>
                      <strong className="text-amber-300 font-black text-sm">
                        Rp{" "}
                        {new Intl.NumberFormat("id-ID").format(
                          Number(simulation.suggestedCounterBid)
                        )}
                      </strong>
                    </div>
                  )}
                </div>

                {/* Calculation Metrics Summary */}
                <div className="space-y-2.5 text-xs border-y border-slate-700 py-4 mb-5">
                  <div className="flex justify-between text-slate-300">
                    <span>Total Katalog Normal:</span>
                    <span className="font-bold text-white">
                      Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(
                        Number(simulation.catalogTotal)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Penghematan Anggaran:</span>
                    <span className="font-bold text-emerald-400">
                      - Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(
                        Number(simulation.discountAmount)
                      )}{" "}
                      ({simulation.discountPercent}%)
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Skema Termin Pembayaran:</span>
                    <span className="font-bold text-amber-300 text-right max-w-[200px]">
                      {simulation.suggestedTerms}
                    </span>
                  </div>
                </div>

                {/* Bonus Checklist */}
                {simulation.eligibleBonuses.length > 0 && (
                  <div className="mb-6 space-y-2">
                    <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Gift className="w-4 h-4 text-emerald-400" />
                      <span>Klaim Bonus Akhir Tahun yang Terbuka:</span>
                    </div>
                    <ul className="space-y-1">
                      {simulation.eligibleBonuses.map((bonus, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-200"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{bonus}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Action Buttons */}
                <div className="space-y-3">
                  <a
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-5 py-3.5 text-sm font-black text-white shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:-translate-y-0.5 active:scale-[0.99] transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Ajukan Nego Ini ke WhatsApp Sales</span>
                  </a>

                  <p className="text-[11px] text-center text-slate-400 font-medium">
                    *Surat Penawaran Harga (SPH) resmi terbit 1x24 jam dengan KOP PT Andis Sentral Laboratorium
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: BUDGET MAXIMIZER (HABISKAN SISA ANGGARAN)          */}
        {/* ========================================================= */}
        {activeTab === "maximizer" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 sm:p-8 backdrop-blur-md shadow-xl text-center space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                Penyerapan Anggaran Efisien Tanpa Hangus
              </span>

              <h3 className="text-xl sm:text-2xl font-black text-white">
                Pilih Plafon Sisa Anggaran Anda:
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Algoritma kami secara otomatis mengombinasikan instrumen ready stock dengan spesifikasi
                tertinggi agar anggaran departemen/laboratorium terserap optimal sebelum 30 Desember 2026.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 text-left">
                {BUDGET_PRESETS.map((bp) => (
                  <div
                    key={bp.label}
                    onClick={() => handleApplyBudgetPreset(bp.amount)}
                    className="cursor-pointer group p-5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-700/80 hover:border-blue-500 transition-all hover:-translate-y-1 shadow-md space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-blue-400">
                        {bp.label}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>

                    <div className="text-lg font-black text-white">
                      Rp {new Intl.NumberFormat("id-ID").format(bp.amount)}
                    </div>

                    <p className="text-xs text-slate-400 leading-snug">{bp.desc}</p>

                    <div className="pt-2 text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Rekomendasikan Paket</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: TERMS & CASH DISCOUNT MATRIX                       */}
        {/* ========================================================= */}
        {activeTab === "terms" && (
          <div className="max-w-4xl mx-auto bg-slate-800/80 rounded-2xl border border-slate-700 p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Ketentuan Skema Diskon &amp; Syarat Pembayaran
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Transparansi diskon resmi PT Andis Sentral Laboratorium sesuai kebijakan penjualan master.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {DISCOUNT_TIERS.map((tier) => (
                <div
                  key={tier.tier}
                  className="p-5 rounded-xl bg-slate-900/80 border border-slate-700 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-amber-400">
                      {tier.label}
                    </span>
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Tier {tier.tier}%
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-200">
                    Syarat Termin: <span className="text-white">{tier.terms}</span>
                  </p>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {tier.tier === 15 &&
                      "Diskon maksimal 15% diberikan khusus untuk pelunasan di muka (Cash keras) atau DP 50% pelunasan 2 minggu. Menguntungkan bagi instansi yang ingin memangkas biaya pengadaan."}
                    {tier.tier === 10 &&
                      "Pilihan paling populer bagi pengadaan universitas dan rumah sakit dengan skema DP 50% atau DP 30% kredit 2 minggu."}
                    {tier.tier === 5 &&
                      "Diskon ringan untuk kemudahan komitmen DP 30% atau tempo 2 minggu."}
                    {tier.tier === 0 &&
                      "Berlaku untuk pembayaran tempo kredit standar instansi pemerintah / BUMN (30 hari kerja setelah BAST)."}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-700/80 text-center">
              <button
                onClick={() => setActiveTab("negotiation")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg transition-all"
              >
                <span>Buka Simulator Nego Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
