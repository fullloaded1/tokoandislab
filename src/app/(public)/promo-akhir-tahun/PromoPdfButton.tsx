"use client";

import React from "react";
import { FileDown } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useLeadMagnetStore } from "@/store/useLeadMagnetStore";

interface PromoPdfButtonProps {
  promoPhase?: string;
}

export default function PromoPdfButton({ promoPhase = "active" }: PromoPdfButtonProps) {
  const openLeadModal = useLeadMagnetStore((state) => state.openModal);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      trackEvent("generate_lead", {
        item_id: "katalog-promo-akhir-tahun-pdf",
        item_name: "Katalog PDF Promo Akhir Tahun 2026",
        lead_source: "contact_form",
      });

      const hasLeadInfo =
        typeof window !== "undefined" && Boolean(localStorage.getItem("lead_phone"));

      if (!hasLeadInfo) {
        e.preventDefault();
        openLeadModal();
        // Trigger static promo PDF download alongside modal capture
        const link = document.createElement("a");
        link.href = "/downloads/Katalog-Promo-Akhir-Tahun-AndisLab-2026.pdf";
        link.download = `Katalog-Promo-Akhir-Tahun-AndisLab-2026-${promoPhase}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      // fallback to default anchor download
    }
  };

  return (
    <a
      href="/downloads/Katalog-Promo-Akhir-Tahun-AndisLab-2026.pdf"
      download="Katalog-Promo-Akhir-Tahun-AndisLab-2026.pdf"
      onClick={handleClick}
      className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white px-6 py-3.5 sm:py-4 text-sm sm:text-base font-bold border border-slate-600/80 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] shadow-lg backdrop-blur-md"
    >
      <FileDown className="w-5 h-5 text-cyan-400 shrink-0 transition-transform group-hover:scale-110" />
      <span>Unduh Katalog PDF (A4)</span>
    </a>
  );
}

