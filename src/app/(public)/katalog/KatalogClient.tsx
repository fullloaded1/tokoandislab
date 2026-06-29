"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product as PrismaProduct } from "@prisma/client";
import {
  CATEGORY_LABELS,
  type Category,
  getGroupedProducts
} from "@/lib/products";
import { getReadyStockSummary } from "@/lib/readyStock";

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

export default function KatalogClient({ initialProducts = [] }: { initialProducts: PrismaProduct[] }) {
  const products = useMemo(() => getGroupedProducts(initialProducts), [initialProducts]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "semua">("semua");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnlyReadyStock, setShowOnlyReadyStock] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(products.map((p: PrismaProduct) => p.brand).filter(Boolean) as string[])).sort();
  }, [products]);

  const uniqueSubcategories = useMemo(() => {
    return Array.from(new Set(products.map((p: PrismaProduct) => p.subcategory).filter(Boolean) as string[])).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p: PrismaProduct) => {
      const matchesCategory =
        activeCategory === "semua" || p.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesReadyStock = !showOnlyReadyStock || p.isReadyStock;
      const matchesBrand = selectedBrands.length === 0 || (p.brand && selectedBrands.includes(p.brand));
      const matchesSubcategory = selectedSubcategories.length === 0 || (p.subcategory && selectedSubcategories.includes(p.subcategory));

      return matchesCategory && matchesSearch && matchesReadyStock && matchesBrand && matchesSubcategory;
    });

    if (showOnlyReadyStock) {
      result = result.sort((a, b) => {
        const aMin = getReadyStockSummary(a).minPrice || Number(a.price);
        const bMin = getReadyStockSummary(b).minPrice || Number(b.price);
        return aMin - bMin;
      });
    }

    return result;
  }, [activeCategory, searchQuery, showOnlyReadyStock, selectedBrands, selectedSubcategories, products]);

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

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          Katalog <span className="gradient-text">Produk</span>
        </h1>
        <p className="text-slate-500 mt-2">
          Temukan alat laboratorium berkualitas tinggi untuk kebutuhan Anda
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama produk, kategori, atau deskripsi..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="sm:hidden flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-medium text-slate-600"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter Kategori
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden sm:block w-64 shrink-0">
          <div className="sticky top-24 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
              Kategori
            </h3>
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
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      activeCategory === cat.key
                        ? "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    {cat.label}
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                        activeCategory === cat.key
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-500"
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
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                  Brand
                </h3>
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
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                  Sub-Kategori
                </h3>
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
                <h3 className="text-lg font-bold text-slate-800">
                  Filter Kategori
                </h3>
                <button
                  onClick={() => setSidebarOpen(false)}
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
                  <h3 className="text-sm font-bold text-slate-800 mb-3">
                    Brand
                  </h3>
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
                  <h3 className="text-sm font-bold text-slate-800 mb-3">
                    Sub-Kategori
                  </h3>
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
            </div>
          </>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {/* Status Filter Tabs (Semua vs Ready Stock) */}
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex bg-slate-100/80 p-1.5 rounded-2xl">
              <button
                onClick={() => setShowOnlyReadyStock(false)}
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${
                  !showOnlyReadyStock
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Semua Produk
              </button>
              <button
                onClick={() => setShowOnlyReadyStock(true)}
                className={`px-5 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                  showOnlyReadyStock
                    ? "bg-emerald-100 text-emerald-800 shadow-sm ring-1 ring-emerald-200"
                    : "text-slate-500 hover:text-emerald-700"
                }`}
              >
                🔥 Ready Stock
              </button>
            </div>
            
            <p className="text-sm text-slate-500">
              Menampilkan{" "}
              <span className="font-semibold text-slate-700">
                {filteredProducts.length}
              </span>{" "}
              produk
              {searchQuery && (
                <>
                  {" "}
                  untuk &ldquo;
                  <span className="font-semibold text-blue-600">
                    {searchQuery}
                  </span>
                  &rdquo;
                </>
              )}
            </p>
          </div>

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
              <h3 className="text-lg font-bold text-slate-700">
                Produk tidak ditemukan
              </h3>
              <p className="text-sm text-slate-500 mt-2 max-w-sm">
                Coba gunakan kata kunci lain atau ubah filter kategori Anda
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("semua");
                  setSelectedBrands([]);
                  setSelectedSubcategories([]);
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
