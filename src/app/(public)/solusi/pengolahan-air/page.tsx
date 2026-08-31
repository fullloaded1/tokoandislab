/* Hallmark · page: Solusi Pengolahan Air · genre: corporate-b2b · macrostructure: Clean Enterprise */
import ProductCard from "@/components/ProductCard";
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import { ArrowRight, Droplets, ShieldCheck, CheckCircle, FileText, Settings } from "lucide-react";
import { prisma } from "@/lib/db";
import { getGroupedProducts, serializeProductDecimals } from "@/lib/products";

export const revalidate = 60;

export const metadata = {
  title: "Alat Laboratorium Air, PDAM & IPAL | AndisLab",
  description:
    "Distributor alat uji kualitas air untuk laboratorium QC PDAM dan IPAL. Solusi pengujian parameter air dengan instrumen Lovibond & Milwaukee ready stock.",
  alternates: { canonical: "/solusi/pengolahan-air" },
};

export default async function SolusiPengolahanAirPage() {
  let allProducts: any[] = [];
  try {
    allProducts = (await prisma.product.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        categoryLabel: true,
        brand: true,
        model: true,
        subcategory: true,
        image: true,
        description: true,
        price: true,
        isReadyStock: true,
        isRequestPricing: true,
        variants: true,
      },
    })).map(serializeProductDecimals);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  // Filter products relevant to water testing (lovibond, milwaukee, some general equipment)
  const waterProducts = getGroupedProducts(
    allProducts.filter(p => p.category === "lovibond" || p.category === "milwaukee" || p.slug.includes("water") || p.slug.includes("air"))
  ).slice(0, 8);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Instrumen pengujian air apa saja yang disediakan AndisLab?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AndisLab menyediakan berbagai instrumen seperti photometer, pH meter, DO meter, turbidity meter, spektrofotometer, hingga reagen untuk uji parameter air minum (PDAM) dan air limbah (IPAL) dari brand seperti Lovibond dan Milwaukee."
        }
      },
      {
        "@type": "Question",
        "name": "Apakah AndisLab menyediakan dukungan kalibrasi untuk instrumen pengujian air?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tentu, teknisi kami siap memberikan dukungan instalasi, kalibrasi awal, dan training operasional untuk alat ukur analitik air yang Anda beli."
        }
      }
    ]
  };

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Hero Section */}
      <section className="relative bg-teal-900 pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-teal-900 mix-blend-multiply"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-4 py-2 text-sm font-semibold text-teal-300 border border-teal-500/20 mb-6">
            <Droplets className="h-4 w-4" />
            <span className="tracking-wide uppercase">Water Quality Solutions</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            Solusi Pengujian Kualitas Air, IPAL & PDAM
          </h1>
          <p className="text-lg md:text-xl text-teal-100 max-w-2xl leading-relaxed mb-10">
            Pastikan kualitas air minum, proses industri, dan limbah memenuhi standar mutu. Kami adalah distributor resmi instrumen analitik presisi tinggi untuk laboratorium uji air Anda.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <WaLinkCTA 
              href="?wa=open&source=solusi_pengolahan_air&text=Halo%20AndisLab%2C%20saya%20butuh%20solusi%20alat%20pengujian%20air/IPAL."
              className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-500 px-8 py-4 text-base font-bold text-white hover:bg-teal-400 transition-colors w-full sm:w-auto shadow-lg shadow-teal-500/30"
            >
              Konsultasi Parameter Uji
            </WaLinkCTA>
            <Link
              href="#produk"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 text-base font-bold text-white hover:bg-white/20 transition-colors w-full sm:w-auto"
            >
              Lihat Katalog Instrumen Air
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Factors */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-50 rounded-lg text-teal-700 shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Akurasi & Presisi</h3>
                <p className="text-sm text-slate-600">Alat ukur parameter kritis sesuai regulasi pemerintah (Permenkes/KLHK).</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-700 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Brand Resmi & Garansi</h3>
                <p className="text-sm text-slate-600">Distributor terotorisasi untuk brand global seperti Lovibond dan Milwaukee.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700 shrink-0">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Instalasi & Kalibrasi</h3>
                <p className="text-sm text-slate-600">Dukungan teknis komprehensif agar instrumen Anda selalu siap pakai.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 rounded-lg text-indigo-700 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Suplai Reagen Rutin</h3>
                <p className="text-sm text-slate-600">Pengadaan reagen berkelanjutan (consumables) untuk kontinuitas uji QC lab.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="produk" className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Instrumen Pengujian Kualitas Air
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Photometer, pH meter portabel & benchtop, turbidity meter, dan reagen untuk berbagai metode pengujian.
            </p>
          </div>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 rounded-md bg-white border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Lihat Semua Alat Uji Air
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {waterProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Corporate Call to Action */}
      <section className="bg-slate-100 py-16 border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Integrasikan Lab IPAL & PDAM Anda Hari Ini</h2>
          <p className="text-slate-600 mb-8">
            Kirimkan daftar parameter pengujian yang dibutuhkan instalasi Anda. Spesialis aplikasi kami akan memberikan rekomendasi alat dan reagen yang paling efisien, lengkap dengan penawaran harga.
          </p>
          <WaLinkCTA 
            href="?wa=open&source=solusi_pengolahan_air_bottom&text=Halo%20AndisLab%2C%20saya%20ingin%20berkonsultasi%20mengenai%20pemilihan%20alat%20lab%20air/PDAM."
            className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-900 px-8 py-3.5 text-sm font-bold text-white hover:bg-teal-800 transition-colors shadow-md"
          >
            Hubungi Spesialis Lab Air
          </WaLinkCTA>
        </div>
      </section>
    </main>
  );
}
