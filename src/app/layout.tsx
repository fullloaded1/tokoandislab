import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import WhatsAppLeadModalWrapper from "@/components/WhatsAppLeadModalWrapper";
import LeadMagnetModalWrapper from "@/components/LeadMagnetModalWrapper";
import { WA_NUMBER } from "@/lib/contact";
import { COMPANY_FACTS } from "@/lib/companyFacts";
import { getOrganizationSchema } from "@/services/seo";
import { GA_TRACKING_ID } from "@/lib/analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.andislab.com"),
  title: "AndisLab — Distributor Alat Laboratorium, Bahan Kimia & Furniture Lab",
  description:
    "AndisLab adalah distributor resmi peralatan laboratorium, bahan kimia, reagen, glassware Pyrex, alat uji air Lovibond, inkubator Daihan Labtech, dan furnitur lab custom terpercaya di Indonesia. Dapatkan penawaran harga terbaik via WhatsApp.",
  keywords: [
    "jual alat laboratorium",
    "distributor alat lab indonesia",
    "bahan kimia lab",
    "reagent kimia",
    "Biosafety Cabinet (BSC)",
    "Laminar Air Flow (LAF)",
    "Lemari Asam",
    "Fume Hood",
    "alat uji air",
    "pH meter",
    "Lovibond Indonesia",
    "Daihan Labtech Indonesia",
    "Pyrex original",
    "furniture lab custom",
    "harga alat laboratorium",
    "toko alat lab",
    "andislab",
    "andis lab"
  ],
  alternates: {
    canonical: "https://www.andislab.com",
  },
  openGraph: {
    title: "AndisLab — Distributor Alat Laboratorium, Bahan Kimia & Furniture Lab",
    description:
      "Katalog terlengkap alat laboratorium, bahan kimia, reagen, instrumen analitik, dan furniture lab custom berkualitas di Indonesia. Minta penawaran langsung sekarang.",
    type: "website",
    siteName: "AndisLab",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "AndisLab - Distributor Alat Laboratorium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AndisLab — Distributor Alat Laboratorium, Bahan Kimia & Furniture Lab",
    description: "Katalog terlengkap alat laboratorium, bahan kimia, reagen, dan furniture lab custom.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = getOrganizationSchema();
  
  // Extend organizationSchema with more specific data from COMPANY_FACTS if needed
  Object.assign(organizationSchema, {
    alternateName: COMPANY_FACTS.shortName,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Indonesia",
      addressCountry: "ID"
    },
    sameAs: [
      "https://www.linkedin.com/company/andislab",
      "https://www.tokopedia.com/andislab",
      "https://shopee.co.id/andislab"
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: COMPANY_FACTS.ratingValue,
      reviewCount: COMPANY_FACTS.reviewCount,
      bestRating: "5",
      worstRating: "1"
    }
  });

  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <ToastProvider>
          {children}
          <WhatsAppLeadModalWrapper />
          <LeadMagnetModalWrapper />
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
