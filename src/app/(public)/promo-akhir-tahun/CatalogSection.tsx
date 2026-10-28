import React from "react";
import Link from "next/link";
import { PromoCatalog } from "@/data/promo-akhir-tahun";
import { sortProductsByPrice, buildPromoWaUrl } from "@/lib/promo-akhir-tahun";
import PromoProductCard from "./PromoProductCard";
import BonusHighlight from "./BonusHighlight";
import PromoWaLink from "./PromoWaLink";
import { Printer, Users, ArrowRight, MessageSquare, CheckCircle } from "lucide-react";

interface CatalogSectionProps {
  catalog: PromoCatalog;
  promoPhase?: string;
}

export default function CatalogSection({ catalog, promoPhase = "active" }: CatalogSectionProps) {
  const sortedProducts = sortProductsByPrice(catalog.products);

  const themeConfig = {
    "blue-amber": {
      tagBg: "bg-blue-100 text-blue-800 border-blue-200",
      limitBg: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
      headlineGradient: "from-blue-950 via-blue-900 to-indigo-900",
      targetBg: "bg-blue-50 text-blue-700 border-blue-200",
      ctaBg: "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/25",
      printBtn: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200",
    },
    "navy-teal": {
      tagBg: "bg-teal-100 text-teal-800 border-teal-200",
      limitBg: "bg-gradient-to-r from-slate-900 to-teal-800 text-white",
      headlineGradient: "from-slate-950 via-slate-900 to-teal-950",
      targetBg: "bg-teal-50 text-teal-800 border-teal-200",
      ctaBg: "bg-gradient-to-r from-slate-900 via-slate-800 to-teal-800 hover:from-black hover:to-teal-900 text-white shadow-teal-500/25",
      printBtn: "bg-teal-50 text-teal-800 hover:bg-teal-100 border-teal-200",
    },
    "slate-gold": {
      tagBg: "bg-amber-100 text-amber-900 border-amber-200",
      limitBg: "bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-amber-300 border border-amber-500/30",
      headlineGradient: "from-slate-950 via-indigo-950 to-slate-900",
      targetBg: "bg-slate-100 text-slate-800 border-slate-200",
      ctaBg: "bg-gradient-to-r from-slate-900 via-black to-slate-900 hover:from-slate-950 hover:to-black text-amber-300 border border-amber-500/40 shadow-xl",
      printBtn: "bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-300",
    },
  }[catalog.theme];

  return (
    <section id={catalog.id} className="scroll-mt-24 py-16 sm:py-20 border-b border-slate-200 last:border-0">
      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-12 px-4">
        {/* Badges: Catalog name + Limit */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${themeConfig.tagBg}`}>
            Katalog {catalog.number}: {catalog.title}
          </span>
          <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wide shadow-xs ${themeConfig.limitBg}`}>
            Plafon: {catalog.limit}
          </span>
        </div>

        {/* Subtitle / Category Focus */}
        <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
          {catalog.subtitle}
        </div>

        {/* Headline */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          {catalog.headline}
        </h2>

        {/* Hook */}
        <p className="text-base sm:text-xl font-semibold text-slate-700 max-w-2xl mx-auto leading-relaxed">
          {catalog.hook}
        </p>

        {/* Copy */}
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {catalog.copy}
        </p>

        {/* Target Audience & Print Sheet link */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${themeConfig.targetBg}`}>
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>Target: {catalog.target}</span>
          </div>

          <Link
            href={`/promo-akhir-tahun/katalog/${catalog.number}`}
            target="_blank"
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors shadow-2xs ${themeConfig.printBtn}`}
          >
            <Printer className="w-3.5 h-3.5 shrink-0" />
            <span>Lembar Cetak A4</span>
          </Link>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {sortedProducts.map((product) => (
          <PromoProductCard
            key={product.slug}
            product={product}
            catalogId={catalog.id}
            catalogName={catalog.title}
            catalogBonus={catalog.bonus}
            theme={catalog.theme}
            promoPhase={promoPhase}
          />
        ))}
      </div>

      {/* Highlight Box (Bonus, Bundling, Add-on) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BonusHighlight
          bonus={catalog.bonus}
          bundleNote={catalog.bundleNote}
          addOnNote={catalog.addOnNote}
          theme={catalog.theme}
        />
      </div>

      {/* Catalog CTA Footer */}
      <div className="text-center pt-2 px-4">
        <PromoWaLink
          message={`Halo AndisLab, saya ingin konsultasi dan meminta penawaran untuk ${catalog.title} (Promo Akhir Tahun).`}
          catalogId={catalog.id}
          catalogName={catalog.title}
          promoPhase={promoPhase}
          placement="catalog_footer"
          className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${themeConfig.ctaBg}`}
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          <span>{catalog.ctaText}</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </PromoWaLink>
      </div>
    </section>
  );
}
