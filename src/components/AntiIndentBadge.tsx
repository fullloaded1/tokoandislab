import React from "react";
import { Zap } from "lucide-react";

export interface AntiIndentBadgeProps {
  variant?: "compact" | "card" | "banner";
  className?: string;
  showConsultText?: boolean;
}

export default function AntiIndentBadge({
  variant = "compact",
  className = "",
  showConsultText = false,
}: AntiIndentBadgeProps) {
  if (variant === "banner") {
    return (
      <div
        className={`inline-flex flex-col sm:flex-row items-start sm:items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-900/90 via-emerald-800/90 to-teal-900/90 p-3 sm:px-4 sm:py-3 text-white border border-emerald-500/30 shadow-lg shadow-emerald-950/20 backdrop-blur-md ${className}`}
      >
        <div className="flex items-center gap-2 font-black tracking-tight text-xs sm:text-sm text-emerald-300">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40">
            <Zap className="h-3.5 w-3.5 fill-emerald-400 animate-pulse" />
          </span>
          <span>KLUB ANTI INDENT</span>
        </div>
        <div className="hidden sm:block h-4 w-px bg-emerald-600/50" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold text-emerald-100">
          <span>Barang ADA, Langsung Bisa. Siap Kirim & Dokumen SPJ Lengkap.</span>
          {showConsultText && (
            <span className="text-emerald-300 font-bold underline decoration-emerald-400/50 underline-offset-2">
              Ngobrol Kebutuhan Gampang →
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 text-[11px] font-black text-emerald-800 shadow-2xs ${className}`}
        title="Anti Indent Club — Barang ADA, Langsung Bisa"
      >
        <Zap className="h-3 w-3 text-emerald-600 fill-emerald-600 shrink-0 animate-pulse" />
        <span>Anti Indent Club</span>
        <span className="text-emerald-600 font-medium hidden xs:inline">• Ready</span>
      </div>
    );
  }

  // compact default
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg bg-emerald-100/90 border border-emerald-300/80 px-2 py-0.5 text-[10px] font-extrabold text-emerald-900 tracking-tight shadow-2xs ${className}`}
      title="Klub Anti Indent: stock ready, ngobrol kebutuhan gampang."
    >
      <Zap className="h-2.5 w-2.5 text-emerald-700 fill-emerald-700 shrink-0" />
      <span>Anti Indent Club</span>
    </span>
  );
}
