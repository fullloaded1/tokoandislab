"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ChevronRight,
  FileText,
  Check,
  ShoppingCart,
  ArrowLeft,
  Download,
  Info,
  List,
  FileBox,
  AlertCircle,
  Eye,
  X,
  ShoppingBag,
} from "lucide-react";
import { useWhatsAppLeadStore } from "@/store/useWhatsAppLeadStore";
import ProductCard from "@/components/ProductCard";
import AntiIndentBadge from "@/components/AntiIndentBadge";
import { type Product } from "@/lib/products";
import { trackWhatsApp } from "@/lib/track";
import { waMeUrl } from "@/lib/contact";
import { getEkatalogRow } from "@/lib/ekatalog";

interface ProductVariant {
  id: string;
  slug: string;
  model: string;
  subcategory: string;
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  variants?: ProductVariant[];
  children?: React.ReactNode;
}

import { useToast } from "@/components/Toast";
import { money } from "@/lib/money";
import { getReadyStockSummary } from "@/lib/readyStock";

import { useRecentStore } from "@/store/useRecentStore";

import { useRFQStore } from "@/store/useRFQStore";

export default function ProductDetailClient({
  product,
  relatedProducts,
  variants = [],
  children,
}: ProductDetailClientProps) {
  const addItem = useRFQStore((s) => s.addItem);
  const setCartOpen = useRFQStore((s) => s.setCartOpen);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"deskripsi" | "spesifikasi" | "dokumen">("deskripsi");
  
  const toast = useToast();

  const productVariants = (product as any).variants || [];

  const summary = getReadyStockSummary(product as any);

  // Pilih varian pertama yang tersedia, atau varian pertama, atau null
  const initialVariant = summary.firstAvailable ?? productVariants[0] ?? null;
  const [selectedVariant, setSelectedVariant] = useState<any | null>(initialVariant);

  // Add to recently viewed
  const addRecent = useRecentStore((s) => s.addRecent);
  useEffect(() => {
    addRecent(product);
  }, [product, addRecent]);

  // FOMO States
  const [viewerCount, setViewerCount] = useState<number>(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  
  // Social Proof Toast State
  const [showSocialProof, setShowSocialProof] = useState(false);
  const [socialProofData, setSocialProofData] = useState({ buyer: "", time: "" });

  useEffect(() => {
    // Scroll listener for Sticky Bar
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setViewerCount(Math.floor(Math.random() * 8) + 3); // 3 to 10 viewers
    
    // Social Proof Toast Logic
    const proofTimer = setTimeout(() => {
      const CITIES = ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Makassar", "Yogyakarta", "Denpasar", "Palembang", "Balikpapan"];
      const BUYERS = ["Rumah Sakit", "Klinik Medis", "Universitas", "Laboratorium Klinik", "Instansi Pemerintah", "Perusahaan Farmasi", "Dinas Kesehatan"];
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const buyer = BUYERS[Math.floor(Math.random() * BUYERS.length)];
      const times = ["15 menit yang lalu", "1 jam yang lalu", "2 jam yang lalu", "Baru saja", "30 menit yang lalu"];
      const time = times[Math.floor(Math.random() * times.length)];
      
      setSocialProofData({ buyer: `${buyer} dari ${city}`, time });
      setShowSocialProof(true);

      setTimeout(() => setShowSocialProof(false), 5000);
    }, 12000 + Math.random() * 8000); // Pops up between 12-20s

    return () => {
      clearTimeout(proofTimer);
    };
  }, []);

  const displayName = product.isReadyStock && product.model ? `${product.name} - ${product.model}` : product.name;

  // Harga sudah dimasukkan dari supplier price list (Juni 2026).
  const HIDE_PRICES_TEMPORARILY = false;

  // Track page view (fire-and-forget)
  useEffect(() => {
    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: product.slug }),
    }).catch(() => {}); // silently ignore errors
  }, [product.slug]);

  // Baris e-Katalog (7 model Daihan) — sumber harga tunggal untuk model ini.
  const ekatalogRow = getEkatalogRow(product.model, product.name);

  // Helper: ubah akhiran harga display → .700 (ready stock) atau .900 (PO Andislab/Daihan)
  const adjustPriceSuffix = (price: number, suffix: 700 | 900): number => {
    return Math.floor(price / 1000) * 1000 + suffix - 1000;
  };

  const isReadyToBuy = HIDE_PRICES_TEMPORARILY ? false : !!(!product.isRequestPricing && product.isReadyStock && selectedVariant && (selectedVariant.stock - selectedVariant.reservedStock > 0) && money.toDecimal(selectedVariant.price).toNumber() > 0);
  const readyStockPrice = isReadyToBuy ? money.toDecimal(selectedVariant.price).toNumber() : 0;

  // Cek apakah produk PO Andislab/Daihan dengan harga > 0
  const isPOWithPrice900 =
    !product.isReadyStock &&
    (product.category === "andislab-custom" || product.category === "daihan-labtech") &&
    money.toDecimal(product.price).toNumber() > 0;

  // Satu produk = satu harga, tanpa coretan.
  let finalPrice = readyStockPrice;
  if (ekatalogRow) {
    finalPrice = ekatalogRow.andislabValue;
  } else if (isReadyToBuy) {
    finalPrice = adjustPriceSuffix(readyStockPrice, 700);
  }

  const handleAdd = () => {
    if (isReadyToBuy && selectedVariant) {
      const res = addItem({
        id: selectedVariant.id,
        productId: product.id,
        variantId: selectedVariant.id,
        slug: product.slug,
        name: `${displayName} (${selectedVariant.name})`,
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
          {displayName}
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

      {/* HERO SECTION - CLEAN AND PREMIUM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16 items-start">
        {/* Product Image Gallery (Left) */}
        <div className="lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-[#f8f9fa] flex items-center justify-center p-10 transition-all hover:bg-slate-100">
            <Image
              src={product.image}
              alt={displayName}
              fill
              className="object-contain mix-blend-multiply transition-transform duration-700 hover:scale-105 p-8"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
          </div>
          {/* Mockup Thumbnails for future gallery support */}
          <div className="flex gap-4 mt-4 overflow-x-auto hide-scrollbar pb-2">
            <div className="w-20 h-20 rounded-2xl border-2 border-blue-600 bg-[#f8f9fa] flex items-center justify-center relative overflow-hidden shrink-0 cursor-pointer">
              <Image src={product.image} fill className="object-contain p-2" alt="thumb 1" />
            </div>
            {/* You can map actual gallery images here later */}
          </div>
        </div>

        {/* Product Info (Right) */}
        <div className="lg:col-span-5 flex flex-col pt-4">
          <div className="mb-8">
            <span className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
              {product.brand || product.categoryLabel}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              {displayName}
            </h1>

            {ekatalogRow && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-700 mb-6">
                Hemat {ekatalogRow.hemat}% vs e-Katalog
              </span>
            )}

            {/* Price or Request Quote Tag */}
            <div className="mb-8">
              {isReadyToBuy ? (
                <div className="flex flex-col">
                  <AntiIndentBadge variant="banner" showConsultText={true} className="mb-4" />
                  {summary.hasPriceRange && !ekatalogRow && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500/80 mb-1">
                      Mulai dari {money.formatIDR(summary.minPrice)} · pilih varian
                    </span>
                  )}
                  {/* Satu produk = satu harga, tanpa coretan. */}
                  <span className="text-3xl font-black text-emerald-600 tracking-tight">
                    {ekatalogRow ? ekatalogRow.andislab : money.formatIDR(finalPrice)}
                  </span>
                  {(() => {
                    const available = selectedVariant.stock - selectedVariant.reservedStock;
                    return available > 0 && available <= 3 ? (
                      <span className="text-sm font-bold text-red-600 mt-2 flex items-center gap-1.5 animate-pulse">
                        <AlertCircle className="h-4 w-4" /> Stok Menipis: Sisa {available} pcs! Cepat sebelum kehabisan
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-emerald-600 mt-2 flex items-center gap-1.5">
                        <Check className="h-4 w-4" /> Ready Stock: {available} pcs · siap kirim
                      </span>
                    );
                  })()}
                  {viewerCount > 0 && (
                    <span className="text-xs font-semibold text-slate-500 mt-2 flex items-center gap-1.5 bg-slate-50 w-fit px-2 py-1 rounded-lg">
                      <Eye className="w-3.5 h-3.5" /> Sedang dilihat oleh {viewerCount} orang
                    </span>
                  )}
                </div>
              ) : product.isReadyStock && selectedVariant && !HIDE_PRICES_TEMPORARILY && !product.isRequestPricing && money.toDecimal(selectedVariant.price).toNumber() > 0 ? (
                <div className="flex flex-col">
                  {/* TODO[T3.3]: Check Order.priceDisplayMode to show PPN/DPP correctly */}
                  <span className="text-3xl font-black text-slate-400 tracking-tight">
                    {money.formatIDR(money.toDecimal(selectedVariant.price).toNumber())}
                  </span>
                  <span className="text-sm font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" /> Stok habis
                  </span>
                </div>
              ) : isPOWithPrice900 ? (
                <div className="flex flex-col items-start gap-2">
                  <span className="text-3xl font-black text-slate-800 tracking-tight">
                    {money.formatIDR(adjustPriceSuffix(money.toDecimal(product.price).toNumber(), 900))}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-1.5 text-xs font-bold text-white shadow-md">
                    PO {product.leadTime || ''}
                  </span>
                </div>
              ) : !product.isReadyStock && product.leadTime ? (
                <div className="flex flex-col items-start gap-2">
                  <span className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-md">
                    PO {product.leadTime}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-2">
                  <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md">
                    Minta Penawaran Harga
                  </span>
                  {product.isReadyStock && selectedVariant && (selectedVariant.stock - selectedVariant.reservedStock) > 0 && (
                    <span className="text-sm font-semibold text-emerald-600 mt-1 flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> Ready Stock: {selectedVariant.stock - selectedVariant.reservedStock} pcs · siap kirim
                    </span>
                  )}
                </div>
              )}
              {(isReadyToBuy || isPOWithPrice900 || (product.isReadyStock && selectedVariant && !HIDE_PRICES_TEMPORARILY && money.toDecimal(selectedVariant.price).toNumber() > 0)) && (
                <p className="text-xs text-slate-400 mt-2">*Harga belum termasuk PPN 12%</p>
              )}
            </div>

            {/* PRODUCT VARIANT SELECTOR */}
            {productVariants.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                   <h3 className="text-sm font-bold text-slate-800">Pilih Varian:</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {productVariants.map((v: any) => {
                    const isActive = selectedVariant?.id === v.id;
                    const available = v.stock - v.reservedStock;
                    const variantPrice = money.toDecimal(v.price).toNumber();

                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`rounded-xl border-2 px-5 py-2.5 text-sm font-bold transition-all text-left ${
                          isActive
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <div className="block">{v.name}</div>
                        {product.isReadyStock && variantPrice > 0 && !HIDE_PRICES_TEMPORARILY && (
                          <div className={`text-xs mt-1 font-semibold ${isActive ? "text-emerald-700" : "text-slate-700"}`}>
                            {/* TODO[T3.3]: apply Order.priceDisplayMode */}
                            {money.formatIDR(adjustPriceSuffix(variantPrice, 700))}
                          </div>
                        )}
                        {product.isReadyStock && !HIDE_PRICES_TEMPORARILY && (
                          <div className={`text-xs mt-0.5 ${available > 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {available > 0 ? `Sisa ${available}` : "Habis"}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SIBLING PRODUCTS SELECTOR (Model Lain) */}
            {variants.length > 1 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-3">
                   <h3 className="text-sm font-bold text-slate-800">Tipe / Model Lainnya:</h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {variants.map((v) => {
                    const isActive = v.slug === product.slug;
                    const label = v.model || v.subcategory || "Standard";
                    
                    if (isActive) {
                      return (
                        <div key={v.id} className="rounded-xl border-2 border-slate-900 bg-slate-900 px-5 py-2.5 text-sm font-bold text-white cursor-default shadow-md transition-all">
                          {label}
                        </div>
                      );
                    }
                    
                    return (
                      <Link 
                        key={v.id} 
                        href={`/katalog/${v.slug}`}
                        replace={true}
                        scroll={false}
                        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-colors"
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAdd}
                disabled={added}
                className={`w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold transition-all duration-300 ${
                  added
                    ? "bg-emerald-50 text-emerald-600 border-2 border-emerald-200"
                    : isReadyToBuy
                      ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-0.5"
                      : "bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5"
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5" />
                    Berhasil Ditambahkan!
                  </>
                ) : isReadyToBuy ? (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    {/* TODO[T3.3]: Apply priceDisplayMode here */}
                    Beli Sekarang ({money.formatIDR(finalPrice)})
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Minta Penawaran
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const pesan = `Halo AndisLab, minta penawaran resmi ${product.name}${product.model ? ` ${product.model}` : ""} untuk instansi kami.`;
                  trackWhatsApp(`/?wa=open&source=product_detail&text=${encodeURIComponent(pesan)}`);
                  window.open(waMeUrl(pesan), "_blank", "noopener,noreferrer");
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-6 py-4 text-base font-bold text-slate-700 transition-all duration-300 hover:border-emerald-500 hover:text-emerald-600 hover:shadow-md hover:-translate-y-0.5"
              >
                <FileText className="h-5 w-5" />
                Minta Penawaran via WA
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                 <Check className="w-4 h-4 text-emerald-500" /> Original
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                 <Check className="w-4 h-4 text-emerald-500" /> Garansi Resmi
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                 <Check className="w-4 h-4 text-emerald-500" /> Support Teknis
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABBED SECTION - DETAILED INFORMATION */}
      <div className="mt-12 mb-20">
         {/* Tab Headers */}
         <div className="flex items-center gap-8 border-b border-slate-200 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setActiveTab("deskripsi")} 
              className={`pb-4 text-base font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === "deskripsi" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              <Info className="w-5 h-5 inline-block mr-2" />
              Deskripsi Produk
            </button>
            <button 
              onClick={() => setActiveTab("spesifikasi")} 
              className={`pb-4 text-base font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === "spesifikasi" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              <List className="w-5 h-5 inline-block mr-2" />
              Spesifikasi Teknis
            </button>
            <button 
              onClick={() => setActiveTab("dokumen")} 
              className={`pb-4 text-base font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === "dokumen" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              <FileBox className="w-5 h-5 inline-block mr-2" />
              Dokumen & Brosur
            </button>
         </div>

         {/* Tab Content */}
         <div className="py-10 min-h-[300px]">
            {/* Tab: Deskripsi */}
            <div className={`max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500 ${activeTab !== 'deskripsi' ? 'hidden' : ''}`}>
              {/* Tempat menyisipkan SEO SSR Content (Kapsul, Tabel Spek, FAQ, Diperbarui) */}
              {children}
              
              <p className="text-lg text-slate-600 leading-relaxed font-medium mt-6">
                {product.description}
              </p>
              <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                  <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Produk ini merupakan perangkat spesifik laboratorium. Pastikan Anda telah berkonsultasi dengan tim ahli kami untuk memastikan kecocokan alat dengan metode dan reagen yang Anda gunakan.
                  </p>
              </div>
            </div>
            
            {/* Tab: Spesifikasi */}
            <div className={`animate-in fade-in slide-in-from-bottom-2 duration-500 ${activeTab !== 'spesifikasi' ? 'hidden' : ''}`}>
                {product.specs && product.specs.length > 0 ? (
                  <div className="rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-sm max-w-4xl">
                    <div className="divide-y divide-slate-50">
                      {product.specs.map((spec, idx) => (
                        <div
                          key={idx}
                          className={`flex flex-col sm:flex-row sm:items-center px-6 py-4 ${
                            idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                          } hover:bg-slate-50 transition-colors`}
                        >
                          <span className="sm:w-1/3 text-sm font-bold text-slate-500 mb-1 sm:mb-0">
                            {spec.label}
                          </span>
                          <span className="sm:w-2/3 text-sm font-semibold text-slate-900 leading-relaxed">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-3xl max-w-4xl">
                      <p className="text-slate-500 font-medium">Spesifikasi teknis detail belum tersedia untuk alat ini.</p>
                  </div>
                )}
            </div>

            {/* Tab: Dokumen */}
            <div className={`animate-in fade-in slide-in-from-bottom-2 duration-500 ${activeTab !== 'dokumen' ? 'hidden' : ''}`}>
                <div className="rounded-3xl border border-slate-100 bg-slate-50 p-10 flex flex-col items-center justify-center text-center max-w-3xl">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                      <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800 mb-3">Brosur & Datasheet Teknis</h3>
                  <p className="text-slate-500 mb-8 max-w-md">
                    Unduh brosur resmi untuk melihat pedoman instalasi, operasional, dan parameter teknis yang lebih detail.
                  </p>
                  {product.brochureUrl ? (
                    <a
                      href={product.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <Download className="h-5 w-5" />
                      Unduh File PDF
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        const href = `/?wa=open&source=product_brochure&text=Halo%20Andis%20Lab,%20boleh%20minta%20brosur%20PDF%20atau%20datasheet%20teknis%20untuk%20produk:%20${encodeURIComponent(product.name)}?`;
                        trackWhatsApp(href);
                        window.open(waMeUrl(`Halo Andis Lab, boleh minta brosur PDF atau datasheet teknis untuk produk: ${product.name}?`), "_blank", "noopener,noreferrer");
                      }}
                      className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-300 bg-white px-8 py-4 text-sm font-bold text-slate-700 transition-all hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
                    >
                      <Download className="h-5 w-5" />
                      Minta Brosur via WA
                    </button>
                  )}
                </div>
            </div>
         </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      {relatedProducts.length > 0 && (
        <section className="mt-10 border-t border-slate-100 pt-16">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Sering Dibeli <span className="text-blue-600">Bersamaan</span>
            </h2>
            <p className="text-slate-500 mt-1 text-sm font-medium">
              Tingkatkan efisiensi lab Anda dengan paket rekomendasi ini
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 mb-12 shadow-sm flex flex-col lg:flex-row gap-8 items-center lg:items-stretch">
            {/* Images Row */}
            <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto hide-scrollbar pb-4 lg:pb-0 w-full lg:w-auto">
              {/* Main Product */}
              <div className="shrink-0 flex flex-col items-center gap-3">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-slate-50 border border-slate-100 p-2 sm:p-4 relative">
                  <Image src={product.image} fill className="object-contain mix-blend-multiply" alt="Main" />
                </div>
                <span className="text-xs font-bold text-emerald-600">Barang Ini</span>
              </div>

              {/* Plus Sign */}
              <div className="text-slate-300 font-bold text-2xl shrink-0">+</div>

              {/* Related 1 */}
              <div className="shrink-0 flex flex-col items-center gap-3">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-slate-50 border border-slate-100 p-2 sm:p-4 relative hover:border-blue-300 transition-colors cursor-pointer" onClick={() => window.location.href = `/katalog/${relatedProducts[0].slug}`}>
                  <Image src={relatedProducts[0].image} fill className="object-contain mix-blend-multiply" alt="Rel 1" />
                </div>
                <span className="text-xs font-bold text-slate-500 truncate w-24 text-center">{relatedProducts[0].model || relatedProducts[0].brand}</span>
              </div>

              {relatedProducts.length > 1 && (
                <>
                  {/* Plus Sign */}
                  <div className="text-slate-300 font-bold text-2xl shrink-0">+</div>

                  {/* Related 2 */}
                  <div className="shrink-0 flex flex-col items-center gap-3">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-slate-50 border border-slate-100 p-2 sm:p-4 relative hover:border-blue-300 transition-colors cursor-pointer" onClick={() => window.location.href = `/katalog/${relatedProducts[1].slug}`}>
                      <Image src={relatedProducts[1].image} fill className="object-contain mix-blend-multiply" alt="Rel 2" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 truncate w-24 text-center">{relatedProducts[1].model || relatedProducts[1].brand}</span>
                  </div>
                </>
              )}
            </div>

            {/* Total and CTA */}
            <div className="flex flex-col justify-center lg:ml-auto w-full lg:w-72 shrink-0 bg-slate-50 rounded-2xl p-6 border border-slate-100">
               <h3 className="text-sm font-bold text-slate-600 mb-4">Total Paket ({Math.min(relatedProducts.length + 1, 3)} Produk):</h3>
               <div className="mb-6">
                 <span className="text-2xl font-black text-slate-900">Minta Penawaran</span>
               </div>
               <button
                  onClick={() => {
                    const store = useRFQStore.getState();
                    // Add main
                    store.addItem({ id: product.id, productId: product.id, slug: product.slug, name: product.name, image: product.image, category: product.categoryLabel, price: money.toDecimal(product.price).toNumber(), type: "RFQ" });
                    // Add related 1
                    store.addItem({ id: relatedProducts[0].id, productId: relatedProducts[0].id, slug: relatedProducts[0].slug, name: relatedProducts[0].name, image: relatedProducts[0].image, category: relatedProducts[0].categoryLabel, price: money.toDecimal(relatedProducts[0].price).toNumber(), type: "RFQ" });
                    // Add related 2 if exists
                    if (relatedProducts.length > 1) {
                      store.addItem({ id: relatedProducts[1].id, productId: relatedProducts[1].id, slug: relatedProducts[1].slug, name: relatedProducts[1].name, image: relatedProducts[1].image, category: relatedProducts[1].categoryLabel, price: money.toDecimal(relatedProducts[1].price).toNumber(), type: "RFQ" });
                    }
                    store.setCartOpen(true);
                    toast?.showToast("Paket berhasil ditambahkan ke penawaran", "success");
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl px-5 py-3.5 text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/20 transition-all duration-300"
               >
                 <ShoppingCart className="w-4 h-4" /> Beli Paket Ini
               </button>
            </div>
          </div>

          <div className="mb-8 flex items-end justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Lihat Produk Terkait Lainnya
              </h3>
            </div>
            <Link
              href={`/katalog?category=${product.category}`}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Kategori Ini →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Bottom Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 sm:px-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] transition-transform duration-300 ${showStickyBar ? "translate-y-0" : "translate-y-full"}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-4 flex-1 min-w-0">
             <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden relative shrink-0 border border-slate-200">
                <Image src={product.image} alt="Thumb" fill className="object-contain p-1 mix-blend-multiply" />
             </div>
             <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{product.brand || product.categoryLabel}</span>
                <span className="text-sm font-bold text-slate-800 truncate">{displayName}</span>
             </div>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-6 flex-1 w-full sm:w-auto">
             <div className="flex flex-col items-start sm:items-end shrink-0">
                {ekatalogRow ? (
                  <span className="text-lg sm:text-xl font-black text-emerald-600">{ekatalogRow.andislab}</span>
                ) : isReadyToBuy ? (
                  <span className="text-lg sm:text-xl font-black text-emerald-600">{money.formatIDR(finalPrice)}</span>
                ) : isPOWithPrice900 ? (
                  <span className="text-lg sm:text-xl font-black text-slate-800">{money.formatIDR(adjustPriceSuffix(money.toDecimal(product.price).toNumber(), 900))}</span>
                ) : (
                  <span className="text-sm sm:text-base font-black text-slate-900">Hubungi Kami</span>
                )}
             </div>
             
             <button
                onClick={handleAdd}
                disabled={added}
                className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all duration-300 w-full sm:w-auto ${
                  added
                    ? "bg-emerald-50 text-emerald-600 border-2 border-emerald-200"
                    : isReadyToBuy
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
                      : "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-5 w-5" />
                    Berhasil
                  </>
                ) : isReadyToBuy ? (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Beli Sekarang
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Minta Penawaran
                  </>
                )}
              </button>
          </div>
        </div>
      </div>

      {/* Recently Viewed */}
      {(() => {
        const recentStore = useRecentStore();
        const otherRecent = recentStore.recentProducts.filter(p => p.id !== product.id);
        
        if (otherRecent.length === 0) return null;
        
        return (
          <section className="mt-10 border-t border-slate-100 pt-16 pb-24">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Terakhir <span className="text-blue-600">Dilihat</span>
              </h2>
              <p className="text-slate-500 mt-1 text-sm font-medium">
                Lanjutkan penelusuran Anda sebelumnya
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
              {otherRecent.slice(0, 4).map((rp) => (
                <ProductCard key={rp.id} product={rp as any} />
              ))}
            </div>
          </section>
        );
      })()}

      {/* Social Proof Toast */}
      <div className={`fixed bottom-24 sm:bottom-6 left-4 sm:left-6 z-[60] transition-all duration-500 transform ${showSocialProof ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 p-3 sm:p-4 pr-10 flex items-center gap-3 sm:gap-4 max-w-[320px] sm:max-w-sm cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setShowSocialProof(false)}>
           <button className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
           <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
             <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
           </div>
           <div>
             <p className="text-xs sm:text-sm text-slate-600 leading-snug">
               <span className="font-bold text-slate-900">{socialProofData.buyer}</span> baru saja meminta penawaran untuk produk ini.
             </p>
             <p className="text-[10px] sm:text-xs font-bold text-emerald-600 mt-1">{socialProofData.time}</p>
           </div>
        </div>
      </div>

      {/* Sticky Mobile Discussion & Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-3 shadow-[0_-8px_20px_rgb(0,0,0,0.06)] flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-extrabold text-emerald-600 truncate flex items-center gap-1">
            💬 Diskusi kebutuhan lab Anda &rarr;
          </span>
          <span className="text-xs font-black text-slate-900 truncate">
            {ekatalogRow ? ekatalogRow.andislab : money.formatIDR(finalPrice)}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const pesan = `Halo AndisLab, diskusi kebutuhan lab & minta penawaran ${product.name}${product.model ? ` ${product.model}` : ""}.`;
              trackWhatsApp(`/?wa=open&source=mobile_sticky&text=${encodeURIComponent(pesan)}`);
              window.open(waMeUrl(pesan), "_blank", "noopener,noreferrer");
            }}
            className="flex items-center justify-center min-h-[44px] px-3.5 py-2 rounded-xl border border-emerald-600 bg-emerald-50 text-emerald-700 font-bold text-xs shadow-xs active:scale-95"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            Hubungi Sales
          </button>
          <button
            onClick={handleAdd}
            disabled={added}
            className={`flex items-center justify-center min-h-[44px] px-4 py-2 rounded-xl text-xs font-black text-white shadow-md active:scale-95 ${
              added
                ? "bg-emerald-600"
                : isReadyToBuy
                  ? "bg-gradient-to-r from-emerald-600 to-teal-700"
                  : "bg-slate-900"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
            {added ? "Ditambahkan" : isReadyToBuy ? "+ Keranjang" : "Penawaran"}
          </button>
        </div>
      </div>

    </div>
  );
}
