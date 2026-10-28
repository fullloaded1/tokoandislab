import React from "react";
import Link from "next/link";
import { getPromoState } from "@/lib/promo-akhir-tahun";
import { ArrowRight, Sparkles, Calendar, Clock } from "lucide-react";

export default function PromoAkhirTahunBanner() {
  const promoState = getPromoState();

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 border border-blue-500/30 p-5 sm:p-6 text-white shadow-lg">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 px-3 py-0.5 text-[11px] font-bold text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                Promo Akhir Tahun 2026
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-slate-300">
                <Clock className="w-3 h-3 text-amber-400" />
                Fase: {promoState.phaseName}
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Tutup 2026, Buka Lab Impian — Serap Anggaran dengan Unit Ready Stock
            </h2>

            {/* Dynamic phase message */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {promoState.message}
            </p>
          </div>

          {/* Action CTA */}
          <Link
            href="/promo-akhir-tahun"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-600/30 transition-all duration-200 hover:-translate-y-0.5 shrink-0"
          >
            <span>Buka Katalog Promo</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
