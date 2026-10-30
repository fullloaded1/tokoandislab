"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Printer, ArrowLeft, ZoomIn, ZoomOut, RotateCcw, FileDown } from "lucide-react";

interface PrintToolbarProps {
  currentCatalogNumber: number;
}

export default function PrintToolbar({ currentCatalogNumber }: PrintToolbarProps) {
  const [scale, setScale] = useState<number>(1);

  const handleZoom = (delta: number) => {
    setScale((prev) => {
      const next = Math.round((prev + delta) * 10) / 10;
      return Math.min(Math.max(next, 0.7), 1.5);
    });
  };

  const handleResetZoom = () => setScale(1);

  React.useEffect(() => {
    const sheet = document.querySelector(".a4-sheet") as HTMLElement | null;
    if (sheet) {
      if (scale === 1) {
        sheet.style.transform = "none";
        sheet.style.transformOrigin = "top center";
      } else {
        sheet.style.transform = `scale(${scale})`;
        sheet.style.transformOrigin = "top center";
      }
    }
  }, [scale]);

  const tabs = [
    { num: 1, label: "Lembar 1: Tier A (Rp 1–30 Jt)" },
    { num: 2, label: "Lembar 2: Tier B (Rp 30–70 Jt)" },
    { num: 3, label: "Lembar 3: Tier C (Rp 70–200 Jt)" },
    { num: 4, label: "Lembar 4: Cara Pesan & Syarat" },
  ];

  return (
    <aside aria-label="Toolbar Pratinjau Cetak" className="no-print sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 shadow-md py-2.5 px-4 mb-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Back Link & Catalog Tabs */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/promo-akhir-tahun"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kembali ke</span> Promo Web
          </Link>

          {/* Catalog Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
            {tabs.map((tab) => {
              const isActive = tab.num === currentCatalogNumber;
              return (
                <Link
                  key={tab.num}
                  href={`/promo-akhir-tahun/katalog/${tab.num}`}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Direct PDF Download + Zoom + Print */}
        <div className="flex items-center gap-2">
          {/* Zoom controls (screen only) */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 text-xs text-slate-300">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Zoom:</span>
            <button
              onClick={() => handleZoom(-0.1)}
              className="p-1 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-bold w-12 text-center text-white">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => handleZoom(0.1)}
              className="p-1 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {scale !== 1 && (
              <button
                onClick={handleResetZoom}
                className="p-1 hover:text-white hover:bg-slate-700 rounded transition-colors ml-0.5"
                title="Reset"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Download exported PDF */}
          <a
            href="/downloads/Katalog-Promo-Akhir-Tahun-AndisLab-2026.pdf"
            download
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 px-3 py-2 text-xs font-bold transition-all"
          >
            <FileDown className="w-3.5 h-3.5 text-blue-400" />
            <span>Download PDF</span>
          </a>

          {/* Print Current Sheet */}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Lembar Ini (A4)</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
