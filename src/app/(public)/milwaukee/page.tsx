/* Hallmark · page: Brand Milwaukee · genre: modern-minimal · macrostructure: Clean Enterprise */
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import { BadgeCheck, MessageSquare, CheckCircle2, ChevronRight, Zap, Waves, Wind } from "lucide-react";
import { getGroupedProducts, serializeProductDecimals } from "@/lib/products";

export const revalidate = 60;

export const metadata = {
  title: "Distributor Milwaukee Instruments Indonesia — pH Meter & Water Quality | AndisLab",
  description:
    "Distributor resmi Milwaukee Instruments di Indonesia: pH meter, conductivity meter, DO meter, TDS meter. Original, bergaransi, cocok untuk PDAM, akuakultur, dan laboratorium.",
  alternates: { canonical: "/milwaukee" },
  openGraph: {
    title: "Distributor Milwaukee Instruments Indonesia | AndisLab",
    description:
      "Distributor resmi Milwaukee Instruments di Indonesia: pH meter, conductivity meter, DO meter, TDS meter. Original dan bergaransi resmi.",
    type: "website",
    siteName: "AndisLab",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Distributor Milwaukee Instruments Indonesia" }],
  },
};

const faqItems = [
  {
    q: "Apakah AndisLab distributor resmi Milwaukee Instruments?",
    a: "AndisLab mendistribusikan alat ukur Milwaukee Instruments original untuk pasar Indonesia, dilengkapi garansi resmi dan dukungan teknis purna jual.",
  },
  {
    q: "Milwaukee cocok untuk industri apa?",
    a: "Milwaukee Instruments banyak digunakan untuk pengujian kualitas air PDAM, tambak udang dan ikan (akuakultur), QC industri minuman dan makanan, laboratorium lingkungan, serta monitoring kolam renang dan SPA.",
  },
  {
    q: "Apakah elektroda pH meter Milwaukee bisa diganti?",
    a: "Ya. Elektroda pH meter Milwaukee (seperti MA911B/2 dan MA90008) dapat diganti secara mandiri. Kami menyediakan elektroda pengganti dan buffer solution kalibrasi.",
  },
  {
    q: "Berapa akurasi pH meter Milwaukee?",
    a: "pH meter Milwaukee seri bench (MA 5740, MA 9016) memiliki akurasi ±0,01 pH, cocok untuk keperluan laboratorium. Seri portable (MW 102, MW 101) memiliki akurasi ±0,1 pH untuk penggunaan lapangan.",
  },
  {
    q: "Bagaimana cara minta penawaran Milwaukee?",
    a: "Kirim nama produk dan jumlah via WhatsApp. Penawaran resmi ber-kop surat dikirim dalam 1 hari kerja, tersedia untuk pengadaan tunggal maupun proyek skala besar.",
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
    label: "pH Meter",
    desc: "pH meter portable MW series dan bench MA series dengan akurasi ±0,01 pH — untuk lab dan lapangan",
    icon: Zap,
    q: "milwaukee ph meter",
  },
  {
    label: "Conductivity & TDS Meter",
    desc: "Pengukuran konduktivitas, TDS, dan salinitas untuk PDAM, akuakultur, dan QC produksi",
    icon: Waves,
    q: "milwaukee conductivity",
  },
  {
    label: "DO & Multi-Parameter",
    desc: "Dissolved oxygen meter dan multi-parameter untuk monitoring kualitas air lengkap",
    icon: Wind,
    q: "milwaukee do meter",
  },
];

export default async function MilwaukeePage() {
  let milwaukeeProducts: any[] = [];
  try {
    const raw = await prisma.product.findMany({
      where: { brand: { contains: "Milwaukee", mode: "insensitive" } },
      include: { variants: true },
      orderBy: { price: "asc" },
    });
    milwaukeeProducts = getGroupedProducts(raw.map(serializeProductDecimals));
  } catch (error) {
    console.error("Failed to fetch Milwaukee products:", error);
  }

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-950 via-emerald-950/80 to-slate-950 text-white p-8 sm:p-14 shadow-2xl border border-emerald-500/30 text-center">
          <div className="absolute inset-0 -z-0 opacity-20 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-4 py-1.5 text-xs sm:text-sm font-bold text-emerald-200 mb-6">
              <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Distributor Milwaukee Instruments Indonesia</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight text-white">
              Distributor <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Milwaukee Instruments</span> Indonesia
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-8 font-medium leading-relaxed">
              AndisLab mendistribusikan pH meter, conductivity meter, DO meter, dan alat ukur kualitas air Milwaukee Instruments original — solusi andal untuk PDAM, akuakultur, laboratorium lingkungan, dan industri minuman di Indonesia.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <WaLinkCTA
                href="?wa=open&source=seo_milwaukee&text=Halo%20AndisLab%2C%20saya%20ingin%20penawaran%20alat%20Milwaukee%20Instruments.%20Kebutuhan%3A%20"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-sm sm:text-base font-extrabold text-white transition-all shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5"
              >
                <MessageSquare className="w-5 h-5 shrink-0" />
                <span>Minta Penawaran Milwaukee</span>
              </WaLinkCTA>
            </div>
          </div>
        </div>
      </section>

      {/* Kenapa Milwaukee dari AndisLab */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-12 text-center">
            Kenapa Pilih Milwaukee Instruments dari AndisLab
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                t: "Akurasi laboratorium, harga terjangkau",
                d: "Milwaukee Instruments menawarkan akurasi setara merek Eropa dengan harga lebih terjangkau — pilihan ideal untuk PDAM dan laboratorium dengan anggaran terbatas.",
              },
              {
                t: "Elektroda & buffer solution tersedia",
                d: "Kami menyediakan elektroda pengganti dan buffer solution kalibrasi asli Milwaukee — tidak perlu impor atau mencari sumber lain.",
              },
              {
                t: "Cocok untuk aplikasi lapangan & lab",
                d: "Seri portable Milwaukee dirancang tahan lembab dan mudah dibawa ke lapangan — cocok untuk sampling PDAM, tambak, dan monitoring IPAL.",
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

      {/* Kategori */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              Jenis Alat Milwaukee yang Kami Sediakan
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {kategori.map((kat) => {
              const Icon = kat.icon;
              return (
                <Link
                  key={kat.label}
                  href={`/katalog?q=${encodeURIComponent(kat.q)}`}
                  className="group bg-white p-8 rounded-[2rem] border border-slate-200/80 shadow-xs transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 flex flex-col"
                >
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center justify-between">
                    <span>{kat.label}</span>
                    <ChevronRight className="w-5 h-5 text-slate-300 transition-transform group-hover:translate-x-1.5 group-hover:text-emerald-600 shrink-0" />
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{kat.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Produk Live */}
      {milwaukeeProducts.length > 0 && (
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Produk Milwaukee di Katalog Kami</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">Harga dan ketersediaan live dari katalog kami.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {milwaukeeProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/katalog?q=milwaukee"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 transition-all hover:border-emerald-500 hover:text-emerald-600 hover:shadow-md"
              >
                Lihat Semua Produk Milwaukee
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
            <Link href="/artikel/panduan-alat-uji-kualitas-air-laboratorium-industri" className="text-emerald-600 font-semibold hover:underline text-sm">
              Baca panduan memilih alat uji kualitas air →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-10">
            Butuh pH meter atau alat Milwaukee? Penawaran resmi 1 hari kerja.
          </h2>
          <WaLinkCTA
            href="?wa=open&source=seo_milwaukee_cta&text=Halo%20AndisLab%2C%20saya%20butuh%20penawaran%20Milwaukee%20Instruments%20untuk%20instansi%20kami.%20Kebutuhan%3A%20"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5"
          >
            <MessageSquare className="w-5 h-5" />
            Kirim Kebutuhan via WhatsApp
          </WaLinkCTA>
        </div>
      </section>
    </div>
  );
}
