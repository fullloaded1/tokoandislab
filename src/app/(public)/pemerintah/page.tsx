/* Hallmark · page: Pemerintah · genre: modern-minimal · macrostructure: Workbench · design-system: design.md */
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import ClientLogos from "@/components/ClientLogos";
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import {
  ChevronRight,
  CheckCircle2,
  FileText,
  ShoppingCart,
  MessageSquare,
  Building2,
  BadgeCheck
} from "lucide-react";
import { getGroupedProducts, serializeProductDecimals } from "@/lib/products";
import { ETALASE_INAPROC_URL } from "@/lib/contact";
import { EKATALOG_ROWS } from "@/lib/ekatalog";

export const dynamic = "force-dynamic";

// Pesan pre-filled WhatsApp untuk halaman pemerintah.
const WA_PENAWARAN = "/?wa=open&source=pemerintah_bukti_harga&text=Halo%20AndisLab%2C%20saya%20ingin%20penawaran%20resmi%20untuk%20pengadaan%20instansi.%20Produk%20yang%20dibutuhkan%3A%20";
const WA_DOKUMEN = "/?wa=open&source=pemerintah_dokumen&text=Halo%20AndisLab%2C%20mohon%20kirim%20paket%20dokumen%20pengadaan%20(company%20profile%2C%20legalitas%2C%20contoh%20penawaran%2C%20daftar%20harga%20Daihan%20vs%20e-Katalog).";

const faqItems = [
  {
    q: "“Harga di vendor lain atau di e-Katalog bisa lebih murah.”",
    a: "Silakan bandingkan. Untuk lini Daihan, harga kami justru di bawah harga e-Katalog untuk model yang sama. Kalau Anda menemukan selisih, beri tahu kami.",
  },
  {
    q: "“Vendor lab sering janji ready stock, ternyata indent.”",
    a: "Status stok di website kami dibedakan jelas: Ready Stock atau PO dengan estimasi lead time. Tidak ada janji kosong.",
  },
  {
    q: "“Prosesnya ribet untuk instansi pemerintah.”",
    a: "Kami terdaftar di e-Katalog/INAPROC dan terbiasa melayani pengadaan pemerintah, RSUD, dan kampus. Tim kami paham alur dan dokumennya, termasuk kelengkapan untuk SPJ.",
  },
];

export const metadata = {
  title: "Pengadaan Alat Lab e-Katalog & INAPROC | AndisLab",
  description: "Terdaftar di INAPROC. Harga Daihan terverifikasi hingga 48% di bawah e-Katalog, model-persis. Dokumen SPJ lengkap. Minta penawaran resmi — balasan 1 hari kerja.",
  alternates: { canonical: "/pemerintah" },
  openGraph: {
    title: "Pengadaan Alat Lab e-Katalog & INAPROC | AndisLab",
    description: "Terdaftar di INAPROC. Harga Daihan terverifikasi hingga 48% di bawah e-Katalog, model-persis. Dokumen SPJ lengkap. Minta penawaran resmi — balasan 1 hari kerja.",
    type: "website",
    siteName: "AndisLab",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Pengadaan Alat Lab Pemerintah AndisLab" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pengadaan Alat Lab e-Katalog & INAPROC | AndisLab",
    description: "Terdaftar di INAPROC. Harga Daihan terverifikasi hingga 48% di bawah e-Katalog, model-persis. Dokumen SPJ lengkap.",
    images: ["/logo.png"],
  },
};

export default async function PemerintahPage() {
  const allProducts = (await prisma.product.findMany({
    where: {
      isReadyStock: true,
      isRequestPricing: false,
    },
    include: {
      variants: true,
    },
    orderBy: {
      price: "asc",
    },
  })).map(serializeProductDecimals);

  const products = getGroupedProducts(allProducts).sort((a, b) => Number(a.price) - Number(b.price));

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900 z-0"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-400/30 px-4 py-1.5 text-sm font-bold text-blue-200 mb-6">
            <Building2 className="w-4 h-4" /> Khusus Instansi & B2B
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
            Ready Stock & Harga Jelas <br className="hidden sm:block" />
            untuk <span className="text-blue-400">Pengadaan Lab</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
            Siap PO, Siap SPJ. Kami memudahkan PPK dan ULP dalam proses pengadaan alat laboratorium dengan transparansi harga, ketersediaan stok aktual, dan kelengkapan dokumen legal.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/ready-stock"
              className="w-full sm:w-auto inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 px-8 py-4 text-base font-black text-white shadow-xl shadow-emerald-600/30 transition-all hover:from-emerald-500 hover:to-teal-600 hover:shadow-2xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Lihat Produk Ready Stock</span>
            </Link>
            <WaLinkCTA 
              href="/?wa=open&source=pemerintah"
              className="w-full sm:w-auto inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 px-8 py-4 text-base font-black text-white shadow-lg transition-all hover:bg-white/20 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span>Konsultasi Pengadaan</span>
            </WaLinkCTA>
          </div>

          {/* Badge INAPROC */}
          <div className="mt-8 flex justify-center">
            <a
              href={ETALASE_INAPROC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-400/40 px-5 py-2.5 text-sm font-bold text-emerald-200 transition-colors hover:bg-emerald-500/25 shadow-sm"
            >
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              <span>Terdaftar di Katalog Elektronik INAPROC</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Bukti Harga: Daihan vs e-Katalog */}
      <section id="bukti-harga" className="py-20 bg-white border-b border-slate-100 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Bukti Harga: Daihan Labtech hingga 48% di Bawah e-Katalog
            </h2>
            <p className="text-lg text-slate-600 font-medium max-w-3xl mx-auto">
              Perbandingan model-persis dengan harga terdaftar di e-Katalog (termasuk PPN 12%). Semua unit ready stock.
            </p>
          </div>

          {/* Tabel — desktop */}
          <div className="hidden sm:block overflow-x-auto rounded-3xl border border-slate-200/80 shadow-lg bg-white">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900 text-sm font-black text-white border-b border-slate-800">
                  <th className="px-6 py-4.5">Produk (Model)</th>
                  <th className="px-6 py-4.5 text-emerald-400">Harga AndisLab</th>
                  <th className="px-6 py-4.5 text-slate-300">Harga e-Katalog</th>
                  <th className="px-6 py-4.5 text-emerald-400">Hemat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {EKATALOG_ROWS.map((row) => (
                  <tr key={row.code} className="text-sm transition-colors hover:bg-emerald-50/50">
                    <td className="px-6 py-4 font-black text-slate-900">{row.model}</td>
                    <td className="px-6 py-4 font-black text-emerald-700 text-base">{row.andislab}</td>
                    <td className="px-6 py-4 font-semibold text-slate-400 line-through">{row.ekatalog}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-black text-emerald-800 shadow-2xs">
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
              <div key={row.code} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-md transition-all hover:shadow-lg hover:border-emerald-400">
                <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
                  <span className="font-black text-slate-900">{row.model}</span>
                  <span className="shrink-0 inline-flex items-center rounded-xl bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-black text-emerald-800 shadow-2xs">
                    -{row.hemat}%
                  </span>
                </div>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <dt className="text-slate-500 font-medium">Harga AndisLab</dt>
                    <dd className="font-black text-emerald-700 text-base">{row.andislab}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-slate-500 font-medium">Harga e-Katalog</dt>
                    <dd className="text-slate-400 font-semibold line-through">{row.ekatalog}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 font-medium mt-4 text-center max-w-3xl mx-auto">
            Harga e-Katalog per riset Juli 2026, penyedia terdaftar, termasuk PPN. Minta penawaran resmi untuk harga terkini.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <WaLinkCTA
              href={WA_PENAWARAN}
              className="w-full sm:w-auto inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 px-8 py-4 text-base font-black text-white transition-all hover:from-emerald-500 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Minta Penawaran Resmi — Balasan 1 Hari Kerja</span>
            </WaLinkCTA>
            {ETALASE_INAPROC_URL && (
              <a
                href={ETALASE_INAPROC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 transition-all hover:border-emerald-500 hover:text-emerald-700 hover:shadow-md active:scale-[0.98]"
              >
                <span>Lihat Etalase Kami di e-Katalog</span>
                <ChevronRight className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Nilai Jual Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">Ready Stock Siap PO</h2>
              <p className="text-slate-500 font-medium">Barang tersedia dan siap dikirim ke seluruh Indonesia segera setelah PO/SPK diterbitkan tanpa waktu tunggu indent yang lama.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">Harga Jelas HPS/SPJ</h2>
              <p className="text-slate-500 font-medium">Transparansi harga untuk memudahkan penyusunan HPS. Harga include/exclude PPN dapat disesuaikan pada dokumen penawaran.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">Paket Budgeting Lab</h2>
              <p className="text-slate-500 font-medium">Kami bantu menyusun RAB dan kebutuhan alat sesuai standar lab Anda dengan total anggaran yang tersedia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <ClientLogos />

      {/* Produk Siap Pengadaan Section */}
      <section id="produk-ready-stock" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Produk Siap Pengadaan</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Kurasi alat laboratorium dengan stok siap dan harga yang dipublikasikan transparan.</p>
          </div>
          
          {products.length === 0 ? (
             <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-3xl text-center">
               <p className="text-slate-500 font-medium">Belum ada produk yang memenuhi kriteria pengadaan saat ini.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link 
              href="/ready-stock"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 transition-all hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
            >
              Lihat Seluruh Katalog
            </Link>
          </div>
        </div>
      </section>

      {/* Keberatan & Jawaban */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-12 text-center">
            Pertanyaan yang Paling Sering Kami Terima
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {faqItems.map((item) => (
              <div key={item.q} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-3">{item.q}</h3>
                <p className="text-slate-500 font-medium">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dokumen Pengadaan & Cara Order */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Cara Order */}
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Cara Order untuk PPK / ULP</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center text-lg">1</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Minta Penawaran (RFQ)</h3>
                    <p className="text-slate-500 font-medium">Pilih produk dan masukkan ke keranjang RFQ. Lengkapi data instansi Anda di halaman <Link href="/inquiry" className="text-blue-600 hover:underline">Daftar Penawaran</Link>.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center text-lg">2</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Terima Quotation Resmi</h3>
                    <p className="text-slate-500 font-medium">Tim kami akan menerbitkan dokumen Quotation resmi beserta ketersediaan stok yang mengikat (reserved) dan rincian pajak (PPN).</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center text-lg">3</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Terbitkan PO / SPK</h3>
                    <p className="text-slate-500 font-medium">Setelah setuju, terbitkan dokumen Purchase Order atau Surat Perintah Kerja. Barang langsung kami proses kirim.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Paket Dokumen Pengadaan via WhatsApp */}
            <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 flex flex-col justify-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <BadgeCheck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4">Butuh Dokumen Pengadaan?</h2>
              <p className="text-slate-500 font-medium mb-8">
                Kirim permintaan via WhatsApp dan tim kami mengirim paket lengkap: company profile, contoh penawaran resmi, dan daftar harga Daihan vs e-Katalog untuk kelengkapan administrasi Vendor/Rekanan.
              </p>
              <WaLinkCTA
                href={WA_DOKUMEN}
                className="w-full inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 text-base font-black text-white transition-all hover:from-emerald-500 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Minta Paket Dokumen Pengadaan via WhatsApp</span>
              </WaLinkCTA>
            </div>

          </div>
        </div>
      </section>

      {/* Risk Reversal + CTA Penutup */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/30 to-transparent pointer-events-none"></div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-lg text-slate-300 font-medium leading-relaxed mb-10">
            Setiap unit kami periksa sebelum kirim. Kalau barang tiba dalam kondisi tidak sesuai penawaran, kami ganti tanpa biaya tambahan. Garansi resmi dari masing-masing prinsipal berlaku penuh.
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-10">
            Anggaran Aman. Barang Datang. SPJ Beres.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <WaLinkCTA
              href="/?wa=open&source=pemerintah_cta_penutup&text=Halo%20AndisLab%2C%20saya%20dari%20%5Binstansi%5D.%20Mohon%20penawaran%20resmi%20untuk%20kebutuhan%20alat%20laboratorium%20berikut%3A"
              className="w-full sm:w-auto inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 px-8 py-4 text-base font-black text-white transition-all hover:from-emerald-500 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Minta Penawaran Sekarang</span>
            </WaLinkCTA>
            <a
              href="#produk-ready-stock"
              className="w-full sm:w-auto inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/25 px-8 py-4 text-base font-black text-white transition-all hover:bg-white/20 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
              <span>Lihat Produk Ready Stock</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
