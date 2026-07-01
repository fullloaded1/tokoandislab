"use client";

import { useWhatsAppLeadStore } from "@/store/useWhatsAppLeadStore";

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
          text: `Halo AndisLab, saya sedang membaca artikel "${title}" dan ingin bertanya lebih lanjut.`,
        })
      }
      className="inline-flex items-center justify-center bg-white text-emerald-700 px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shrink-0"
    >
      Tanya Spesialis via WA
    </button>
  );
}
