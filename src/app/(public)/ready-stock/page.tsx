/* Hallmark · page: ReadyStock · genre: modern-minimal · macrostructure: Workbench · design-system: design.md */
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import AntiIndentBadge from "@/components/AntiIndentBadge";
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const WA_PROMO_MERDEKA = "/?wa=open&source=ready_stock_promo_merdeka&text=Halo%20AndisLab%2C%20saya%20ingin%20order%20promo%20Merdeka%20ready%20stock%3A%20";

export const metadata = {
  title: "Alat Lab Ready Stock — Kirim Cepat | AndisLab",
  description: "Inkubator, oven, autoclave, water bath Daihan ready stock. Hemat hingga 48% vs e-Katalog. Order sebelum 31 Juli, tiba pekan 17 Agustus. Cek stok via WhatsApp.",
  alternates: { canonical: "/ready-stock" },
  openGraph: {
    title: "Alat Lab Ready Stock — Kirim Cepat | AndisLab",
    description: "Inkubator, oven, autoclave, water bath Daihan ready stock. Hemat hingga 48% vs e-Katalog. Cek stok via WhatsApp.",
    type: "website",
    siteName: "AndisLab",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Ready Stock AndisLab" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alat Lab Ready Stock — Kirim Cepat | AndisLab",
    description: "Inkubator, oven, autoclave, water bath Daihan ready stock. Hemat hingga 48% vs e-Katalog.",
    images: ["/logo.png"],
  },
};

import { getGroupedProducts, serializeProductDecimals } from "@/lib/products";
import { getReadyStockSummary } from "@/lib/readyStock";

export const dynamic = "force-dynamic";

export default async function ReadyStockPage() {
  const allProducts = (await prisma.product.findMany({
    where: {
      isReadyStock: true,
    },
    include: {
      variants: true,
    },
    orderBy: {
      price: "asc",
    },
  })).map(serializeProductDecimals);

  const products = getGroupedProducts(allProducts).sort((a, b) => {
    const aMin = getReadyStockSummary(a).minPrice || Number(a.price);
    const bMin = getReadyStockSummary(b).minPrice || Number(b.price);
    return aMin - bMin;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner Promo Merdeka - UI/UX Pro Max 48px touch safe */}
      <WaLinkCTA
        href={WA_PROMO_MERDEKA}
        className="mb-6 flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 px-6 py-3.5 text-center text-sm sm:text-base font-black text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.99] border border-red-400/30"
      >
        <span>🇮🇩 Promo Merdeka — order ready stock sebelum 31 Juli, tiba di pekan 17 Agustus &rarr;</span>
      </WaLinkCTA>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-emerald-600 font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-sm">
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-black text-slate-900">
          Ready Stock
        </span>
      </nav>

      <div className="mb-10 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-emerald-950 via-teal-950/90 to-slate-950 p-6 sm:p-10 lg:p-12 text-white shadow-2xl border border-emerald-500/30">
        {/* Ambient emerald glow */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/20 px-4 py-1.5 text-xs font-black text-emerald-300 border border-emerald-400/30 shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              🔥 Pengiriman Instan & PO
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-2xl bg-white/10 px-4 py-1.5 text-xs font-bold text-slate-200 border border-white/10 backdrop-blur-md">
              📦 Garansi Resmi Principal 1 Tahun
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-2xl bg-white/10 px-4 py-1.5 text-xs font-bold text-slate-200 border border-white/10 backdrop-blur-md">
              🛡️ Dokumen SPJ & Faktur Pajak Lengkap
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 leading-tight">
            Produk <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">Ready Stock</span> — Siap Kirim Hari Ini
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed font-medium">
            Semua unit di bawah ini tersedia dan siap dikirim dalam <strong className="text-white font-extrabold underline decoration-emerald-400/60">1x24 jam kerja</strong> ke seluruh laboratorium instansi, universitas, atau perusahaan Anda di seluruh Indonesia dengan kelengkapan dokumen formal pengadaan SPJ.
          </p>
          <div className="mt-5">
            <AntiIndentBadge variant="banner" showConsultText={true} />
          </div>
        </div>
      </div>

      <section>
        <h2 className="sr-only">Daftar Produk Ready Stock</h2>
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-100 rounded-3xl text-center">
            <p className="text-slate-500 font-medium">Belum ada produk Ready Stock saat ini.</p>
            <Link href="/katalog" className="mt-4 text-blue-600 font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-sm">
              Lihat Semua Katalog &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} headingLevel="h3" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
