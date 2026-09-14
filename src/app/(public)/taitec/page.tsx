/* Hallmark · page: Brand Taitec · genre: modern-minimal · macrostructure: Clean Enterprise */
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import { BadgeCheck, MessageSquare, CheckCircle2, RotateCw, Activity, Layers } from "lucide-react";
import { getGroupedProducts, serializeProductDecimals } from "@/lib/products";

export const revalidate = 60;

export const metadata = {
  title: "Distributor Taitec Indonesia — Incubator Shaker & Rotator Lab | AndisLab",
  description:
    "Distributor instrumen laboratorium Taitec (Jepang) di Indonesia: incubator shaker, bio-shaker, test tube rotator, dan mixer presisi tinggi. Bergaransi resmi, dokumen pengadaan lengkap.",
  alternates: { canonical: "/taitec" },
  openGraph: {
    title: "Distributor Taitec Indonesia | AndisLab",
    description:
      "Distributor instrumen laboratorium Taitec (Jepang) di Indonesia: incubator shaker, bio-shaker, test tube rotator, dan mixer presisi tinggi.",
    type: "website",
    siteName: "AndisLab",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Distributor Taitec Indonesia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Distributor Taitec Indonesia | AndisLab",
    description:
      "Distributor instrumen laboratorium Taitec (Jepang) di Indonesia: incubator shaker, bio-shaker, test tube rotator.",
    images: ["/logo.png"],
  },
};

const faqItems = [
  {
    q: "Apakah AndisLab distributor instrumen Taitec di Indonesia?",
    a: "AndisLab mendistribusikan produk Taitec original dari Jepang untuk laboratorium riset, universitas, dan industri di Indonesia dengan garansi resmi dan dukungan teknis.",
  },
  {
    q: "Apa keunggulan instrumen Taitec Jepang?",
    a: "Taitec terkenal di seluruh dunia karena daya tahan mekanis motor yang sangat kuat (heavy-duty brushless motor), operasional hening (*silent drive*), dan stabilitas kontrol suhu termal presisi tinggi untuk kultur sel mikroba jangka panjang.",
  },
  {
    q: "Model Taitec apa saja yang tersedia di AndisLab?",
    a: "Kami menyediakan varian bio-shaker, incubator shaker seri BR-23FH, MBR-032, VBR-104, hingga rotator tabung reaksi seri RT-50N serta aksesoris rak klem erlenmeyer universal.",
  },
  {
    q: "Bagaimana cara pengadaan Taitec untuk universitas atau balai riset?",
    a: "Kami melayani jalur penawaran resmi (Quotation) untuk SPJ, dana hibah penelitian, maupun transaksi pengadaan pemerintah dengan faktur pajak standar PPN 11%.",
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
    label: "Incubator Shaker & Bio-Shaker",
    desc: "Inkubator pengocok presisi untuk kultur bakteri, ragi, dan fermentasi mikrobiologi",
    icon: RotateCw,
    q: "taitec incubator shaker",
  },
  {
    label: "Test Tube Rotator & Mixer",
    desc: "Rotator pemutar tabung reaksi untuk ekstraksi senyawa, homogenisasi darah, dan suspensi",
    icon: Activity,
    q: "taitec rotator",
  },
  {
    label: "Universal Platform & Clamp",
    desc: "Rak klem stainless steel untuk flask Erlenmeyer berbagai ukuran dari 50ml hingga 2000ml",
    icon: Layers,
    q: "taitec",
  },
];

export default async function TaitecPage() {
  let taitecProducts: any[] = [];
  try {
    const raw = await prisma.product.findMany({
      where: {
        OR: [
          { brand: { contains: "Taitec", mode: "insensitive" } },
          { category: "taitec" },
        ],
      },
      include: { variants: true },
      orderBy: { price: "asc" },
    });
    taitecProducts = getGroupedProducts(raw.map(serializeProductDecimals));
  } catch (error) {
    console.error("Failed to fetch Taitec products:", error);
  }

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-950 via-indigo-950/80 to-slate-950 text-white p-8 sm:p-14 shadow-2xl border border-indigo-500/30 text-center">
          <div className="absolute inset-0 -z-0 opacity-20 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/40 px-4 py-1.5 text-xs sm:text-sm font-bold text-indigo-200 mb-6">
              <BadgeCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Distributor Taitec Indonesia</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight text-white">
              Distributor <span className="bg-gradient-to-r from-indigo-400 to-sky-300 bg-clip-text text-transparent">Taitec</span> Indonesia
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-8 font-medium leading-relaxed">
              AndisLab mendistribusikan incubator shaker, bio-shaker, dan rotator laboratorium Taitec original buatan Jepang untuk universitas, riset bioteknologi, dan laboratorium QC di seluruh Indonesia.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <WaLinkCTA
                href="?wa=open&source=seo_taitec&text=Halo%20AndisLab%2C%20saya%20ingin%20penawaran%20alat%20Taitec.%20Kebutuhan%3A%20"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-4 text-sm sm:text-base font-extrabold text-white transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5"
              >
                <MessageSquare className="w-5 h-5 shrink-0" />
                <span>Minta Penawaran Taitec</span>
              </WaLinkCTA>
            </div>
          </div>
        </div>
      </section>

      {/* Kenapa Taitec dari AndisLab */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-12 text-center">
            Keunggulan Instrumen Taitec Jepang
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                t: "Motor Tahan Non-Stop Berhari-Hari",
                d: "Sistem penggerak elektromagnetik tanpa sikat (brushless) Taitec dirancang untuk inkubasi mikroba berkelanjutan hingga ratusan jam tanpa penurunan kecepatan RPM.",
              },
              {
                t: "Presisi Suhu dan Getaran Seimbang",
                d: "Stabilitas termal mikroprosesor PID dengan dinamika shaking seimbang meminimalkan tumpahan media dan menjaga aerasi oksigen terlarut tetap optimal.",
              },
              {
                t: "Garansi & Layanan Purna Jual Resmi",
                d: "Dilengkapi garansi pabrikan resmi Jepang dan dukungan suku cadang seperti sabuk penggerak (*belt*), penjepit flask, dan kalibrasi sensor.",
              },
            ].map((item) => (
              <div key={item.t} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
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
              Lini Produk Taitec
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {kategori.map((kat) => {
              const Icon = kat.icon;
              return (
                <Link
                  key={kat.label}
                  href={`/katalog?q=${encodeURIComponent(kat.q)}`}
                  className="group bg-white p-8 rounded-[2rem] border border-slate-200/80 shadow-xs transition-all duration-300 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 flex flex-col"
                >
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {kat.label}
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed">
                    {kat.desc}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                    <span>Lihat di Katalog</span>
                    <span>&rarr;</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Produk List */}
      <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Daftar Produk Taitec
            </h2>
            <p className="text-slate-500">
              Instrumen pengocok dan inkubasi Taitec Jepang yang tersedia melalui AndisLab.
            </p>
          </div>
          <Link
            href="/katalog?category=taitec"
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Lihat Semua Taitec &rarr;
          </Link>
        </div>

        {taitecProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {taitecProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
            <p>Produk Taitec sedang dalam proses sinkronisasi katalog online.</p>
            <WaLinkCTA
              href="?wa=open&source=taitec_catalog_empty&text=Halo%20AndisLab%2C%20saya%20mencari%20produk%20Taitec."
              className="inline-flex mt-4 items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Tanya Ketersediaan Taitec via WhatsApp
            </WaLinkCTA>
          </div>
        )}
      </section>
    </div>
  );
}
