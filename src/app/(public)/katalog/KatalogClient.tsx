/* Hallmark · component: KatalogClient · genre: modern-minimal · macrostructure: Workbench · 8-state-ui: pass */
"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronRight, ArrowUpDown, Tag } from "lucide-react";
import ProductCard from "@/components/ProductCard";
type PrismaProduct = any;
import {
  CATEGORY_LABELS,
  type Category,
  getGroupedProducts
} from "@/lib/products";
import { getReadyStockSummary } from "@/lib/readyStock";
import {
  filterAndSortCatalogProducts,
  type PriceSortOption,
} from "@/lib/catalogFilter";

const categories: { key: Category | "semua"; label: string }[] = [
  { key: "semua", label: "Semua Kategori" },
  ...Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    key: key as Category,
    label,
  })),
];

function SearchParamsListener({ onQuery }: { onQuery: (q: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    onQuery(searchParams.get("q") || "");
  }, [searchParams, onQuery]);
  return null;
}

export default function KatalogClient({ initialProducts = [], children }: { initialProducts: PrismaProduct[], children?: React.ReactNode }) {
  const products = useMemo(() => getGroupedProducts(initialProducts), [initialProducts]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "semua">("semua");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnlyReadyStock, setShowOnlyReadyStock] = useState(false);
  const [showPromoMerdekaOnly, setShowPromoMerdekaOnly] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [activePriceTier, setActivePriceTier] = useState<string>("all");
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const [sortBy, setSortBy] = useState<PriceSortOption>("default");

  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(products.map((p: PrismaProduct) => p.brand).filter(Boolean) as string[])).sort();
  }, [products]);

  const uniqueSubcategories = useMemo(() => {
    return Array.from(new Set(products.map((p: PrismaProduct) => p.subcategory).filter(Boolean) as string[])).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const baseFiltered = products.filter((p: PrismaProduct) => {
      const matchesCategory =
        activeCategory === "semua" || p.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesReadyStock = !showOnlyReadyStock || p.isReadyStock;
      const matchesPromoMerdeka = !showPromoMerdekaOnly || p.isReadyStock;
      const matchesBrand = selectedBrands.length === 0 || (p.brand && selectedBrands.includes(p.brand));
      const matchesSubcategory = selectedSubcategories.length === 0 || (p.subcategory && selectedSubcategories.includes(p.subcategory));

      return matchesCategory && matchesSearch && matchesReadyStock && matchesPromoMerdeka && matchesBrand && matchesSubcategory;
    });

    let minP: number | null = null;
    let maxP: number | null = null;

    if (activePriceTier === "under5m") {
      maxP = 5000000;
    } else if (activePriceTier === "5m-20m") {
      minP = 5000000;
      maxP = 20000000;
    } else if (activePriceTier === "20m-100m") {
      minP = 20000000;
      maxP = 100000000;
    } else if (activePriceTier === "above100m") {
      minP = 100000000;
    } else if (activePriceTier === "custom") {
      const parsedMin = Number(minPriceInput.replace(/\D/g, ""));
      const parsedMax = Number(maxPriceInput.replace(/\D/g, ""));
      if (parsedMin > 0) minP = parsedMin;
      if (parsedMax > 0) maxP = parsedMax;
    }

    const effectiveSortBy = showOnlyReadyStock && sortBy === "default" ? "price-asc" : sortBy;
    return filterAndSortCatalogProducts(baseFiltered, { minPrice: minP, maxPrice: maxP }, effectiveSortBy);
  }, [
    products,
    activeCategory,
    searchQuery,
    showOnlyReadyStock,
    showPromoMerdekaOnly,
    selectedBrands,
    selectedSubcategories,
    activePriceTier,
    minPriceInput,
    maxPriceInput,
    sortBy,
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={null}>
        <SearchParamsListener onQuery={setSearchQuery} />
      </Suspense>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <a href="/" className="hover:text-blue-600 transition-colors">
          Beranda
        </a>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-slate-800">Katalog Produk</span>
      </nav>

      {/* Page Header - Scientific Workbench Stage */}
      <div className="mb-10 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-950 via-indigo-950/90 to-slate-950 p-6 sm:p-10 lg:p-12 text-white shadow-2xl border border-cyan-500/30">
        {/* Ambient cyan glow backdrop */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500/15 px-4 py-1.5 text-xs font-black text-cyan-300 border border-cyan-400/30 shadow-inner mb-4">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            ⚡ e-Katalog & Ready Stock Portal
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Katalog <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">Alat Laboratorium</span> & Reagen
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-3 font-medium leading-relaxed">
            Temukan ribuan instrumen laboratorium, reagen analitik, dan alat gelas presisi tinggi dari merek terkemuka dunia. Resmi terdaftar di e-Katalog dengan garansi principal & dukungan teknis purna jual.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar - UI/UX Pro Max 44px touch safe */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama produk, kategori, atau deskripsi..."
            className="w-full min-h-[48px] rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-10 text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 active:scale-95 transition-all"
              aria-label="Hapus pencarian"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="sm:hidden flex items-center justify-center min-h-[48px] gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-700 shadow-xs active:scale-[0.98] transition-all"
        >
          <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
          <span>Filter Kategori</span>
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden sm:block w-64 shrink-0">
          <div className="sticky top-24 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-md">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
              Kategori
            </h2>
            <div className="space-y-1">
              {categories.map((cat) => {
                const count =
                  cat.key === "semua"
                    ? products.length
                    : products.filter((p) => p.category === cat.key).length;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`flex w-full min-h-[44px] items-center justify-between rounded-2xl px-4 py-3 text-sm transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-emerald-600 active:scale-[0.98] ${
                      activeCategory === cat.key
                        ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 shadow-xs font-black border border-emerald-300/60"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-lg ${
                        activeCategory === cat.key
                          ? "bg-emerald-600 text-white shadow-2xs"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {uniqueBrands.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                  Brand
                </h2>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {uniqueBrands.map(brand => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedBrands([...selectedBrands, brand]);
                          else setSelectedBrands(selectedBrands.filter(b => b !== brand));
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {uniqueSubcategories.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                  Sub-Kategori
                </h2>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {uniqueSubcategories.map(subcat => (
                    <label key={subcat} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={selectedSubcategories.includes(subcat)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedSubcategories([...selectedSubcategories, subcat]);
                          else setSelectedSubcategories(selectedSubcategories.filter(s => s !== subcat));
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{subcat}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Filter — Desktop Sidebar */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                Rentang Harga
              </h2>
              <div className="space-y-1.5 mb-4">
                {[
                  { key: "all", label: "Semua Harga" },
                  { key: "under5m", label: "< Rp 5 Juta" },
                  { key: "5m-20m", label: "Rp 5 Juta – Rp 20 Juta" },
                  { key: "20m-100m", label: "Rp 20 Juta – Rp 100 Juta" },
                  { key: "above100m", label: "> Rp 100 Juta" },
                  { key: "custom", label: "Input Manual..." },
                ].map((tier) => (
                  <button
                    key={tier.key}
                    type="button"
                    onClick={() => setActivePriceTier(tier.key)}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
                      activePriceTier === tier.key
                        ? "bg-blue-50 text-blue-700 font-bold ring-1 ring-blue-200"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{tier.label}</span>
                    {activePriceTier === tier.key && (
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    )}
                  </button>
                ))}
              </div>

              {activePriceTier === "custom" && (
                <div className="space-y-2.5 pt-2 animate-fade-in">
                  <div>
                    <label htmlFor="min-price-desk" className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Harga Minimum (Rp)
                    </label>
                    <input
                      id="min-price-desk"
                      type="text"
                      value={minPriceInput}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setMinPriceInput(val ? new Intl.NumberFormat("id-ID").format(Number(val)) : "");
                      }}
                      placeholder="Contoh: 1.000.000"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="max-price-desk" className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Harga Maksimum (Rp)
                    </label>
                    <input
                      id="max-price-desk"
                      type="text"
                      value={maxPriceInput}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setMaxPriceInput(val ? new Intl.NumberFormat("id-ID").format(Number(val)) : "");
                      }}
                      placeholder="Contoh: 50.000.000"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <>
            <div
              className="sm:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white p-6 shadow-2xl animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">
                  Filter Kategori
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Tutup filter"
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const count =
                    cat.key === "semua"
                      ? products.length
                      : products.filter((p) => p.category === cat.key).length;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => {
                        setActiveCategory(cat.key);
                        setSidebarOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-all ${
                        activeCategory === cat.key
                          ? "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700"
                          : "text-slate-600"
                      }`}
                    >
                      {cat.label}
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {uniqueBrands.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-sm font-bold text-slate-800 mb-3">
                    Brand
                  </h2>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                    {uniqueBrands.map(brand => (
                      <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedBrands.includes(brand)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedBrands([...selectedBrands, brand]);
                            else setSelectedBrands(selectedBrands.filter(b => b !== brand));
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {uniqueSubcategories.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-sm font-bold text-slate-800 mb-3">
                    Sub-Kategori
                  </h2>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                    {uniqueSubcategories.map(subcat => (
                      <label key={subcat} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedSubcategories.includes(subcat)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedSubcategories([...selectedSubcategories, subcat]);
                            else setSelectedSubcategories(selectedSubcategories.filter(s => s !== subcat));
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{subcat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Filter — Mobile Drawer */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <h2 className="text-sm font-bold text-slate-800 mb-3">
                  Rentang Harga
                </h2>
                <div className="space-y-1.5 mb-4">
                  {[
                    { key: "all", label: "Semua Harga" },
                    { key: "under5m", label: "< Rp 5 Juta" },
                    { key: "5m-20m", label: "Rp 5 Juta – Rp 20 Juta" },
                    { key: "20m-100m", label: "Rp 20 Juta – Rp 100 Juta" },
                    { key: "above100m", label: "> Rp 100 Juta" },
                    { key: "custom", label: "Input Manual..." },
                  ].map((tier) => (
                    <button
                      key={tier.key}
                      type="button"
                      onClick={() => setActivePriceTier(tier.key)}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                        activePriceTier === tier.key
                          ? "bg-blue-50 text-blue-700 font-bold ring-1 ring-blue-200"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{tier.label}</span>
                      {activePriceTier === tier.key && (
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      )}
                    </button>
                  ))}
                </div>

                {activePriceTier === "custom" && (
                  <div className="space-y-2.5 pt-2 animate-fade-in">
                    <div>
                      <label htmlFor="min-price-mob" className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Harga Minimum (Rp)
                      </label>
                      <input
                        id="min-price-mob"
                        type="text"
                        value={minPriceInput}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setMinPriceInput(val ? new Intl.NumberFormat("id-ID").format(Number(val)) : "");
                        }}
                        placeholder="Contoh: 1.000.000"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="max-price-mob" className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Harga Maksimum (Rp)
                      </label>
                      <input
                        id="max-price-mob"
                        type="text"
                        value={maxPriceInput}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setMaxPriceInput(val ? new Intl.NumberFormat("id-ID").format(Number(val)) : "");
                        }}
                        placeholder="Contoh: 50.000.000"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {/* Status Filter Tabs (Semua vs Ready Stock) */}
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex bg-slate-100/80 p-1.5 rounded-2xl flex-wrap">
              <button
                onClick={() => {
                  setShowOnlyReadyStock(false);
                  setShowPromoMerdekaOnly(false);
                }}
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${
                  !showOnlyReadyStock && !showPromoMerdekaOnly
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Semua Produk
              </button>
              <button
                onClick={() => {
                  setShowOnlyReadyStock(true);
                  setShowPromoMerdekaOnly(false);
                }}
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                  showOnlyReadyStock && !showPromoMerdekaOnly
                    ? "bg-emerald-100 text-emerald-800 shadow-sm ring-1 ring-emerald-200"
                    : "text-slate-500 hover:text-emerald-700"
                }`}
              >
                🔥 Ready Stock
              </button>
              <button
                onClick={() => {
                  setShowOnlyReadyStock(false);
                  setShowPromoMerdekaOnly(true);
                }}
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                  showPromoMerdekaOnly
                    ? "bg-red-600 text-white shadow-md shadow-red-500/20"
                    : "text-red-600 hover:bg-red-50"
                }`}
              >
                🇮🇩 Promo MERDEKA (-17%)
              </button>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                <ArrowUpDown className="h-4 w-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-500">Urutkan:</span>
                <select
                  aria-label="Urutkan produk"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as PriceSortOption)}
                  className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-1"
                >
                  <option value="default">Relevansi / Default</option>
                  <option value="price-asc">Harga: Termurah ke Termahal</option>
                  <option value="price-desc">Harga: Termahal ke Termurah</option>
                  <option value="name-asc">Nama: A – Z</option>
                  <option value="name-desc">Nama: Z – A</option>
                </select>
              </div>

              <p className="text-sm text-slate-500">
                Menampilkan{" "}
                <span className="font-semibold text-slate-700">
                  {filteredProducts.length}
                </span>{" "}
                produk
              </p>
            </div>
          </div>

          {/* Active Filter Badges */}
          {(activeCategory !== "semua" || selectedBrands.length > 0 || selectedSubcategories.length > 0 || activePriceTier !== "all" || searchQuery) && (
            <div className="mb-6 flex flex-wrap items-center gap-2 bg-slate-50/80 p-3 rounded-2xl border border-slate-200/60 animate-fade-in">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mr-1">
                <Tag className="h-3.5 w-3.5" /> Filter Aktif:
              </span>

              {activeCategory !== "semua" && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-100/80 px-3 py-1 text-xs font-semibold text-blue-800 border border-blue-200/60">
                  Kategori: {CATEGORY_LABELS[activeCategory] || activeCategory}
                  <button onClick={() => setActiveCategory("semua")} className="hover:text-blue-950">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}

              {selectedBrands.map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-100/80 px-3 py-1 text-xs font-semibold text-indigo-800 border border-indigo-200/60">
                  Brand: {b}
                  <button onClick={() => setSelectedBrands(selectedBrands.filter((i) => i !== b))} className="hover:text-indigo-950">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}

              {selectedSubcategories.map((sc) => (
                <span key={sc} className="inline-flex items-center gap-1.5 rounded-lg bg-purple-100/80 px-3 py-1 text-xs font-semibold text-purple-800 border border-purple-200/60">
                  Sub-Kategori: {sc}
                  <button onClick={() => setSelectedSubcategories(selectedSubcategories.filter((i) => i !== sc))} className="hover:text-purple-950">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}

              {activePriceTier !== "all" && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/60">
                  Harga: {
                    activePriceTier === "under5m" ? "< Rp 5 Juta" :
                    activePriceTier === "5m-20m" ? "Rp 5 Juta – Rp 20 Juta" :
                    activePriceTier === "20m-100m" ? "Rp 20 Juta – Rp 100 Juta" :
                    activePriceTier === "above100m" ? "> Rp 100 Juta" :
                    `Manual (${minPriceInput || "0"} - ${maxPriceInput || "∞"})`
                  }
                  <button onClick={() => setActivePriceTier("all")} className="hover:text-emerald-950">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200/60">
                  &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery("")} className="hover:text-amber-950">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}

              <button
                onClick={() => {
                  setActiveCategory("semua");
                  setSelectedBrands([]);
                  setSelectedSubcategories([]);
                  setActivePriceTier("all");
                  setMinPriceInput("");
                  setMaxPriceInput("");
                  setSearchQuery("");
                }}
                className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline ml-auto px-2 py-1"
              >
                Reset Semua Filter
              </button>
            </div>
          )}

          {showPromoMerdekaOnly && (
            <div className="mb-6 rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-6 text-white shadow-xl relative overflow-hidden border border-red-500/30">
              <div className="absolute right-0 top-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-yellow-400/20 border border-yellow-300/40 px-3.5 py-1 text-xs font-extrabold text-yellow-300 uppercase tracking-wider mb-3">
                    🇮🇩 HUT RI ke-81 • Periode 13 Juli – 14 Agustus 2026
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
                    Katalog Promo MERDEKA AndisLab 2026
                  </h2>
                  <p className="text-sm text-red-100 max-w-xl leading-relaxed">
                    Semua produk ready stock di bawah Rp 20 Juta mendapatkan potongan langsung 17%. Produk di atas Rp 20 Juta mendapatkan bundling gratis consumables. Harga langsung terkunci saat PO ditandatangani!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <a
                    href="/api/promo-merdeka-pdf"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-red-700 shadow-md hover:bg-red-50 transition-all"
                  >
                    📄 Unduh Katalog PDF
                  </a>
                  <a
                    href="/promo-merdeka"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-900/80 border border-white/30 px-5 py-3 text-xs font-bold text-white hover:bg-red-900 transition-all"
                  >
                    Halaman Spesial →
                  </a>
                </div>
              </div>
            </div>
          )}

          {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 mb-4">
                <Search className="h-8 w-8 text-slate-300" />
              </div>
              <h2 className="text-lg font-bold text-slate-700">
                Produk tidak ditemukan
              </h2>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">
                Coba gunakan kata kunci lain atau ubah filter kategori Anda
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("semua");
                  setSelectedBrands([]);
                  setSelectedSubcategories([]);
                  setActivePriceTier("all");
                  setMinPriceInput("");
                  setMaxPriceInput("");
                  setSortBy("default");
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SEO SSR Content Container */}
      {children && (
        <div className="mt-16 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 lg:p-12 shadow-sm text-slate-700">
          {children}
        </div>
      )}
    </div>
  );
}
