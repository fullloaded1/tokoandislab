import React from "react";
import { Gift, PackagePlus, Info, CheckCircle2 } from "lucide-react";

interface BonusHighlightProps {
  bonus: string[];
  bundleNote: string;
  addOnNote?: string;
  theme: "blue-amber" | "navy-teal" | "slate-gold";
}

export default function BonusHighlight({
  bonus,
  bundleNote,
  addOnNote,
  theme,
}: BonusHighlightProps) {
  const containerTheme = {
    "blue-amber": "bg-gradient-to-br from-blue-50/80 via-white to-amber-50/50 border-blue-200/80",
    "navy-teal": "bg-gradient-to-br from-slate-50 via-teal-50/40 to-slate-100/60 border-teal-200/80",
    "slate-gold": "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white border-amber-500/30",
  }[theme];

  const titleTheme = {
    "blue-amber": "text-blue-900",
    "navy-teal": "text-slate-900",
    "slate-gold": "text-amber-300",
  }[theme];

  const iconTheme = {
    "blue-amber": "text-blue-600 bg-blue-100",
    "navy-teal": "text-teal-700 bg-teal-100",
    "slate-gold": "text-amber-400 bg-amber-500/20",
  }[theme];

  const checkTheme = {
    "blue-amber": "text-blue-600",
    "navy-teal": "text-teal-600",
    "slate-gold": "text-amber-400",
  }[theme];

  const isDark = theme === "slate-gold";

  return (
    <div className={`rounded-2xl p-6 sm:p-8 border shadow-sm ${containerTheme} space-y-5 my-8`}>
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${iconTheme}`}>
          <Gift className="w-5 h-5 shrink-0" />
        </div>
        <div>
          <h4 className={`text-base sm:text-lg font-extrabold tracking-tight ${titleTheme}`}>
            Bonus Pembelian Promo
          </h4>
          <p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Termasuk langsung dalam setiap penerbitan SPH dan PO promo akhir tahun
          </p>
        </div>
      </div>

      {/* Bonus list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {bonus.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${checkTheme}`} />
            <span className={`text-xs sm:text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}>
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Bundling note */}
      {bundleNote && (
        <div
          className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs sm:text-sm ${
            isDark
              ? "bg-white/5 border-white/10 text-slate-200"
              : "bg-amber-50/80 border-amber-200/80 text-amber-950"
          }`}
        >
          <PackagePlus className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? "text-amber-400" : "text-amber-700"}`} />
          <div>
            <span className="font-bold mr-1">Bundling Prioritas:</span>
            <span>{bundleNote}</span>
          </div>
        </div>
      )}

      {/* Add-on Note: Displayed strictly as standard service info, NOT free bonus */}
      {addOnNote && addOnNote.trim().length > 0 && (
        <div
          className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs ${
            isDark
              ? "bg-slate-800/60 border-slate-700/60 text-slate-300"
              : "bg-slate-100/80 border-slate-200/80 text-slate-700"
          }`}
        >
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" />
          <div>
            <span className="font-bold text-slate-800 mr-1 dark:text-slate-200">Layanan Tambahan (Terpisah):</span>
            <span>{addOnNote}</span>
          </div>
        </div>
      )}
    </div>
  );
}
