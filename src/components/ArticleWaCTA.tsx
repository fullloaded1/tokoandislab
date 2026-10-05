/* Hallmark · component: ArticleWaCTA · genre: modern-minimal · 8-state-ui: pass */
"use client";

import { useWhatsAppLeadStore } from "@/store/useWhatsAppLeadStore";
import { MessageCircle, Sparkles, ArrowRight } from "lucide-react";

interface ArticleWaCTAProps {
  title: string;
  slug: string;
}

export default function ArticleWaCTA({ title, slug }: ArticleWaCTAProps) {
  const openWaModal = useWhatsAppLeadStore((s) => s.openModal);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={() =>
          openWaModal({
            source: "artikel_cta",
            text: `Halo AndisLab, saya sedang membaca artikel "${title}" dan ingin bertanya lebih lanjut.`,
          })
        }
        className="group relative inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl font-extrabold text-xs sm:text-sm shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] shrink-0 border border-emerald-400/30 overflow-hidden backdrop-blur-sm"
      >
        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200" />
        <span>Konsultasi via WA</span>
      </button>

      <a
        href={`/inquiry?src=${slug}`}
        className="group relative inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-white to-emerald-50 hover:from-white hover:to-white text-emerald-900 px-6 py-3.5 sm:px-7 sm:py-4 rounded-2xl font-extrabold text-xs sm:text-sm shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] shrink-0 border border-white/50 overflow-hidden"
      >
        <span className="absolute inset-0 w-1/2 h-full bg-emerald-100/30 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none"></span>
        <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
        <span>Minta Penawaran Resmi (RFQ)</span>
        <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform ml-0.5" />
      </a>
    </div>
  );
}
