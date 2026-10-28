import type { Metadata } from "next";
import { catalogs } from "@/data/promo-akhir-tahun";
import { getPromoState } from "@/lib/promo-akhir-tahun";
import PromoHero from "./PromoHero";
import CatalogSection from "./CatalogSection";
import PromoExtras from "./PromoExtras";
import MobileStickyCta from "./MobileStickyCta";
import "./promo-akhir-tahun.css";

export const metadata: Metadata = {
  title: "Promo Akhir Tahun 2026 | Alat Laboratorium - AndisLab",
  description:
    "Promo Akhir Tahun 2026 AndisLab: Serap anggaran akhir tahun dengan instrumen laboratorium ready stock bergaransi resmi. SPH resmi terbit 1x24 jam.",
  alternates: {
    canonical: "/promo-akhir-tahun",
  },
  openGraph: {
    title: "Promo Akhir Tahun 2026 | Alat Laboratorium - AndisLab",
    description:
      "Tutup 2026, Buka Lab Impian. Instrumen ready stock di bawah plafon Rp30 Jt, Rp70 Jt, dan Rp200 Jt siap kirim sebelum tutup buku anggaran.",
    type: "website",
    url: "https://www.andislab.com/promo-akhir-tahun",
    siteName: "AndisLab",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Promo Akhir Tahun 2026 AndisLab",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Promo Akhir Tahun 2026 | Alat Laboratorium - AndisLab",
    description: "Serap anggaran akhir tahun dengan alat lab ready stock bergaransi resmi.",
    images: ["/logo.png"],
  },
};

export const revalidate = 60; // 60s ISR

export default function PromoAkhirTahunPage() {
  const promoState = getPromoState();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Hero Section */}
      <PromoHero promoState={promoState} />

      {/* 2. 3 Catalogs Sections */}
      <div className="space-y-0">
        {catalogs.map((catalog) => (
          <CatalogSection
            key={catalog.id}
            catalog={catalog}
            promoPhase={promoState.phaseId}
          />
        ))}
      </div>

      {/* 4. Additional Sections (Why 30 Dec, Trust, FAQ, Terms, Closing CTA) */}
      <PromoExtras promoState={promoState} />

      {/* 5. Mobile Sticky CTA */}
      <MobileStickyCta promoPhase={promoState.phaseId} />
    </main>
  );
}
