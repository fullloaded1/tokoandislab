"use client";

import { MessageCircle, X, Sparkles, FileText, Building2, HelpCircle, Send, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useWhatsAppLeadStore } from "@/store/useWhatsAppLeadStore";
import { WA_NUMBER_DISPLAY } from "@/lib/contact";

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);
  const openWaModal = useWhatsAppLeadStore((s) => s.openModal);

  useEffect(() => {
    setMounted(true);
    // Auto-show tooltip briefly after 4 seconds to invite user interaction
    const timer = setTimeout(() => {
      setShowTooltip(true);
      const hideTimer = setTimeout(() => setShowTooltip(false), 6000);
      return () => clearTimeout(hideTimer);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const handleSelectTopic = (source: string, text: string) => {
    setIsOpen(false);
    openWaModal({ source, text });
  };

  return (
    <div className={`fixed bottom-6 right-4 sm:right-6 flex flex-col items-end pointer-events-none font-sans transition-all duration-300 ${isOpen ? "z-[80]" : "z-[60]"}`}>
      {/* Popover Concierge Menu */}
      {isOpen && (
        <div className="pointer-events-auto mb-4 w-[340px] sm:w-[380px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#075E54] via-[#128C7E] to-[#0D9488] p-5 text-white relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              aria-label="Tutup menu WhatsApp"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3.5 mb-2.5">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                  <MessageCircle className="w-6 h-6 text-emerald-200" />
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#075E54] rounded-full" title="Online"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-base tracking-tight">CS Spesialis AndisLab</h3>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                </div>
                <p className="text-xs text-emerald-100/90 font-medium flex items-center gap-1 mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping"></span>
                  Online • Fast Response ⚡
                </p>
              </div>
            </div>

            <p className="text-xs text-white/90 leading-relaxed bg-black/10 p-3 rounded-2xl border border-white/10">
              Halo! Pilih topik di bawah untuk terhubung langsung ke WhatsApp penawaran &amp; konsultasi kami:
            </p>
          </div>

          {/* Quick Topics List */}
          <div className="p-4 sm:p-5 space-y-2.5 max-h-[380px] overflow-y-auto bg-slate-50/60">
            <button
              onClick={() =>
                handleSelectTopic(
                  "wa_concierge_rfq",
                  "Halo Tim AndisLab, saya ingin meminta penawaran harga resmi (RFQ) untuk spesifikasi alat laboratorium."
                )
              }
              className="w-full text-left group flex items-start gap-3 p-3.5 rounded-2xl bg-white hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-300/80 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <div className="p-2.5 rounded-xl bg-emerald-100/70 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-900 transition-colors">
                  Minta Penawaran Harga (RFQ)
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  Untuk pengadaan instansi, kampus, &amp; industri
                </div>
              </div>
              <Send className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all self-center shrink-0" />
            </button>

            <button
              onClick={() =>
                handleSelectTopic(
                  "wa_concierge_ekatalog",
                  "Halo Tim AndisLab, saya ingin berkonsultasi mengenai pengadaan alat laboratorium melalui jalur e-Katalog / INAPROC."
                )
              }
              className="w-full text-left group flex items-start gap-3 p-3.5 rounded-2xl bg-white hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-300/80 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <div className="p-2.5 rounded-xl bg-blue-100/70 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-900 transition-colors">
                  Konsultasi e-Katalog / INAPROC
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  Bantuan SPJ, penawaran pembanding, &amp; klik beli
                </div>
              </div>
              <Send className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all self-center shrink-0" />
            </button>

            <button
              onClick={() =>
                handleSelectTopic(
                  "wa_concierge_spek",
                  "Halo Tim AndisLab, saya ingin berkonsultasi mengenai rekomendasi spesifikasi produk laboratorium yang tepat."
                )
              }
              className="w-full text-left group flex items-start gap-3 p-3.5 rounded-2xl bg-white hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-300/80 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <div className="p-2.5 rounded-xl bg-amber-100/70 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-emerald-900 transition-colors">
                  Rekomendasi Spesifikasi Alat
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  Tanya fungsi, akurasi, &amp; kesesuaian sampel
                </div>
              </div>
              <Send className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all self-center shrink-0" />
            </button>

            <button
              onClick={() =>
                handleSelectTopic(
                  "wa_concierge_general",
                  "Halo Tim AndisLab, saya ingin bertanya dan berkonsultasi mengenai produk/layanan laboratorium."
                )
              }
              className="w-full text-center py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-700 hover:bg-emerald-100/60 transition-colors block"
            >
              Atau tulis pesan bebas ke CS kami &rarr;
            </button>
          </div>

          {/* Footer Badge */}
          <div className="bg-slate-100/80 px-5 py-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              100% Respons Resmi
            </span>
            <span>WA: {WA_NUMBER_DISPLAY}</span>
          </div>
        </div>
      )}

      {/* Tooltip Pill (Shows when popover closed) */}
      {!isOpen && (showTooltip || false) && (
        <div
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto cursor-pointer mb-3 px-4 py-2.5 rounded-2xl bg-slate-900/90 text-white shadow-xl backdrop-blur-md border border-white/10 flex items-center gap-2.5 text-xs font-bold animate-bounce transition-all duration-300"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Butuh penawaran / spesifikasi alat? Chat CS &rarr;</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-white ml-1"
            aria-label="Tutup info"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        onMouseEnter={() => !isOpen && setShowTooltip(true)}
        aria-label="Tanya CS via WhatsApp"
        className="pointer-events-auto group relative flex items-center gap-3 bg-gradient-to-r from-[#075E54] via-[#128C7E] to-[#25D366] hover:from-[#064e46] hover:to-[#16a34a] text-white px-5 py-3.5 sm:py-4 sm:px-6 rounded-full shadow-[0_10px_35px_rgba(37,211,102,0.45)] hover:shadow-[0_15px_45px_rgba(37,211,102,0.6)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 border border-white/20"
      >
        <div className="relative flex items-center justify-center">
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform duration-300 group-hover:scale-110" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 border-2 border-[#075E54]"></span>
          </span>
        </div>

        <div className="flex flex-col text-left">
          <span className="font-extrabold text-xs sm:text-sm tracking-tight leading-none flex items-center gap-1.5">
            Konsultasi WA
            <Sparkles className="w-3 h-3 text-amber-300 opacity-80 group-hover:opacity-100 transition-opacity" />
          </span>
          <span className="text-[10px] sm:text-[11px] text-emerald-100/90 font-medium mt-1 leading-none flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
            CS Online ⚡
          </span>
        </div>
      </button>
    </div>
  );
}
