import { Metadata } from "next";
import LabCalculatorClient from "./LabCalculatorClient";
import { SEO_CONSTANTS } from "@/constants/seo";

export const metadata: Metadata = {
  title: "Kalkulator Pengenceran Larutan & Molaritas Kimia Online | AndisLab",
  description:
    "Kalkulator laboratorium online gratis untuk pengenceran larutan (C1V1 = C2V2), perhitungan bobot molaritas zat kimia, dan estimasi kapasitas autoclave sterilisasi.",
  keywords: [
    "kalkulator pengenceran larutan",
    "kalkulator c1v1 c2v2 online",
    "kalkulator molaritas kimia",
    "rumus pengenceran larutan",
    "kapasitas autoclave laboratorium",
    "alat laboratorium indonesia"
  ],
  alternates: {
    canonical: `${SEO_CONSTANTS.siteUrl}/kalkulator-lab`,
  },
  openGraph: {
    title: "Kalkulator Pengenceran Larutan & Molaritas Kimia Online | AndisLab",
    description:
      "Utilitas praktis untuk teknisi, analis QC, dan peneliti laboratorium: hitung pengenceran stok larutan, bobot molaritas, dan kapasitas autoclave secara akurat.",
    url: `${SEO_CONSTANTS.siteUrl}/kalkulator-lab`,
    type: "website",
  },
};

export default function LabCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Kalkulator Laboratorium Kimia & Mikrobiologi Online AndisLab",
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    url: `${SEO_CONSTANTS.siteUrl}/kalkulator-lab`,
    description: "Kalkulator online untuk menghitung pengenceran larutan kimia C1V1=C2V2, molaritas zat, dan estimasi ukuran autoclave laboratorium.",
    provider: {
      "@type": "Organization",
      name: "PT Andis Sentral Laboratorium",
      url: SEO_CONSTANTS.siteUrl,
    },
  };

  return (
    <main className="min-h-screen bg-slate-50/50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LabCalculatorClient />
    </main>
  );
}
