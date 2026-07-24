/* Hallmark · component: ArticleWaCTA · genre: modern-minimal · 8-state-ui: pass */
"use client";

import { useWhatsAppLeadStore } from "@/store/useWhatsAppLeadStore";
import { MessageCircle, Sparkles, ArrowRight } from "lucide-react";

interface ArticleWaCTAProps {
  title: string;
}

export default function ArticleWaCTA({ title }: ArticleWaCTAProps) {
  const openWaModal = useWhatsAppLeadStore((s) => s.openModal);

  return (
    <button
      onClick={() =>
        openWaModal({
          source: "artikel_cta",
          text: `Halo AndisLab, saya sedang membaca artikel "${title}" dan ingin bertanya lebih lanjut atau meminta penawaran harga.`,
        })
      }
      className="group relative inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] shrink-0 border border-emerald-400/30 overflow-hidden"
    >
      {/* Shine animation effect */}
      <span className="absolute inset-0 w-1/2 h-full bg-white/15 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none"></span>

      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
      <span>Tanya Spesialis / Minta Penawaran via WA</span>
      <Sparkles className="w-3.5 h-3.5 text-amber-300 opacity-90 group-hover:opacity-100 animate-pulse" />
      <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform ml-0.5" />
    </button>
  );
}
