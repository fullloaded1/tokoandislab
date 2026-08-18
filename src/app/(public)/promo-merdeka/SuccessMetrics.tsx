"use client";

import { PromoSuccessMetrics } from "@/lib/promoSuccessMetrics";
import { money } from "@/lib/money";

interface SuccessMetricsProps {
  data: PromoSuccessMetrics;
}

export default function SuccessMetrics({ data }: SuccessMetricsProps) {
  const { totalRevenue, targetRevenue, percentComplete, totalOrders, averageRating } = data;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-red-50 to-white rounded-3xl border border-red-100">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 mb-3">
          ✨ Promo Sukses Besar!
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Metrik Kesuksesan <span className="text-red-600">Promo MERDEKA</span>
        </h2>
      </div>

      <div className="space-y-8">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-700">Target Penjualan</span>
            <span className="text-sm font-bold text-red-600">{percentComplete.toFixed(1)}%</span>
          </div>
          <div className="relative w-full h-8 bg-slate-200 rounded-full overflow-hidden shadow-sm">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 ease-out rounded-full flex items-center justify-end pr-3"
              style={{ width: `${percentComplete}%` }}
            >
              {percentComplete > 15 && (
                <span className="text-xs font-bold text-white drop-shadow">
                  {percentComplete.toFixed(0)}%
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
            <span>{money.formatIDR(totalRevenue)}</span>
            <span>{money.formatIDR(targetRevenue)}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <span className="block text-2xl sm:text-3xl font-black text-red-600 mb-1">
              {totalOrders.toLocaleString("id-ID")}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pesanan
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <span className="block text-2xl sm:text-3xl font-black text-blue-600 mb-1">
              {percentComplete.toFixed(0)}%
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Target
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <span className="block text-2xl sm:text-3xl font-black text-emerald-600 mb-1">
              ⭐ {averageRating}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Rating
            </span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <span className="block text-2xl sm:text-3xl font-black text-purple-600 mb-1">
              150+
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Lab
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
