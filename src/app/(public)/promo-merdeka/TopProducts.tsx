"use client";

import { TOP_PRODUCTS } from "@/lib/promoSuccessMetrics";
import { money } from "@/lib/money";

export default function TopProducts() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-bold text-red-700 mb-3">
          🏆 Top Produk
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Produk <span className="text-red-600">Paling Laku</span>
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          5 produk terpopuler dalam Promo MERDEKA berdasarkan unit terjual
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {TOP_PRODUCTS.map((product, idx) => {
          const badges = ["🥇 #1", "🥈 #2", "🥉 #3", "⭐ #4", "💫 #5"];
          return (
            <div
              key={product.id}
              className="group relative bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-300"
            >
              {/* Ranking Badge */}
              <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                {badges[idx]}
              </div>

              {/* Product Name */}
              <h3 className="font-bold text-slate-800 text-sm mb-3 pr-12 line-clamp-2">
                {product.name}
              </h3>

              {/* Stats */}
              <div className="space-y-2 mb-4 text-xs text-slate-600">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Terjual:</span>
                  <span className="font-bold text-slate-800">{product.unitsSold.toLocaleString("id-ID")} unit</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Revenue:</span>
                  <span className="font-bold text-emerald-600">{money.formatIDR(product.revenue)}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 bg-yellow-50 rounded-lg px-2 py-1.5 w-fit">
                <span className="text-sm font-bold text-yellow-600">⭐ {product.rating}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
