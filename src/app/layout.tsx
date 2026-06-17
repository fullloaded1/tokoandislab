import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import { Analytics } from "@vercel/analytics/react";
import WhatsAppLeadModal from "@/components/WhatsAppLeadModal";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  openGraph: {
    title: "AndisLab — Distributor Alat Laboratorium, Bahan Kimia & Furniture Lab",
    description:
      "Katalog terlengkap alat laboratorium, bahan kimia, reagen, instrumen analitik, dan furniture lab custom berkualitas di Indonesia. Minta penawaran langsung sekarang.",
    type: "website",
    siteName: "AndisLab",
    images: [
      {
        url: "/images/og-image.jpg",
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
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-57LWKFHVYZ`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-57LWKFHVYZ');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "AndisLab",
              url: "https://www.andislab.com",
              logo: "https://www.andislab.com/images/logo.png",
              description: "Distributor Alat Laboratorium, Bahan Kimia & Furniture Lab",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Jl. Raya Mayor Oking Jaya Atmaja No.112, Cirimekar",
                addressLocality: "Cibinong, Kabupaten Bogor",
                addressRegion: "Jawa Barat",
                postalCode: "16918",
                addressCountry: "ID"
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+62-821-2552-3466",
                contactType: "customer service"
              }
            })
          }}
        />
        <ToastProvider>
          {children}
          <WhatsAppLeadModal />
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
