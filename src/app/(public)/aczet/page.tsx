/* Hallmark · page: Brand Aczet · genre: modern-minimal · macrostructure: Clean Enterprise */
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import { BadgeCheck, MessageSquare, CheckCircle2, ChevronRight, Scale, Activity, Layers } from "lucide-react";
import { getGroupedProducts, serializeProductDecimals } from "@/lib/products";

export const revalidate = 60;

export const metadata = {
  title: "Distributor Timbangan Aczet Indonesia — Analytical & Precision Balance | AndisLab",
  description:
    "Distributor resmi timbangan Aczet di Indonesia: analytical balance 0,1 mg, precision balance, moisture analyzer. Garansi resmi, sertifikat kalibrasi, pengiriman ke seluruh Indonesia.",
  alternates: { canonical: "/aczet" },
  openGraph: {
    title: "Distributor Timbangan Aczet Indonesia | AndisLab",
    description:
      "Distributor resmi timbangan Aczet di Indonesia: analytical balance 0,1 mg, precision balance, moisture analyzer. Garansi resmi, sertifikat kalibrasi.",
    type: "website",
    siteName: "AndisLab",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Distributor Aczet Indonesia" }],
  },
};

const faqItems = [
  {
    q: "Apakah AndisLab distributor resmi timbangan Aczet?",
    a: "AndisLab mendistribusikan timbangan Aczet original untuk pasar Indonesia, dilengkapi garansi resmi dan sertifikat kalibrasi untuk setiap unit.",
  },
  {
    q: "Aczet cocok untuk lab apa saja?",
    a: "Timbangan analitik Aczet banyak digunakan di laboratorium farmasi (GMP/CPOB), riset universitas, laboratorium QC industri, dan pengujian lingkungan. Seri CY cocok untuk resolusi 0,1 mg.",
  },
  {
    q: "Apakah tersedia sertifikat kalibrasi?",
    a: "Ya. Setiap unit Aczet yang kami kirimkan dilengkapi sertifikat kalibrasi pabrik. Kami juga dapat memfasilitasi kalibrasi berkala oleh laboratorium kalibrasi terakreditasi KAN.",
  },
  {
    q: "Berapa lama pengiriman dan apakah ada garansi?",
    a: "Unit ready stock dikirim dalam 1–3 hari kerja ke seluruh Indonesia. Garansi resmi sesuai ketentuan pabrikan, dengan dukungan purna jual dari tim teknis AndisLab.",
  },
  {
    q: "Bagaimana cara minta penawaran?",
    a: "Kirim nama produk, model, dan jumlah via WhatsApp. Penawaran resmi ber-kop surat dikirim dalam 1 hari kerja, lengkap dengan faktur pajak untuk kebutuhan SPJ.",
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
    label: "Analytical Balance",
    desc: "Resolusi 0,1 mg dan 0,01 mg — untuk farmasi, reagen, dan riset",
    icon: Scale,
    q: "analytical balance",
  },
  {
    label: "Precision Balance",
    desc: "Kapasitas hingga 30 kg dengan resolusi 0,001 g — untuk QC umum",
    icon: Activity,
    q: "precision balance aczet",
  },
  {
    label: "Moisture Analyzer",
    desc: "Pengukuran kadar air sampel padat & semi-padat secara otomatis",
    icon: Layers,
    q: "moisture analyzer aczet",
  },
];

export default async function AczetPage() {
  let aczetProducts: any[] = [];
  try {
    const raw = await prisma.product.findMany({
      where: { brand: { contains: "Aczet", mode: "insensitive" } },
      include: { variants: true },
      orderBy: { price: "asc" },
    });
    aczetProducts = getGroupedProducts(raw.map(serializeProductDecimals));
  } catch (error) {
    console.error("Failed to fetch Aczet products:", error);
  }

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-950 via-indigo-950/90 to-slate-950 text-white p-8 sm:p-14 shadow-2xl border border-blue-500/30 text-center">
          <div className="absolute inset-0 -z-0 opacity-20 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-400/40 px-4 py-1.5 text-xs sm:text-sm font-bold text-blue-200 mb-6">
              <BadgeCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Distributor Aczet Indonesia</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight text-white">
              Distributor <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Timbangan Aczet</span> Indonesia
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-8 font-medium leading-relaxed">
              AndisLab mendistribusikan timbangan analitik dan presisi Aczet original untuk laboratorium farmasi, riset, dan industri di seluruh Indonesia — dilengkapi sertifikat kalibrasi, garansi resmi, dan dokumen pengadaan lengkap.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <WaLinkCTA
                href="?wa=open&source=seo_aczet&text=Halo%20AndisLab%2C%20saya%20ingin%20penawaran%20timbangan%20Aczet.%20Kebutuhan%3A%20"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-sm sm:text-base font-extrabold text-white transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                <MessageSquare className="w-5 h-5 shrink-0" />
                <span>Minta Penawaran Aczet</span>
              </WaLinkCTA>
            </div>
          </div>
        </div>
      </section>

      {/* Kenapa Aczet */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-12 text-center">
            Kenapa Pilih Timbangan Aczet dari AndisLab
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                t: "Resolusi tinggi, harga kompetitif",
                d: "Timbangan analitik Aczet seri CY menawarkan resolusi 0,1 mg dengan harga lebih terjangkau dibanding merek Eropa — ideal untuk lab farmasi dan riset dengan anggaran terbatas.",
              },
              {
                t: "Sertifikat kalibrasi tersedia",
                d: "Setiap unit disertai sertifikat kalibrasi pabrik. AndisLab juga memfasilitasi kalibrasi berkala oleh lab terakreditasi KAN untuk keperluan ISO 17025.",
              },
              {
                t: "Dokumen pengadaan lengkap",
                d: "Faktur pajak PPN, penawaran resmi ber-kop, surat jalan, dan dokumen legalitas PT tersedia untuk keperluan SPJ instansi dan audit internal.",
              },
            ].map((item) => (
              <div key={item.t} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
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
              Jenis Timbangan Aczet yang Kami Sediakan
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {kategori.map((kat) => {
              const Icon = kat.icon;
              return (
                <Link
                  key={kat.label}
                  href={`/katalog?q=${encodeURIComponent(kat.q)}`}
                  className="group bg-white p-8 rounded-[2rem] border border-slate-200/80 shadow-xs transition-all duration-300 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 flex flex-col"
                >
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center justify-between">
                    <span>{kat.label}</span>
                    <ChevronRight className="w-5 h-5 text-slate-300 transition-transform group-hover:translate-x-1.5 group-hover:text-blue-600 shrink-0" />
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{kat.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Produk Live */}
      {aczetProducts.length > 0 && (
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Produk Aczet di Katalog Kami</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">Harga dan ketersediaan live dari katalog kami.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {aczetProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/katalog?q=aczet"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 transition-all hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
              >
                Lihat Semua Produk Aczet
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
            <Link href="/artikel/panduan-timbangan-analitik-laboratorium" className="text-blue-600 font-semibold hover:underline text-sm">
              Baca panduan memilih timbangan analitik →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Penutup */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-10">
            Butuh timbangan Aczet? Penawaran resmi dalam 1 hari kerja.
          </h2>
          <WaLinkCTA
            href="?wa=open&source=seo_aczet_cta&text=Halo%20AndisLab%2C%20saya%20butuh%20penawaran%20timbangan%20Aczet%20untuk%20instansi%20kami.%20Kebutuhan%3A%20"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5"
          >
            <MessageSquare className="w-5 h-5" />
            Kirim Kebutuhan via WhatsApp
          </WaLinkCTA>
        </div>
      </section>
    </div>
  );
}
