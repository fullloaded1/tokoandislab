import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  PRINT_TIER_CATALOGS,
  ORDER_GUIDE_SHEET,
  COMMON_PRINT_FOOTER,
} from "@/data/promo-print-catalog";
import PrintToolbar from "./PrintToolbar";
import "./print-sheet.css";

interface PrintPageProps {
  params: Promise<{ n: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ n: "1" }, { n: "2" }, { n: "3" }, { n: "4" }];
}

export async function generateMetadata(props: PrintPageProps): Promise<Metadata> {
  const { n } = await props.params;
  const num = parseInt(n, 10);

  if (num === 4) {
    return {
      title: "Panduan Pemesanan & Syarat Pengadaan | AndisLab Katalog Promo 2026",
      description: "Tata cara pemesanan resmi dan syarat pengadaan alat laboratorium AndisLab akhir tahun 2026.",
      robots: { index: false, follow: true },
    };
  }

  const catalog = PRINT_TIER_CATALOGS[num];
  if (!catalog) return { title: "Katalog Tidak Ditemukan" };

  return {
    title: `Lembar ${catalog.tierCode}: ${catalog.title} (${catalog.plafonValue}) | AndisLab`,
    description: `Katalog promo akhir tahun AndisLab: ${catalog.title}. Ready stock bergaransi resmi.`,
    robots: { index: false, follow: true },
  };
}

export default async function CatalogPrintPage(props: PrintPageProps) {
  const { n } = await props.params;
  const num = parseInt(n, 10);

  if (num === 4) {
    return <OrderGuidePage />;
  }

  const catalog = PRINT_TIER_CATALOGS[num];
  if (!catalog) {
    notFound();
  }

  const themeConfig = {
    blue: {
      badgeBg: "bg-blue-600 text-white",
      headerBorder: "border-blue-600",
      accentText: "text-blue-700",
      cardBorder: "border-blue-200 hover:border-blue-500",
      pillBg: "bg-blue-50 text-blue-800 border-blue-200",
    },
    teal: {
      badgeBg: "bg-teal-700 text-white",
      headerBorder: "border-teal-700",
      accentText: "text-teal-800",
      cardBorder: "border-teal-200 hover:border-teal-500",
      pillBg: "bg-teal-50 text-teal-800 border-teal-200",
    },
    amber: {
      badgeBg: "bg-amber-600 text-white",
      headerBorder: "border-amber-600",
      accentText: "text-amber-800",
      cardBorder: "border-amber-200 hover:border-amber-500",
      pillBg: "bg-amber-50 text-amber-900 border-amber-200",
    },
  }[catalog.accentColor];

  return (
    <div className="a4-container">
      <PrintToolbar currentCatalogNumber={catalog.number} />

      <main className="a4-sheet font-sans text-slate-900">
        {/* ===== 1. HEADER (BRAND IDENTITY + 12-COLUMN GRID) ===== */}
        <header className="border-b-2 border-slate-900 pb-3 print:pb-1.5">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="PT Andis Sentral Laboratorium"
                width={130}
                height={40}
                className="h-9 w-auto object-contain print:h-6"
                priority
              />
              <div className="border-l border-slate-300 pl-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 block print:text-[6.5pt]">
                  PT Andis Sentral Laboratorium
                </span>
                <span className="text-[9px] text-slate-500 font-medium block print:text-[6pt]">
                  Distributor Resmi Alat Laboratorium &amp; Alat Kesehatan
                </span>
              </div>
            </div>

            {/* Right: Plafon Badge */}
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-2xs ${themeConfig.badgeBg} print:text-[7pt] print:py-0.2 print:px-2`}>
                {catalog.plafonLabel}: {catalog.plafonValue}
              </span>
              <div className="text-[10px] font-semibold text-slate-500 mt-1 print:text-[6pt] print:mt-0">
                Periode: {catalog.periodText}
              </div>
            </div>
          </div>

          {/* Catalog Title */}
          <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-end justify-between gap-4 print:mt-1 print:pt-1">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 print:text-[7pt]">
                {catalog.tierCode} • {catalog.headerBadge}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight tracking-tight uppercase print:text-[13pt] print:leading-tight">
                {catalog.title}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5 print:text-[7.5pt] print:mt-0">
                {catalog.subtitle}
              </p>
            </div>
          </div>
        </header>

        {/* ===== 2. NARRATIVE STRIP ===== */}
        <section className="bg-slate-50 rounded-lg border border-slate-200 px-3.5 py-2 text-xs sm:text-sm text-slate-700 leading-relaxed text-justify print:p-1.5 print:text-[7pt] print:leading-normal print:rounded-md">
          <p>{catalog.narrative}</p>
        </section>

        {/* ===== 3. FEATURED INSTRUMENTS (3 CARDS, 4:3 IMAGE RATIO) ===== */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3 print:grid-cols-3 print:gap-1.5">
          {catalog.featured.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-xl border ${themeConfig.cardBorder} p-3 flex flex-col justify-between shadow-2xs print:p-1.5 print:border print:rounded-md print:shadow-none`}
            >
              <div>
                {/* Card Top: Number/Name + Ready Badge */}
                <div className="flex items-center justify-between gap-2 mb-1.5 print:mb-0.5">
                  <span className="text-xs font-black text-slate-900 uppercase truncate print:text-[7pt]">
                    {item.badge}
                  </span>
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 print:text-[6pt] print:py-0 print:px-1">
                    {item.stock}
                  </span>
                </div>

                {/* Photo Frame (4:3 ratio, clean background, no crop) */}
                <div className="relative aspect-[4/3] w-full bg-slate-50/80 rounded-lg flex items-center justify-center p-2 overflow-hidden border border-slate-100 my-1 print:h-20 print:p-1 print:my-0.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Name */}
                <h2 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1 print:text-[8pt]">
                  {item.title}
                </h2>

                {/* Model & Brand */}
                <div className="text-[11px] font-semibold text-blue-700 leading-tight mt-0.5 truncate print:text-[6.8pt]">
                  {item.modelBrand}
                </div>

                {/* 1 baris manfaat + fakta */}
                <p className="text-[11px] text-slate-600 leading-tight mt-1 line-clamp-2 print:text-[6.2pt] print:leading-tight print:mt-0.5">
                  {item.benefitFact}
                </p>
              </div>

              {/* Price Box */}
              <div className="bg-slate-50 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-xs border border-slate-200 mt-2 print:p-1 print:mt-1 print:rounded-md">
                <span className="text-slate-600 font-medium text-[11px] shrink-0 print:text-[6.2pt]">
                  {item.priceLabel}
                </span>
                <span className="font-black text-rose-700 text-sm sm:text-base font-mono whitespace-nowrap print:text-[8.5pt]">
                  {item.price}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* ===== 4. FULL READY STOCK INVENTORY TABLE ===== */}
        <section className="flex flex-col">
          <div className="flex items-center justify-between mb-1 print:mb-0.5">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 print:text-[8pt]">
              {catalog.tableTitle}
            </h2>
            <span className="text-[11px] font-semibold text-slate-500 print:text-[6.5pt]">
              {catalog.tableSubtitle}
            </span>
          </div>

          <div className="rounded-lg border border-slate-300 overflow-hidden shadow-2xs print:border print:rounded-md">
            <table className="w-full border-collapse text-xs leading-normal print:text-[6.5pt] print:leading-tight">
              <thead>
                <tr className="bg-[#0B1E3B] text-white">
                  <th className="py-1.5 px-2 text-center font-bold w-16 border-r border-slate-700 print:py-0.5 print:px-1 print:w-12">Kode</th>
                  <th className="py-1.5 px-3 text-left font-bold border-r border-slate-700 print:py-0.5 print:px-1.5">Produk</th>
                  <th className="py-1.5 px-3 text-left font-bold w-40 border-r border-slate-700 print:py-0.5 print:px-1.5 print:w-28">Model</th>
                  <th className="py-1.5 px-2 text-left font-bold w-28 border-r border-slate-700 print:py-0.5 print:px-1 print:w-20">Brand</th>
                  <th className="py-1.5 px-3 text-right font-bold w-36 border-r border-slate-700 print:py-0.5 print:px-1.5 print:w-24">Harga</th>
                  <th className="py-1.5 px-2 text-center font-bold w-24 print:py-0.5 print:px-1 print:w-16">Stok</th>
                </tr>
              </thead>
              <tbody>
                {catalog.tableRows.map((row) => (
                  <tr
                    key={row.code}
                    className="border-t border-slate-200 even:bg-slate-50/70 hover:bg-blue-50/40"
                  >
                    <td className="py-1 px-2 text-center font-mono font-bold text-slate-800 border-r border-slate-200 whitespace-nowrap print:py-0.5 print:px-1">
                      {row.code}
                    </td>
                    <td className="py-1 px-3 border-r border-slate-200 print:py-0.5 print:px-1.5">
                      <div className="flex items-center gap-1.5">
                        {row.isFeatured && (
                          <span className="text-amber-500 font-black text-xs shrink-0 print:text-[7pt]" title="Produk Unggulan">
                            ★
                          </span>
                        )}
                        <span className="font-semibold text-slate-900 truncate">
                          {row.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-1 px-3 font-mono text-slate-700 border-r border-slate-200 truncate print:py-0.5 print:px-1.5">
                      {row.model}
                    </td>
                    <td className="py-1 px-2 font-semibold text-slate-700 border-r border-slate-200 truncate print:py-0.5 print:px-1">
                      {row.brand}
                    </td>
                    <td className="py-1 px-3 text-right font-mono font-black text-slate-950 border-r border-slate-200 whitespace-nowrap print:py-0.5 print:px-1.5">
                      {row.price}
                    </td>
                    <td className="py-1 px-2 text-center font-bold text-slate-800 whitespace-nowrap print:py-0.5 print:px-1">
                      {row.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legenda Tabel */}
          <div className="mt-1 text-[10px] font-medium text-slate-500 flex items-center justify-between print:text-[6pt] print:mt-0.5">
            <span><strong className="text-amber-600">★</strong> = Produk unggulan ready stock prioritas pengiriman.</span>
            <span>Seluruh unit melewati uji fungsi sebelum serah terima.</span>
          </div>
        </section>

        {/* ===== 5. CTA BOX (PRESENT ON ALL SHEETS) ===== */}
        <section className="bg-amber-50/80 rounded-xl border border-amber-300 px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs print:p-1.5 print:rounded-md print:flex-row print:gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-800 leading-snug print:text-[6.5pt] print:leading-tight">
              {catalog.ctaText}
            </p>
          </div>

          <div className="shrink-0 text-center border-t md:border-t-0 md:border-l border-amber-300 pt-2 md:pt-0 md:pl-4 print:border-t-0 print:border-l print:pt-0 print:pl-2">
            <div className="text-xs font-black text-rose-700 uppercase tracking-tight print:text-[7pt]">
              {catalog.ctaSub}
            </div>
            <div className="text-[10px] font-mono text-slate-700 font-semibold print:text-[6pt]">
              WhatsApp: [ISI: +62 819-9157-5096]
            </div>
          </div>
        </section>

        {/* ===== 6. FOOTER (UNIFIED ACROSS ALL SHEETS) ===== */}
        <footer className="border-t border-slate-300 pt-2 flex flex-col gap-1 text-[10px] text-slate-600 print:pt-1 print:text-[5.8pt] print:gap-0.5">
          {/* Contact Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 font-semibold text-slate-700 print:text-[6pt]">
            <span>PT Andis Sentral Laboratorium</span>
            <span>WA: <strong className="font-mono text-slate-900">[ISI: +62 819-9157-5096]</strong></span>
            <span>Email: <strong className="font-mono text-slate-900">[ISI: sales@andislab.com]</strong></span>
            <span>Telp: <strong className="font-mono text-slate-900">[ISI: No. Telepon Kantor]</strong></span>
            <span>Web: <strong className="text-blue-700 font-mono">www.andislab.com</strong></span>
            <span className="font-bold text-slate-900">Lembar {catalog.number} dari 4</span>
          </div>

          {/* Mandatory Footnote */}
          <div className="text-[9px] text-slate-500 leading-tight border-t border-slate-200/80 pt-1 print:text-[5.5pt] print:pt-0.5">
            {COMMON_PRINT_FOOTER}
          </div>
        </footer>
      </main>
    </div>
  );
}

{/* ===== SHEET 4: CARA PESAN & SYARAT PENGADAAN ===== */}
function OrderGuidePage() {
  const guide = ORDER_GUIDE_SHEET;

  return (
    <div className="a4-container">
      <PrintToolbar currentCatalogNumber={guide.number} />

      <main className="a4-sheet font-sans text-slate-900">
        {/* Header */}
        <header className="border-b-2 border-slate-900 pb-3 print:pb-1.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="PT Andis Sentral Laboratorium"
                width={130}
                height={40}
                className="h-9 w-auto object-contain print:h-6"
                priority
              />
              <div className="border-l border-slate-300 pl-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 block print:text-[6.5pt]">
                  PT Andis Sentral Laboratorium
                </span>
                <span className="text-[9px] text-slate-500 font-medium block print:text-[6pt]">
                  Distributor Resmi Alat Laboratorium &amp; Alat Kesehatan
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-900 text-white shadow-2xs print:text-[7pt] print:py-0.2 print:px-2">
                PANDUAN RESMI PENGADAAN
              </span>
              <div className="text-[10px] font-semibold text-slate-500 mt-1 print:text-[6pt] print:mt-0">
                Edisi M3 • 30 Okt – 30 Des 2026
              </div>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-200/80">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 print:text-[7pt]">
              LEMBAR PENUTUP • PANDUAN PENGADAAN
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight tracking-tight uppercase print:text-[13pt] print:leading-tight">
              {guide.title}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5 print:text-[7.5pt] print:mt-0">
              {guide.subtitle}
            </p>
          </div>
        </header>

        {/* 3 Langkah Mudah Pemesanan */}
        <section>
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 mb-2 print:text-[8pt] print:mb-1">
            3 Langkah Alur Pemesanan Resmi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print:grid-cols-3 print:gap-1.5">
            {guide.steps.map((st) => (
              <div
                key={st.step}
                className="bg-slate-50 rounded-xl border border-slate-200 p-3 flex flex-col justify-between print:p-2 print:rounded-md"
              >
                <div>
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center mb-1.5 print:w-4 print:h-4 print:text-[7pt]">
                    {st.step}
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 leading-snug print:text-[7.5pt]">
                    {st.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-1 print:text-[6.2pt] print:mt-0.5">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Syarat & Ketentuan Pengadaan */}
        <section>
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 mb-2 print:text-[8pt] print:mb-1">
            Ketentuan Layanan &amp; Transaksi
          </h2>
          <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-200 text-xs print:text-[6.5pt] print:rounded-md">
            {guide.terms.map((t, idx) => (
              <div
                key={idx}
                className="p-2.5 sm:px-3 sm:py-2 flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 even:bg-slate-50/60 print:py-1 print:px-2"
              >
                <span className="font-bold text-slate-900 sm:w-56 shrink-0 print:w-36">
                  {t.label}
                </span>
                <span className="text-slate-700 flex-1 leading-relaxed">
                  {t.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Informasi Kantor & QR Code WhatsApp */}
        <section className="bg-blue-50/70 rounded-xl border border-blue-200 p-3.5 flex flex-col md:flex-row items-center justify-between gap-4 print:p-2 print:rounded-md print:gap-2">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 print:text-[6pt]">
              Layanan Bantuan &amp; Konsultasi Teknis
            </span>
            <h3 className="text-sm font-black text-slate-900 mt-0.5 print:text-[8pt]">
              {guide.contacts.company}
            </h3>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed print:text-[6pt] print:mt-0.5">
              Alamat: {guide.contacts.address} • Telp: {guide.contacts.phone} • Email: {guide.contacts.email}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 border-t md:border-t-0 md:border-l border-blue-200 pt-2 md:pt-0 md:pl-4 print:border-t-0 print:border-l print:pt-0 print:pl-2">
            <div className="w-16 h-16 bg-white rounded-lg border border-slate-300 flex flex-col items-center justify-center p-1 text-center shadow-2xs print:w-12 print:h-12">
              <span className="text-[8px] font-mono font-bold text-slate-500 uppercase print:text-[5pt]">QR CODE</span>
              <span className="text-[7px] text-blue-700 font-black print:text-[5pt]">WhatsApp</span>
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 print:text-[7pt]">
                Hubungi Sales Via WhatsApp
              </div>
              <div className="text-[11px] font-mono text-blue-700 font-bold print:text-[6.5pt]">
                {guide.contacts.whatsapp}
              </div>
              <div className="text-[9px] text-slate-500 print:text-[5.5pt]">
                Respon Cepat Jam Kerja (08.00–17.00 WIB)
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-300 pt-2 flex flex-col gap-1 text-[10px] text-slate-600 print:pt-1 print:text-[5.8pt] print:gap-0.5">
          <div className="flex flex-wrap items-center justify-between gap-2 font-semibold text-slate-700 print:text-[6pt]">
            <span>PT Andis Sentral Laboratorium</span>
            <span>WA: <strong className="font-mono text-slate-900">[ISI: +62 819-9157-5096]</strong></span>
            <span>Email: <strong className="font-mono text-slate-900">[ISI: sales@andislab.com]</strong></span>
            <span>Telp: <strong className="font-mono text-slate-900">[ISI: No. Telepon Kantor]</strong></span>
            <span>Web: <strong className="text-blue-700 font-mono">www.andislab.com</strong></span>
            <span className="font-bold text-slate-900">Lembar 4 dari 4</span>
          </div>

          <div className="text-[9px] text-slate-500 leading-tight border-t border-slate-200/80 pt-1 print:text-[5.5pt] print:pt-0.5">
            {COMMON_PRINT_FOOTER}
          </div>
        </footer>
      </main>
    </div>
  );
}
