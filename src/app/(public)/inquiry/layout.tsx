import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Permintaan Penawaran Harga (RFQ) Alat Lab | AndisLab",
  description:
    "Kirim daftar kebutuhan alat laboratorium Anda. Dapatkan Surat Penawaran Harga (SPH) resmi 1x24 jam dari distributor resmi PT Andis Sentral Laboratorium.",
  alternates: {
    canonical: "/inquiry",
  },
  openGraph: {
    title: "Permintaan Penawaran Harga (RFQ) Alat Lab | AndisLab",
    description: "Kirim daftar kebutuhan alat lab Anda. SPH resmi terbit 1x24 jam.",
    url: "https://www.andislab.com/inquiry",
    type: "website",
    siteName: "AndisLab",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Permintaan SPH AndisLab" }],
  },
};

export default function InquiryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

