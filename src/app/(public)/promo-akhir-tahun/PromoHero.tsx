import React from "react";
import Link from "next/link";
import { catalogs } from "@/data/promo-akhir-tahun";
import { PromoState, HERO_SPH_MESSAGE } from "@/lib/promo-akhir-tahun";
import PromoCountdown from "./PromoCountdown";
import PromoWaLink from "./PromoWaLink";
import PromoPdfButton from "./PromoPdfButton";
import { MessageSquare, ArrowDown, ShieldCheck, Sparkles, Calendar, Calculator, CheckCircle2, Star } from "lucide-react";

interface PromoHeroProps {
  promoState: PromoState;
}

export default function PromoHero({ promoState }: PromoHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-16 sm:pb-28">
      {/* Background radial glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[400px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 px-3.5 py-1 text-xs font-bold text-blue-300 backdrop-blur-md">
            <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            Promo 30 Okt - 30 Des 2026
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            100% Ready Stock Gudang
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 px-3 py-1 text-xs font-bold text-cyan-300 backdrop-blur-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            Dokumen SPJ &amp; BAST Lengkap
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300">
          Tutup 2026, Buka Lab Impian
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
          Serap anggaran akhir tahun dengan alat lab ready stock. Bayangkan Januari tiba, lab Anda sudah siap bekerja tanpa beban sisa anggaran.
        </p>

        {/* Phase Message Card */}
        <div className="max-w-2xl mx-auto rounded-2xl bg-slate-800/60 border border-slate-700/80 p-4 sm:p-5 backdrop-blur-md shadow-inner text-left sm:text-center space-y-1.5">
          <div className="flex items-center gap-2 justify-center">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-xs font-extrabold tracking-wider uppercase text-amber-300">
              Fase: {promoState.phaseName}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {promoState.message}
          </p>
        </div>

        {/* Countdown & Main CTA Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 pt-2">
          {/* Countdown */}
          <PromoCountdown
            targetDate={promoState.targetDate}
            mode={promoState.mode}
            phaseName={promoState.phaseName}
          />

          {/* Primary CTA Buttons Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex flex-col items-center sm:items-start gap-1">
              <PromoWaLink
                message={HERO_SPH_MESSAGE}
                promoPhase={promoState.phaseId}
                placement="hero_primary"
                className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-7 py-3.5 sm:py-4 text-base sm:text-lg font-black text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 border border-white/20"
              >
                <MessageSquare className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                <span>Minta SPH via WhatsApp</span>
              </PromoWaLink>
              <span className="text-[11px] text-slate-400 font-medium">
                *SPH Resmi 1x24 Jam • Format Sesuai Standar Audit Instansi • Bebas Repot
              </span>
            </div>

            <div className="flex flex-col items-center sm:items-start gap-1">
              <PromoPdfButton promoPhase={promoState.phaseId} />
              <span className="text-[11px] text-slate-400 font-medium">
                *Format siap cetak resmi A4
              </span>
            </div>

            <div className="flex flex-col items-center sm:items-start gap-1">
              <a
                href="#skema-diskon"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 hover:text-white px-5 py-3.5 sm:py-4 text-sm sm:text-base font-bold border border-rose-400/40 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] shadow-lg backdrop-blur-md"
              >
                <Sparkles className="w-5 h-5 text-rose-400 shrink-0 transition-transform group-hover:scale-110" />
                <span>Pilih Cara Bayar &amp; Diskon</span>
              </a>
              <span className="text-[11px] text-slate-400 font-medium">
                *Tunai (-8%), DP 50% (-5%), DP 30% (-3%), Tempo 30 Hari
              </span>
            </div>
          </div>
        </div>

        {/* Institutional Social Proof Bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-1 text-xs font-semibold text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
            <span>Rating <strong className="text-white">4.9/5.0</strong> (520+ Ulasan Pengadaan)</span>
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span>Dipercaya <strong className="text-white">500+ Lab Instansi, Kampus &amp; Industri</strong> Sejak 2010</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span>Jangkauan Pengiriman <strong className="text-white">34 Provinsi</strong></span>
        </div>

        {/* Bureaucratic Hassle-Free Stack */}
        <div className="max-w-3xl mx-auto rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900/80 to-teal-950/70 border border-cyan-500/30 p-4 sm:p-5 backdrop-blur-md shadow-xl text-left">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
              Paket Pengadaan Terima Beres (100% Siap Audit SPJ &amp; BAST)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-200">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Draft SPJ &amp; BAST:</strong> Format resmi siap tanda tangan PPK / Bendahara.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Uji Fungsi QC Resmi:</strong> Checklist protokol kelaikan &amp; sertifikat bawaan.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Garansi Fisik Riil:</strong> Bisa video call / inspeksi unit langsung ke gudang kami.</span>
            </div>
          </div>
        </div>

        {/* 3 Catalog Navigation Cards */}
        <div className="pt-8 sm:pt-12">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            Pilih Katalog Sesuai Plafon Anggaran Anda:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
            {catalogs.map((cat) => {
              const count = cat.products.length;
              const cardBorder = {
                "blue-amber": "hover:border-blue-400 hover:shadow-blue-500/20",
                "navy-teal": "hover:border-teal-400 hover:shadow-teal-500/20",
                "slate-gold": "hover:border-amber-400 hover:shadow-amber-500/20",
              }[cat.theme];

              const badgeColor = {
                "blue-amber": "bg-blue-500/20 text-blue-300 border-blue-400/30",
                "navy-teal": "bg-teal-500/20 text-teal-300 border-teal-400/30",
                "slate-gold": "bg-amber-500/20 text-amber-300 border-amber-400/30",
              }[cat.theme];

              return (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className={`group relative flex flex-col justify-between rounded-2xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/60 ${cardBorder} p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-sm`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border ${badgeColor}`}>
                        Katalog {cat.number}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {count} Produk Ready
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                      {cat.title}
                    </h3>

                    <div className="text-sm font-black text-amber-400">
                      Plafon: {cat.limit}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      {cat.subtitle} — {cat.target}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                    <span>Lihat Produk &amp; Bonus</span>
                    <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
