/* Hallmark · page: Solusi Pendidikan · genre: corporate-b2b · macrostructure: Clean Enterprise */
import ProductCard from "@/components/ProductCard";
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import { ArrowRight, BookOpen, ShieldCheck, CheckCircle, FileText, Settings, GraduationCap } from "lucide-react";
import { prisma } from "@/lib/db";
import { getGroupedProducts, serializeProductDecimals } from "@/lib/products";
import Image from "next/image";

export const revalidate = 60;

export const metadata = {
  title: "Alat Laboratorium Pendidikan, Kampus & Sekolah | AndisLab",
  description:
    "Distributor alat laboratorium pendidikan untuk universitas, sekolah vokasi, dan puskesmas. Alat dasar lab, mikroskop, glassware Pyrex lengkap dengan SPJ e-Katalog.",
  alternates: { canonical: "/solusi/pendidikan" },
};

export default async function SolusiPendidikanPage() {
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

  // Filter products relevant to education (mikroskop, timbangan, glassware, alat dasar)
  const educationProducts = getGroupedProducts(
    allProducts.filter(p => p.category === "general-equipment" || p.category === "pyrex" || p.category === "aczet" || p.category === "labex")
  ).slice(0, 8);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Apakah AndisLab bisa melayani pembelian dengan dana BOS atau hibah penelitian?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ya, kami terbiasa melayani pengadaan instansi pendidikan menggunakan dana BOS, LPDP, maupun hibah penelitian kampus dengan kelengkapan dokumen SPJ penuh (faktur pajak, BAST, invoice resmi)."
        }
      },
      {
        "@type": "Question",
        "name": "Apakah pembelian untuk universitas bisa melalui e-Katalog?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sangat bisa. AndisLab terdaftar di e-Katalog LKPP/INAPROC untuk memudahkan universitas negeri maupun swasta dalam melakukan pengadaan secara transparan."
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
      <section className="relative bg-slate-900 pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-slate-900 mix-blend-multiply"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 border border-blue-500/20 mb-6">
            <GraduationCap className="h-4 w-4" />
            <span className="tracking-wide uppercase">Educational Solutions</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            Solusi Pengadaan Alat Laboratorium untuk Edukasi & Riset
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed mb-10">
            Dukung kegiatan praktikum dan penelitian dengan instrumen presisi. Kami melayani universitas, politeknik, sekolah vokasi, dan fasilitas riset terpadu dengan dokumen pengadaan (SPJ) yang lengkap dan terstandarisasi.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <WaLinkCTA 
              href="?wa=open&source=solusi_pendidikan&text=Halo%20AndisLab%2C%20saya%20dari%20institusi%20pendidikan/kampus%20ingin%20konsultasi%20pengadaan%20alat%20lab."
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-8 py-4 text-base font-bold text-white hover:bg-blue-500 transition-colors w-full sm:w-auto shadow-lg shadow-blue-600/30"
            >
              Konsultasi Pengadaan Kampus
            </WaLinkCTA>
            <Link
              href="#produk"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 text-base font-bold text-white hover:bg-white/20 transition-colors w-full sm:w-auto"
            >
              Lihat Kebutuhan Dasar Lab
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Factors */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-700 shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Terdaftar e-Katalog LKPP</h3>
                <p className="text-sm text-slate-600">Proses e-purchasing mudah dan transparan untuk kampus negeri maupun swasta.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Dokumen SPJ Hibah/BOS</h3>
                <p className="text-sm text-slate-600">Faktur pajak, BAST, invoice resmi untuk pencairan dana hibah penelitian.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 rounded-lg text-indigo-700 shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Peralatan Dasar Lab</h3>
                <p className="text-sm text-slate-600">Mikroskop edukasi, timbangan, water bath, hingga glassware borosilikat (Pyrex).</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 rounded-lg text-amber-700 shrink-0">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Training Penggunaan</h3>
                <p className="text-sm text-slate-600">Sesi training operasional alat untuk laboran dan asisten praktikum.</p>
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
              Instrumen untuk Praktikum & Riset Dasar
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Koleksi alat ukur, mikroskop, dan glassware esensial dengan durabilitas tinggi untuk intensitas penggunaan mahasiswa tinggi.
            </p>
          </div>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 rounded-md bg-white border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Lihat Semua Alat Edukasi
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {educationProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Corporate Call to Action */}
      <section className="bg-slate-100 py-16 border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Butuh Penawaran Pengadaan Alat Praktikum (Tender)?</h2>
          <p className="text-slate-600 mb-8">
            Kirimkan daftar kebutuhan alat (BoQ) untuk laboratorium fakultas Anda. Tim analis kami akan merumuskan spesifikasi instrumen yang tepat dan menyusun surat penawaran harga resmi (Quotation) sesuai pagu anggaran.
          </p>
          <WaLinkCTA 
            href="?wa=open&source=solusi_pendidikan_bottom&text=Halo%20AndisLab%2C%20saya%20ingin%20mengirimkan%20daftar%20kebutuhan%20alat%20lab%20untuk%20kampus/sekolah."
            className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-8 py-3.5 text-sm font-bold text-white hover:bg-slate-800 transition-colors shadow-md"
          >
            Minta Penawaran Resmi Sekarang
          </WaLinkCTA>
        </div>
      </section>
    </main>
  );
}
