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
  Download,
  Info,
  List,
  FileBox,
} from "lucide-react";
import { useRFQStore } from "@/store/useRFQStore";
import { useWhatsAppLeadStore } from "@/store/useWhatsAppLeadStore";
import ProductCard from "@/components/ProductCard";
import { type Product } from "@/lib/products";

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
}

import { useToast } from "@/components/Toast";
import { money } from "@/lib/money";
import { getReadyStockSummary } from "@/lib/readyStock";

export default function ProductDetailClient({
  product,
  relatedProducts,
  variants = [],
}: ProductDetailClientProps) {
  const { addItem } = useRFQStore();
  const [added, setAdded] = useState(false);
  const openWaModal = useWhatsAppLeadStore((s) => s.openModal);
  const [activeTab, setActiveTab] = useState<"deskripsi" | "spesifikasi" | "dokumen">("deskripsi");
  
  const toast = useToast();

  const productVariants = (product as any).variants || [];

  const summary = getReadyStockSummary(product as any);

  // Pilih varian pertama yang tersedia, atau varian pertama, atau null
  const initialVariant = summary.firstAvailable ?? productVariants[0] ?? null;
  const [selectedVariant, setSelectedVariant] = useState<any | null>(initialVariant);

  const displayName = product.isReadyStock && product.model ? `${product.name} - ${product.model}` : product.name;

  // Harga sudah dimasukkan dari supplier price list (Juni 2026).
  const HIDE_PRICES_TEMPORARILY = false;

  const isReadyToBuy = HIDE_PRICES_TEMPORARILY ? false : !!(product.isReadyStock && selectedVariant && (selectedVariant.stock - selectedVariant.reservedStock > 0) && money.toDecimal(selectedVariant.price).toNumber() > 0);
  const readyStockPrice = isReadyToBuy ? money.toDecimal(selectedVariant.price).toNumber() : 0;

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
        price: readyStockPrice,
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
            
            {/* Price or Request Quote Tag */}
            <div className="mb-8">
              {isReadyToBuy ? (
                <div className="flex flex-col">
                  {summary.hasPriceRange && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500/80 mb-1">
                      Mulai dari {money.formatIDR(summary.minPrice)} · pilih varian
                    </span>
                  )}
                  {/* TODO[T3.3]: Check Order.priceDisplayMode or system setting to decide if this price should include PPN */}
                  <span className="text-3xl font-black text-emerald-600 tracking-tight">
                    {money.formatIDR(readyStockPrice)}
                  </span>
                  <span className="text-sm font-semibold text-emerald-700 mt-1 flex items-center gap-1.5">
                    <Check className="h-4 w-4" /> Stok Tersedia ({selectedVariant.stock - selectedVariant.reservedStock} unit)
                  </span>
                </div>
              ) : product.isReadyStock && selectedVariant && !HIDE_PRICES_TEMPORARILY ? (
                <div className="flex flex-col">
                  {/* TODO[T3.3]: Check Order.priceDisplayMode to show PPN/DPP correctly */}
                  <span className="text-3xl font-black text-slate-400 tracking-tight line-through">
                    {money.toDecimal(selectedVariant.price).toNumber() > 0 
                      ? money.formatIDR(money.toDecimal(selectedVariant.price).toNumber()) 
                      : "Harga Tidak Tersedia"}
                  </span>
                  <span className="text-sm font-semibold text-red-500 mt-1 flex items-center gap-1.5">
                    <Check className="h-4 w-4" /> Stok Habis - Silakan Minta Penawaran
                  </span>
                </div>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md">
                  Minta Penawaran Harga
                </span>
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
                            {money.formatIDR(variantPrice)}
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
                    Beli Sekarang ({money.formatIDR(readyStockPrice)})
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Minta Penawaran
                  </>
                )}
              </button>
              
              <a
                href={`/?wa=open&source=product_detail&text=Halo%20Andis%20Lab,%20saya%20tertarik%20dengan%20produk:%20${encodeURIComponent(product.name)}.%20Mohon%20info%20harga%20dan%20ketersediaan.`}
                onClick={(e) => {
                  e.preventDefault();
                  openWaModal({
                    source: "product_detail",
                    productId: product.id,
                    productName: product.name,
                    text: `Halo Andis Lab, saya tertarik dengan produk: ${product.name}. Mohon info harga dan ketersediaan.`
                  });
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-6 py-4 text-base font-bold text-slate-700 transition-all duration-300 hover:border-emerald-500 hover:text-emerald-600 hover:shadow-md hover:-translate-y-0.5"
              >
                <FileText className="h-5 w-5" />
                Tanya Spesifikasi via WA
              </a>
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
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
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
                    <a
                      href={`/?wa=open&source=product_brochure&text=Halo%20Andis%20Lab,%20boleh%20minta%20brosur%20PDF%20atau%20datasheet%20teknis%20untuk%20produk:%20${encodeURIComponent(product.name)}?`}
                      onClick={(e) => {
                        e.preventDefault();
                        openWaModal({
                          source: "product_brochure",
                          productId: product.id,
                          productName: product.name,
                          text: `Halo Andis Lab, boleh minta brosur PDF atau datasheet teknis untuk produk: ${product.name}?`
                        });
                      }}
                      className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-300 bg-white px-8 py-4 text-sm font-bold text-slate-700 transition-all hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
                    >
                      <Download className="h-5 w-5" />
                      Minta Brosur via WA
                    </a>
                  )}
                </div>
            </div>
         </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-10 border-t border-slate-100 pt-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Produk <span className="text-blue-600">Terkait</span>
              </h2>
              <p className="text-slate-500 mt-1 text-sm font-medium">
                Peralatan lain yang sering dibeli bersamaan
              </p>
            </div>
            <Link
              href={`/katalog?category=${product.category}`}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Lihat Kategori Ini →
            </Link>
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
