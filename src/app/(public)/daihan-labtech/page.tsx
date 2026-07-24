/* Hallmark · page: DaihanLabtech · genre: modern-minimal · macrostructure: Workbench · design-system: design.md */
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import ClientLogos from "@/components/ClientLogos";
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import {
  ChevronRight,
  MessageSquare,
  BadgeCheck,
  Thermometer,
  Flame,
  ShieldCheck,
  Droplets,
  Snowflake,
  CheckCircle2,
} from "lucide-react";
import { getGroupedProducts, serializeProductDecimals, formatRupiah } from "@/lib/products";
import { ETALASE_INAPROC_URL, WA_NUMBER_DISPLAY } from "@/lib/contact";
import { EKATALOG_ROWS } from "@/lib/ekatalog";

export const revalidate = 60;

// Pesan pre-filled WhatsApp (tanpa ?wa=open — WaLinkCTA membuka wa.me langsung dari text=).
const WA_DAFTAR_HARGA = "?text=Halo%20AndisLab%2C%20mohon%20kirim%20daftar%20harga%20lengkap%20Daihan%20Labtech%20terbaru.";
const WA_CTA_PENUTUP = "?text=Halo%20AndisLab%2C%20saya%20butuh%20penawaran%20Daihan%20Labtech%20untuk%20instansi%20kami.%20Daftar%20kebutuhan%3A%20";

// Grid kategori. keywords dipakai mencocokkan produk Daihan yang sudah ada di katalog
// agar jumlah & harga mulai dari tampil live (bukan hardcode).
const kategoriDaihan = [
  { label: "Inkubator Laboratorium", desc: "CO2 incubator, general incubator", icon: Thermometer, q: "incubator", keywords: ["incubator", "inkubator", "LCO", "LIB"] },
  { label: "Oven Laboratorium", desc: "Universal drying oven, forced convection oven", icon: Flame, q: "oven", keywords: ["oven", "LDO"] },
  { label: "Autoclave / Sterilizer", desc: "LAC series", icon: ShieldCheck, q: "autoclave", keywords: ["autoclave", "sterilizer", "LAC"] },
  { label: "Water Bath & Dry Block Heater", desc: "Penangas air & block heater", icon: Droplets, q: "water bath", keywords: ["water bath", "block heater", "LWB", "LBH"] },
  { label: "Cold Storage", desc: "Kulkas vaksin LCV, laboratory freezer, ultra low freezer", icon: Snowflake, q: "freezer", keywords: ["freezer", "refrigerator", "kulkas", "vaksin", "LCV", "LLF", "cold"] },
];

const faqItems = [
  {
    q: "Apakah AndisLab distributor resmi Daihan Labtech?",
    a: "AndisLab mendistribusikan produk Daihan Labtech original dengan garansi resmi untuk pasar Indonesia, melayani instansi pemerintah, kampus, rumah sakit, dan industri.",
  },
  {
    q: "Apakah bisa pembelian melalui e-Katalog / INAPROC?",
    a: "Bisa. AndisLab terdaftar di Katalog Elektronik INAPROC (katalog.inaproc.id/andis-sentral-laboratorium). Untuk banyak model, harga penawaran langsung kami lebih rendah daripada harga terdaftar di e-Katalog — silakan bandingkan sebelum memutuskan jalur pengadaan.",
  },
  {
    q: "Berapa lama pengiriman?",
    a: "Unit ready stock dikirim dengan pengiriman mudah dan cepat dalam 1–3 hari kerja setelah pembayaran/PO ke seluruh Indonesia.",
  },
  {
    q: "Apakah dokumen untuk SPJ lengkap?",
    a: "Ya: penawaran resmi ber-kop, invoice, surat jalan, dokumen legalitas (NPWP, NIB), dan dokumen pendukung pengadaan lainnya.",
  },
  {
    q: "Bagaimana cara minta penawaran?",
    a: `Kirim daftar kebutuhan (nama alat + model + jumlah) via WhatsApp ke ${WA_NUMBER_DISPLAY}. Penawaran resmi dikirim dalam 1 hari kerja.`,
  },
];

export const metadata = {
  title: "Distributor Daihan Labtech Indonesia — AndisLab",
  description:
    "Distributor resmi alat lab Daihan Labtech: inkubator, oven, autoclave, water bath. Ready stock, harga hingga 48% di bawah e-Katalog, dokumen SPJ lengkap.",
  alternates: { canonical: "/daihan-labtech" },
  openGraph: {
    title: "Distributor Daihan Labtech Indonesia — AndisLab",
    description:
      "Distributor resmi alat lab Daihan Labtech: inkubator, oven, autoclave, water bath. Ready stock, harga hingga 48% di bawah e-Katalog, dokumen SPJ lengkap.",
    type: "website",
    siteName: "AndisLab",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Distributor Daihan Labtech Indonesia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Distributor Daihan Labtech Indonesia — AndisLab",
    description:
      "Distributor resmi alat lab Daihan Labtech: inkubator, oven, autoclave, water bath.",
    images: ["/logo.png"],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default async function DaihanLabtechPage() {
  const allProducts = (
    await prisma.product.findMany({
      where: { category: "daihan-labtech" },
      include: { variants: true },
      orderBy: { price: "asc" },
    })
  ).map(serializeProductDecimals);

  const daihanProducts = getGroupedProducts(allProducts).sort(
    (a, b) => Number(a.price) - Number(b.price)
  );

  // Hitung jumlah & harga "mulai dari" tiap kategori dari data live.
  const kategoriStats = kategoriDaihan.map((kat) => {
    const matched = daihanProducts.filter((p) => {
      const hay = `${p.name} ${p.subcategory} ${p.model}`.toLowerCase();
      return kat.keywords.some((k) => hay.includes(k.toLowerCase()));
    });
    const prices = matched
      .map((p) => Number(p.price))
      .filter((n) => Number.isFinite(n) && n > 0);
    return {
      ...kat,
      count: matched.length,
      startFrom: prices.length ? Math.min(...prices) : null,
    };
  });

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero - Scientific Workbench Stage */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-950 via-indigo-950/90 to-slate-950 text-white p-8 sm:p-14 shadow-2xl border border-blue-500/30 text-center">
          <div className="absolute inset-0 -z-0 opacity-20 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-400/40 px-4 py-1.5 text-xs sm:text-sm font-bold text-blue-200 mb-6 shadow-2xs">
              <BadgeCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Distributor Daihan Labtech Indonesia</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight text-white">
              Distributor <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Daihan Labtech</span> Indonesia
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-8 font-medium leading-relaxed">
              AndisLab (PT Andis Sentral Laboratorium) adalah distributor alat laboratorium
              Daihan Labtech di Indonesia dengan harga terverifikasi hingga 48% di bawah harga
              terdaftar di e-Katalog untuk model yang sama. Unit ready stock dengan pengiriman mudah dan cepat
              ke seluruh Indonesia, dengan dokumen lengkap untuk pengadaan instansi (SPJ,
              penawaran resmi, legalitas). Terdaftar di Katalog Elektronik INAPROC:{" "}
              <a
                href={ETALASE_INAPROC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 underline font-bold hover:text-cyan-200"
              >
                katalog.inaproc.id/andis-sentral-laboratorium
              </a>
              .
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <WaLinkCTA
                href={WA_DAFTAR_HARGA}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-sm sm:text-base font-extrabold text-white transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <MessageSquare className="w-5 h-5 shrink-0" />
                <span>Minta Daftar Harga Daihan Lengkap</span>
              </WaLinkCTA>
            </div>
          </div>
        </div>
      </section>

      {/* Bukti Harga — sumber data sama dengan /pemerintah#bukti-harga (EKATALOG_ROWS) */}
      <section id="bukti-harga" className="py-20 bg-white border-b border-slate-100 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Bukti Harga: Perbandingan Model-Persis vs e-Katalog
            </h2>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto">
              Perbandingan model-persis dengan harga terdaftar di e-Katalog (termasuk PPN 12%). Semua unit ready stock.
            </p>
          </div>

          {/* Tabel — desktop */}
          <div className="hidden sm:block overflow-x-auto rounded-3xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full text-left divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50/80 text-sm font-bold text-slate-700">
                  <th className="px-6 py-4">Produk (Model)</th>
                  <th className="px-6 py-4">Harga AndisLab</th>
                  <th className="px-6 py-4">Harga e-Katalog</th>
                  <th className="px-6 py-4 text-emerald-700">Hemat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {EKATALOG_ROWS.map((row) => (
                  <tr key={row.code} className="transition-colors hover:bg-blue-50/40 text-sm">
                    <td className="px-6 py-4.5 font-bold text-slate-800">{row.model}</td>
                    <td className="px-6 py-4.5 font-extrabold text-emerald-700">{row.andislab}</td>
                    <td className="px-6 py-4.5 text-slate-400 line-through font-medium">{row.ekatalog}</td>
                    <td className="px-6 py-4.5">
                      <span className="inline-flex rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-extrabold text-emerald-700 shadow-2xs">
                        -{row.hemat}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Kartu — mobile */}
          <div className="sm:hidden space-y-4">
            {EKATALOG_ROWS.map((row) => (
              <div key={row.code} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition-all hover:border-emerald-300">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="font-bold text-slate-800 text-sm">{row.model}</span>
                  <span className="shrink-0 inline-flex rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-extrabold text-emerald-700">
                    Hemat {row.hemat}%
                  </span>
                </div>
                <dl className="space-y-2 text-sm border-t border-slate-100 pt-3">
                  <div className="flex justify-between items-center">
                    <dt className="text-slate-500 text-xs">Harga AndisLab</dt>
                    <dd className="font-extrabold text-emerald-700 text-base">{row.andislab}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-slate-400 text-xs">Harga e-Katalog</dt>
                    <dd className="text-slate-400 text-xs line-through">{row.ekatalog}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 mt-4 text-center max-w-3xl mx-auto">
            Harga e-Katalog per riset Juli 2026, penyedia terdaftar, termasuk PPN. Minta penawaran resmi untuk harga terkini.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <WaLinkCTA
              href={WA_DAFTAR_HARGA}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-8 py-4 text-base font-bold text-white transition-all hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-700/30 hover:-translate-y-0.5"
            >
              <MessageSquare className="w-5 h-5" />
              Minta Penawaran Resmi — Balasan 1 Hari Kerja
            </WaLinkCTA>
            {ETALASE_INAPROC_URL && (
              <a
                href={ETALASE_INAPROC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 transition-all hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
              >
                Lihat Etalase Kami di e-Katalog
                <ChevronRight className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Kategori Produk Daihan */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              Kategori Produk Daihan Labtech yang Kami Sediakan
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Klik kategori untuk melihat produk dengan harga live di katalog.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kategoriStats.map((kat) => {
              const Icon = kat.icon;
              return (
                <Link
                  key={kat.label}
                  href={`/katalog?q=${encodeURIComponent(kat.q)}`}
                  className="group bg-white p-8 rounded-[2rem] border border-slate-200/80 shadow-xs transition-all duration-300 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center justify-between">
                      <span>{kat.label}</span>
                      <ChevronRight className="w-5 h-5 text-slate-300 transition-transform group-hover:translate-x-1.5 group-hover:text-blue-600 shrink-0" />
                    </h3>
                    <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">{kat.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    {kat.count > 0 ? (
                      <>
                        <span className="inline-flex rounded-full bg-slate-100 group-hover:bg-blue-50 px-3 py-1 text-xs font-extrabold text-slate-700 group-hover:text-blue-700 transition-colors">
                          {kat.count} model live
                        </span>
                        {kat.startFrom && (
                          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                            Mulai {formatRupiah(kat.startFrom)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">Cek ketersediaan</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Kenapa Instansi Membeli Daihan dari AndisLab */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-12 text-center">
            Kenapa Instansi Membeli Daihan dari AndisLab
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                t: "Harga di bawah e-Katalog, terverifikasi model-persis",
                d: "Bukan klaim marketing; tabel di atas bisa dicek langsung ke e-Katalog.",
              },
              {
                t: "Ready stock, bukan indent",
                d: "Unit ready stock siap kirim dengan mudah & cepat ke seluruh Indonesia dalam hitungan hari.",
              },
              {
                t: "Dokumen pengadaan lengkap",
                d: "Penawaran resmi, legalitas perusahaan, dukungan proses INAPROC. Dipercaya Kemenkes, PLN, BRIN, ITB, UI, IPB.",
              },
            ].map((item) => (
              <div key={item.t} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">{item.t}</h3>
                <p className="text-slate-500 font-medium">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ClientLogos />

      {/* Produk Daihan (live) */}
      {daihanProducts.length > 0 && (
        <section className="py-20 bg-slate-50 border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Produk Daihan Labtech</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">Harga live dari katalog kami.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {daihanProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/katalog?q=daihan"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 transition-all hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
              >
                Lihat Semua Produk Daihan Labtech
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-12 text-center">
            Pertanyaan yang Sering Diajukan
          </h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <div key={item.q} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.q}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Penutup */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-10">
            Kirim daftar kebutuhan Daihan Anda — penawaran resmi dalam 1 hari kerja.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <WaLinkCTA
              href={WA_CTA_PENUTUP}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5"
            >
              <MessageSquare className="w-5 h-5" />
              Kirim Daftar Kebutuhan via WhatsApp
            </WaLinkCTA>
          </div>
        </div>
      </section>
    </div>
  );
}
