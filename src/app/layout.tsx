import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
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
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
