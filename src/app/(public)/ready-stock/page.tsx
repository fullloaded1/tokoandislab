/* Hallmark · page: ReadyStock · genre: modern-minimal · macrostructure: Workbench · design-system: design.md */
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import AntiIndentBadge from "@/components/AntiIndentBadge";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Alat Lab Ready Stock — Kirim Cepat | AndisLab",
  description: "Inkubator, oven, LAF, BSC, mikroskop, dan alat lab lainnya ready stock. Siap kirim 1×24 jam ke seluruh Indonesia. Dokumen SPJ & Faktur Pajak lengkap.",
  alternates: { canonical: "/ready-stock" },
  openGraph: {
    title: "Alat Lab Ready Stock — Kirim Cepat | AndisLab",
    description: "Inkubator, oven, LAF, BSC, mikroskop, dan alat lab lainnya ready stock. Siap kirim 1×24 jam ke seluruh Indonesia.",
    type: "website",
    siteName: "AndisLab",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Ready Stock AndisLab" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alat Lab Ready Stock — Kirim Cepat | AndisLab",
    description: "Inkubator, oven, LAF, BSC, mikroskop, dan alat lab lainnya ready stock. Siap kirim 1×24 jam ke seluruh Indonesia.",
    images: ["/logo.png"],
  },
};

import { getGroupedProducts, serializeProductDecimals } from "@/lib/products";
import { getReadyStockSummary } from "@/lib/readyStock";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Tier classification by price range (in IDR)
// A: 1 – 30 jt | B: 31 – 70 jt | C: 70 – 200 jt | D: > 200 jt
// ---------------------------------------------------------------------------
const TIERS = [
  {
    id: "A",
    label: "Tier A",
    range: "Rp 1 jt – Rp 30 jt",
    description: "Alat entry-level & mid-range terjangkau",
    min: 1_000_000,
    max: 30_000_000,
    color: "emerald",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    heading: "text-emerald-400",
  },
  {
    id: "B",
    label: "Tier B",
    range: "Rp 31 jt – Rp 70 jt",
    description: "Alat profesional performa tinggi",
    min: 30_000_001,
    max: 70_000_000,
    color: "blue",
    badge: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    heading: "text-blue-400",
  },
  {
    id: "C",
    label: "Tier C",
    range: "Rp 71 jt – Rp 200 jt",
    description: "Alat riset & industri grade",
    min: 70_000_001,
    max: 200_000_000,
    color: "violet",
    badge: "bg-violet-500/20 text-violet-300 border-violet-400/30",
    heading: "text-violet-400",
  },
] as const;

const TIER_D = {
  id: "D",
  label: "Tier D — Premium",
  range: "> Rp 200 jt",
  description: "Instrumen analitik & sistem otomasi kelas atas",
  min: 200_000_001,
  max: Infinity,
  color: "amber",
  badge: "bg-amber-500/20 text-amber-300 border-amber-400/30",
  heading: "text-amber-400",
};

function getProductMinPrice(product: ReturnType<typeof serializeProductDecimals>): number {
  const summary = getReadyStockSummary(product);
  if (summary.minPrice > 0) return summary.minPrice;
  return Number(product.price) ?? 0;
}

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
    const aMin = getProductMinPrice(a);
    const bMin = getProductMinPrice(b);
    return aMin - bMin;
  });

  // Group products by tier
  const tierGroups = TIERS.map((tier) => ({
    tier,
    products: products.filter((p) => {
      const price = getProductMinPrice(p);
      return price >= tier.min && price <= tier.max;
    }),
  }));

  const tierDProducts = products.filter((p) => {
    const price = getProductMinPrice(p);
    return price > TIER_D.min - 1; // > 200 jt
  });

  const uncategorized = products.filter((p) => {
    const price = getProductMinPrice(p);
    return price < 1_000_000; // belum ada harga / di bawah 1 jt
  });

  const totalProducts = products.length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
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

      {/* Hero Banner */}
      <div className="mb-10 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-emerald-950 via-teal-950/90 to-slate-950 p-6 sm:p-10 lg:p-12 text-white shadow-2xl border border-emerald-500/30">
        {/* Ambient emerald glow */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/20 px-4 py-1.5 text-xs font-black text-emerald-300 border border-emerald-400/30 shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              🔥 Pengiriman Instan &amp; PO
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-2xl bg-white/10 px-4 py-1.5 text-xs font-bold text-slate-200 border border-white/10 backdrop-blur-md">
              📦 Garansi Resmi Principal 1 Tahun
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-2xl bg-white/10 px-4 py-1.5 text-xs font-bold text-slate-200 border border-white/10 backdrop-blur-md">
              🛡️ Dokumen SPJ &amp; Faktur Pajak Lengkap
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 leading-tight">
            Produk <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">Ready Stock</span> — Siap Kirim Hari Ini
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed font-medium">
            Semua unit di bawah ini tersedia dan siap dikirim dalam <strong className="text-white font-extrabold underline decoration-emerald-400/60">1x24 jam kerja</strong> ke seluruh laboratorium instansi, universitas, atau perusahaan Anda di seluruh Indonesia dengan kelengkapan dokumen formal pengadaan SPJ.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <AntiIndentBadge variant="banner" showConsultText={true} />
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              <span className="text-xs text-slate-400 font-semibold mr-1">📄 Katalog PDF:</span>
              <a
                id="download-katalog-m1"
                href="/api/ready-stock-pdf?edition=M1"
                download
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 px-3.5 py-1.5 text-xs font-black text-white transition-all duration-200 focus-visible:outline-2 focus-visible:outline-white"
              >
                ⬇ Edisi M1
              </a>
              <a
                id="download-katalog-m3"
                href="/api/ready-stock-pdf?edition=M3"
                download
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500/25 hover:bg-amber-500/40 border border-amber-400/30 px-3.5 py-1.5 text-xs font-black text-amber-300 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-amber-400"
              >
                ⬇ Edisi M3
              </a>
            </div>
          </div>
        </div>
      </div>


      {/* Tier Legend */}
      <div className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TIERS.map((tier) => {
          const count = tierGroups.find((g) => g.tier.id === tier.id)?.products.length ?? 0;
          return (
            <a
              key={tier.id}
              href={`#tier-${tier.id}`}
              className="group flex flex-col gap-1.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md p-4 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              <span className={`inline-flex w-fit items-center rounded-xl px-2.5 py-0.5 text-xs font-black border ${tier.badge}`}>
                {tier.label}
              </span>
              <span className="text-sm font-bold text-slate-800">{tier.range}</span>
              <span className="text-xs text-slate-500">{count} produk</span>
            </a>
          );
        })}
        <a
          href="#tier-D"
          className="group flex flex-col gap-1.5 rounded-2xl border border-amber-200 bg-amber-50 hover:border-amber-300 hover:shadow-md p-4 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-amber-500"
        >
          <span className={`inline-flex w-fit items-center rounded-xl px-2.5 py-0.5 text-xs font-black border ${TIER_D.badge}`}>
            ✨ {TIER_D.label}
          </span>
          <span className="text-sm font-bold text-slate-800">{TIER_D.range}</span>
          <span className="text-xs text-slate-500">{tierDProducts.length} produk</span>
        </a>
      </div>

      {totalProducts === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-100 rounded-3xl text-center">
          <p className="text-slate-500 font-medium">Belum ada produk Ready Stock saat ini.</p>
          <Link href="/katalog" className="mt-4 text-blue-600 font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] rounded-sm">
            Lihat Semua Katalog &rarr;
          </Link>
        </div>
      ) : (
        <section className="space-y-16">
          <h2 className="sr-only">Daftar Produk Ready Stock</h2>

          {/* Tier A, B, C */}
          {tierGroups.map(({ tier, products: tierProducts }) =>
            tierProducts.length === 0 ? null : (
              <div key={tier.id} id={`tier-${tier.id}`} className="scroll-mt-24">
                {/* Section header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center rounded-2xl px-4 py-1.5 text-sm font-black border ${tier.badge}`}>
                      {tier.label}
                    </span>
                    <div>
                      <p className={`text-lg font-black ${tier.heading}`}>{tier.range}</p>
                      <p className="text-xs text-slate-500 font-medium">{tier.description}</p>
                    </div>
                  </div>
                  <div className="flex-1 h-px bg-slate-200 ml-2" />
                  <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">{tierProducts.length} produk</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
                  {tierProducts.map((product) => (
                    <ProductCard key={product.id} product={product} headingLevel="h3" />
                  ))}
                </div>
              </div>
            )
          )}

          {/* Tier D — Premium (terpisah & menonjol) */}
          {tierDProducts.length > 0 && (
            <div id="tier-D" className="scroll-mt-24">
              {/* Premium section header */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950 via-yellow-950/80 to-slate-950 p-6 mb-6 border border-amber-500/30 shadow-xl">
                <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center rounded-2xl px-4 py-1.5 text-sm font-black border ${TIER_D.badge}`}>
                      ✨ {TIER_D.label}
                    </span>
                    <div>
                      <p className={`text-lg font-black ${TIER_D.heading}`}>{TIER_D.range}</p>
                      <p className="text-xs text-amber-200/70 font-medium">{TIER_D.description}</p>
                    </div>
                  </div>
                  <div className="sm:ml-auto">
                    <p className="text-xs text-amber-200/60 font-semibold">{tierDProducts.length} unit tersedia</p>
                    <p className="text-xs text-amber-200/50">Konsultasi khusus dengan tim sales kami</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
                {tierDProducts.map((product) => (
                  <ProductCard key={product.id} product={product} headingLevel="h3" />
                ))}
              </div>
            </div>
          )}

          {/* Uncategorized / no price */}
          {uncategorized.length > 0 && (
            <div id="tier-uncategorized" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-6">
                <span className="inline-flex items-center rounded-2xl bg-slate-100 text-slate-500 border border-slate-200 px-4 py-1.5 text-sm font-bold">
                  Hubungi Sales
                </span>
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">{uncategorized.length} produk</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
                {uncategorized.map((product) => (
                  <ProductCard key={product.id} product={product} headingLevel="h3" />
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
