"use client";

import React from "react";
import Link from "next/link";
import { Printer, ArrowLeft } from "lucide-react";

export default function PrintButton() {
  return (
    <div className="no-print mx-auto max-w-[210mm] mb-4 flex items-center justify-between px-4 sm:px-0">
      <Link
        href="/promo-akhir-tahun"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl shadow-xs border border-slate-300 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Halaman Promo</span>
      </Link>

      <button
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs sm:text-sm font-bold shadow-md transition-all duration-200 active:scale-95"
      >
        <Printer className="w-4 h-4" />
        <span>Unduh / Cetak PDF (A4)</span>
      </button>
    </div>
  );
}
