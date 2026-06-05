import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://andislabs.com"),
  title: "AndisLab — Distributor Alat Laboratorium Indonesia",
  description:
    "Andis Lab adalah distributor resmi peralatan laboratorium, furnitur lab custom, reagent, dan glassware terpercaya di Indonesia. Minta penawaran langsung via WhatsApp.",
  keywords: [
    "peralatan laboratorium",
    "distributor lab",
    "Lovibond",
    "Daihan Labtech",
    "Pyrex",
    "furniture lab",
    "andis lab",
    "andislab",
  ],
  openGraph: {
    title: "AndisLab — Distributor Alat Laboratorium Indonesia",
    description:
      "Katalog lengkap alat laboratorium berkualitas. Minta penawaran langsung.",
    type: "website",
    siteName: "AndisLab",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AndisLab Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AndisLab — Distributor Alat Laboratorium Indonesia",
    description: "Katalog lengkap alat laboratorium berkualitas.",
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
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
