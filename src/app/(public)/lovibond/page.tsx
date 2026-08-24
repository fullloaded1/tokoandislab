/* Hallmark · page: Brand Lovibond · genre: modern-minimal · macrostructure: Clean Enterprise */
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import { BadgeCheck, MessageSquare, CheckCircle2, ChevronRight, Droplets, Eye, BarChart3 } from "lucide-react";
import { getGroupedProducts, serializeProductDecimals } from "@/lib/products";

export const revalidate = 60;

export const metadata = {
  title: "Distributor Lovibond Indonesia — Photometer & Alat Uji Air | AndisLab",
  description:
    "Distributor resmi Lovibond di Indonesia: photometer MD series, turbidimeter, visual comparator, dan alat uji kualitas air. Original, bergaransi, dokumen PDAM & industri lengkap.",
  alternates: { canonical: "/lovibond" },
  openGraph: {
    title: "Distributor Lovibond Indonesia | AndisLab",
    description:
      "Distributor resmi Lovibond di Indonesia: photometer MD series, turbidimeter, visual comparator, dan alat uji kualitas air.",
    type: "website",
    siteName: "AndisLab",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Distributor Lovibond Indonesia" }],
  },
};

const faqItems = [
  {
    q: "Apakah AndisLab distributor resmi Lovibond?",
    a: "AndisLab mendistribusikan produk Lovibond original untuk pasar Indonesia, dilengkapi garansi resmi pabrikan dan sertifikat kalibrasi untuk setiap alat ukur.",
  },
  {
    q: "Lovibond cocok untuk pengujian apa saja?",
    a: "Lovibond photometer dan comparator banyak digunakan untuk pengujian kualitas air PDAM, air limbah industri (IPAL), kolam renang, akuakultur, dan QC produksi minuman. Parameter yang umum diuji: klorin, turbiditas, pH, BOD, COD, dan ratusan parameter lainnya.",
  },
  {
    q: "Apakah tersedia reagen dan reagent tablet Lovibond?",
    a: "Ya. Kami menyediakan reagen Lovibond dalam bentuk tablet dan cair untuk berbagai parameter pengujian air. Hubungi tim kami untuk daftar reagen yang tersedia.",
  },
  {
    q: "Apakah bisa pengadaan e-Katalog untuk PDAM atau dinas?",
    a: "Bisa. AndisLab terdaftar di e-Katalog LKPP dan siap melayani pengadaan resmi untuk instansi pemerintah, BUMD, dan PDAM di seluruh Indonesia.",
  },
  {
    q: "Bagaimana cara minta penawaran?",
    a: "Kirim nama alat, parameter yang ingin diuji, dan jumlah unit via WhatsApp. Penawaran resmi dikirim dalam 1 hari kerja.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const kategori = [
  {
    label: "Photometer & Colorimeter",
    desc: "MD 100, MD 200, MD 610 — uji ratusan parameter kualitas air dengan presisi tinggi",
    icon: BarChart3,
    q: "lovibond photometer",
  },
  {
    label: "Turbidimeter",
    desc: "Pengukuran kekeruhan air sesuai standar ISO 7027 — untuk PDAM dan industri air",
    icon: Droplets,
    q: "lovibond turbidimeter",
  },
  {
    label: "Visual Comparator",
    desc: "Comparator disk dan Nesslerizer untuk pengujian kolorimetri cepat di lapangan",
    icon: Eye,
    q: "lovibond comparator",
  },
];

export default async function LovibondPage() {
  let lovibondProducts: any[] = [];
  try {
    const raw = await prisma.product.findMany({
      where: { brand: { contains: "Lovibond", mode: "insensitive" } },
      include: { variants: true },
      orderBy: { price: "asc" },
    });
    lovibondProducts = getGroupedProducts(raw.map(serializeProductDecimals));
  } catch (error) {
    console.error("Failed to fetch Lovibond products:", error);
  }

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-950 via-cyan-950/80 to-slate-950 text-white p-8 sm:p-14 shadow-2xl border border-cyan-500/30 text-center">
          <div className="absolute inset-0 -z-0 opacity-20 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/20 border border-cyan-400/40 px-4 py-1.5 text-xs sm:text-sm font-bold text-cyan-200 mb-6">
              <BadgeCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Distributor Lovibond Indonesia</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight text-white">
              Distributor <span className="bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">Lovibond</span> Indonesia
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-8 font-medium leading-relaxed">
              AndisLab mendistribusikan photometer, turbidimeter, dan alat uji kualitas air Lovibond original untuk PDAM, industri, dan laboratorium lingkungan di seluruh Indonesia — dengan reagen resmi, garansi pabrikan, dan dokumen pengadaan lengkap.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <WaLinkCTA
                href="?wa=open&source=seo_lovibond&text=Halo%20AndisLab%2C%20saya%20ingin%20penawaran%20alat%20Lovibond.%20Kebutuhan%3A%20"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-4 text-sm sm:text-base font-extrabold text-white transition-all shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-0.5"
              >
                <MessageSquare className="w-5 h-5 shrink-0" />
                <span>Minta Penawaran Lovibond</span>
              </WaLinkCTA>
            </div>
          </div>
        </div>
      </section>

      {/* Kenapa Lovibond dari AndisLab */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-12 text-center">
            Kenapa Pilih Lovibond dari AndisLab
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                t: "Merek terpercaya standar internasional",
                d: "Lovibond (Tintometer Group, Jerman) adalah standar industri untuk pengujian warna dan kualitas air — digunakan oleh lebih dari 100 PDAM dan industri di Indonesia.",
              },
              {
                t: "Reagen dan suku cadang tersedia",
                d: "Kami menyediakan tablet reagen, cuvette, dan suku cadang Lovibond asli — tidak perlu impor sendiri atau menunggu lama.",
              },
              {
                t: "Dukungan teknis & kalibrasi",
                d: "Tim teknis kami siap membantu verifikasi alat, penggantian reagen, dan prosedur kalibrasi sesuai standar SNI untuk keperluan akreditasi laboratorium.",
              },
            ].map((item) => (
              <div key={item.t} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">{item.t}</h3>
                <p className="text-slate-500 font-medium">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kategori */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              Produk Lovibond yang Kami Sediakan
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {kategori.map((kat) => {
              const Icon = kat.icon;
              return (
                <Link
                  key={kat.label}
                  href={`/katalog?q=${encodeURIComponent(kat.q)}`}
                  className="group bg-white p-8 rounded-[2rem] border border-slate-200/80 shadow-xs transition-all duration-300 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1 flex flex-col"
                >
                  <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center justify-between">
                    <span>{kat.label}</span>
                    <ChevronRight className="w-5 h-5 text-slate-300 transition-transform group-hover:translate-x-1.5 group-hover:text-cyan-600 shrink-0" />
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{kat.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Produk Live */}
      {lovibondProducts.length > 0 && (
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Produk Lovibond di Katalog Kami</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">Harga dan ketersediaan live dari katalog kami.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {lovibondProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/katalog?q=lovibond"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 transition-all hover:border-cyan-500 hover:text-cyan-600 hover:shadow-md"
              >
                Lihat Semua Produk Lovibond
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-12 text-center">
            Pertanyaan yang Sering Diajukan
          </h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <div key={item.q} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.q}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/artikel/panduan-alat-uji-kualitas-air-laboratorium-industri" className="text-cyan-600 font-semibold hover:underline text-sm">
              Baca panduan memilih alat uji kualitas air →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-10">
            Butuh alat Lovibond? Penawaran resmi dalam 1 hari kerja.
          </h2>
          <WaLinkCTA
            href="?wa=open&source=seo_lovibond_cta&text=Halo%20AndisLab%2C%20saya%20butuh%20penawaran%20Lovibond%20untuk%20instansi%20kami.%20Kebutuhan%3A%20"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-600/30 hover:-translate-y-0.5"
          >
            <MessageSquare className="w-5 h-5" />
            Kirim Kebutuhan via WhatsApp
          </WaLinkCTA>
        </div>
      </section>
    </div>
  );
}
