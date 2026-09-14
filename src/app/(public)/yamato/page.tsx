/* Hallmark · page: Brand Yamato Scientific · genre: modern-minimal · macrostructure: Clean Enterprise */
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import { BadgeCheck, MessageSquare, CheckCircle2, Flame, Thermometer, Sparkles } from "lucide-react";
import { getGroupedProducts, serializeProductDecimals } from "@/lib/products";

export const revalidate = 60;

export const metadata = {
  title: "Distributor Yamato Scientific Indonesia — Oven, Autoclave & Inkubator | AndisLab",
  description:
    "Distributor resmi peralatan laboratorium Yamato Scientific (Jepang) di Indonesia: oven pengering DKN, inkubator IC, autoklaf sterilisasi, dan muffle furnace. Kualitas JIS, garansi resmi.",
  alternates: { canonical: "/yamato" },
  openGraph: {
    title: "Distributor Yamato Scientific Indonesia | AndisLab",
    description:
      "Distributor resmi peralatan laboratorium Yamato Scientific (Jepang) di Indonesia: oven pengering DKN, inkubator IC, autoklaf sterilisasi, dan muffle furnace.",
    type: "website",
    siteName: "AndisLab",
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Distributor Yamato Scientific Indonesia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Distributor Yamato Scientific Indonesia | AndisLab",
    description:
      "Distributor resmi peralatan laboratorium Yamato Scientific (Jepang) di Indonesia: oven pengering DKN, inkubator IC, autoklaf sterilisasi.",
    images: ["/logo.png"],
  },
};

const faqItems = [
  {
    q: "Apakah AndisLab distributor resmi produk Yamato Scientific di Indonesia?",
    a: "AndisLab mendistribusikan instrumen Yamato Scientific original dari Jepang, lengkap dengan dokumen garansi resmi, sertifikat inspeksi pabrik, dan dukungan suku cadang.",
  },
  {
    q: "Apa saja produk unggulan Yamato Scientific?",
    a: "Lini unggulan Yamato mencakup Forced Convection Drying Oven (seri DKN/DX), Natural & Cooled Incubator (seri IC/IN), Autoclave sterilisasi laboratorium, Spray Dryer, dan Muffle Furnace untuk uji kadar abu suhu tinggi.",
  },
  {
    q: "Mengapa laboratorium riset memilih Yamato Scientific Jepang?",
    a: "Yamato mematuhi standar manufaktur Jepang (JIS) yang sangat ketat, memberikan keseragaman termal superior, isolasi panas tebal hemat energi, dan ketahanan mesin hingga belasan tahun pemakaian rutin.",
  },
  {
    q: "Bagaimana alur pemesanan dan pengadaan e-Katalog untuk Yamato?",
    a: "Kami melayani jalur penawaran harga resmi (Quotation) untuk SPJ dan evaluasi HPS, serta transaksi e-Katalog / LPSE untuk instansi riset pemerintah, BUMN, dan universitas.",
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
    label: "Drying Oven & Sterilizer",
    desc: "Oven konveksi paksa seri DKN413C / DKN613C untuk pengeringan presisi dan sterilisasi panas kering",
    icon: Flame,
    q: "yamato oven",
  },
  {
    label: "Laboratory Incubator",
    desc: "Inkubator mikrobiologi presisi tinggi seri IC413C untuk pengujian angka kuman dan kultur sel",
    icon: Thermometer,
    q: "yamato incubator",
  },
  {
    label: "Autoclave & Furnace",
    desc: "Autoklaf uap bertekanan dan tanur pengabuan muffle furnace untuk analisis gravimetri suhu tinggi",
    icon: Sparkles,
    q: "yamato",
  },
];

export default async function YamatoPage() {
  let yamatoProducts: any[] = [];
  try {
    const raw = await prisma.product.findMany({
      where: {
        OR: [
          { brand: { contains: "Yamato", mode: "insensitive" } },
          { category: "yamato" },
        ],
      },
      include: { variants: true },
      orderBy: { price: "asc" },
    });
    yamatoProducts = getGroupedProducts(raw.map(serializeProductDecimals));
  } catch (error) {
    console.error("Failed to fetch Yamato products:", error);
  }

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white p-8 sm:p-14 shadow-2xl border border-rose-500/30 text-center">
          <div className="absolute inset-0 -z-0 opacity-20 bg-[radial-gradient(#fb7185_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-rose-500/15 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 border border-rose-400/40 px-4 py-1.5 text-xs sm:text-sm font-bold text-rose-200 mb-6">
              <BadgeCheck className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Distributor Yamato Scientific Indonesia</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight text-white">
              Distributor <span className="bg-gradient-to-r from-rose-400 to-amber-300 bg-clip-text text-transparent">Yamato Scientific</span> Indonesia
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-8 font-medium leading-relaxed">
              AndisLab menyediakan instrumen oven, inkubator, autoklaf, dan peralatan pemanas laboratorium Yamato Scientific original standar industri Jepang untuk industri farmasi, pangan, dan riset universitas di Indonesia.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <WaLinkCTA
                href="?wa=open&source=seo_yamato&text=Halo%20AndisLab%2C%20saya%20ingin%20penawaran%20alat%20Yamato%20Scientific.%20Kebutuhan%3A%20"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-8 py-4 text-sm sm:text-base font-extrabold text-white transition-all shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/40 hover:-translate-y-0.5"
              >
                <MessageSquare className="w-5 h-5 shrink-0" />
                <span>Minta Penawaran Yamato</span>
              </WaLinkCTA>
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan Yamato dari AndisLab */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-12 text-center">
            Mengapa Memilih Yamato Scientific dari AndisLab
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                t: "Presisi & Kualitas Manufaktur Jepang (JIS)",
                d: "Setiap oven dan inkubator Yamato dibuat dengan standar ketahanan termal tertinggi, akurasi PID mikroprosesor, dan kalibrasi pabrik yang ketat.",
              },
              {
                t: "Keamanan Operasional Multi-Level",
                d: "Dilengkapi sensor proteksi kelebihan panas independen, pemutus arus otomatis saat pintu terbuka, dan alarm malafungsi.",
              },
              {
                t: "Dukungan Administrasi & Sertifikat Resmi",
                d: "Faktur pajak PPN 11%, berkas SPJ pengadaan lengkap, serta opsi kalibrasi ISO 17025 untuk akreditasi KAN laboratorium Anda.",
              },
            ].map((item) => (
              <div key={item.t} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
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
              Lini Produk Yamato Scientific
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {kategori.map((kat) => {
              const Icon = kat.icon;
              return (
                <Link
                  key={kat.label}
                  href={`/katalog?q=${encodeURIComponent(kat.q)}`}
                  className="group bg-white p-8 rounded-[2rem] border border-slate-200/80 shadow-xs transition-all duration-300 hover:border-rose-500 hover:shadow-xl hover:shadow-rose-500/5 hover:-translate-y-1 flex flex-col"
                >
                  <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">
                    {kat.label}
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed">
                    {kat.desc}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 group-hover:text-rose-700">
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
              Daftar Produk Yamato Scientific
            </h2>
            <p className="text-slate-500">
              Peralatan termal laboratorium Yamato Scientific yang tersedia di AndisLab.
            </p>
          </div>
          <Link
            href="/katalog?category=yamato"
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Lihat Semua Yamato &rarr;
          </Link>
        </div>

        {yamatoProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {yamatoProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
            <p>Produk Yamato Scientific sedang dalam proses sinkronisasi katalog online.</p>
            <WaLinkCTA
              href="?wa=open&source=yamato_catalog_empty&text=Halo%20AndisLab%2C%20saya%20mencari%20produk%20Yamato%20Scientific."
              className="inline-flex mt-4 items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
            >
              Tanya Ketersediaan Yamato via WhatsApp
            </WaLinkCTA>
          </div>
        )}
      </section>
    </div>
  );
}
