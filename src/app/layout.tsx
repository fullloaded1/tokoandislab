import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import { Analytics } from "@vercel/analytics/react";
import WhatsAppLeadModal from "@/components/WhatsAppLeadModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://andislabs.com"),
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
        <ToastProvider>
          {children}
          <WhatsAppLeadModal />
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
