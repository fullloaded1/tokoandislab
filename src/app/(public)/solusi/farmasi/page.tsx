/* Hallmark · page: Solusi Farmasi · genre: corporate-b2b · macrostructure: Clean Enterprise */
import ProductCard from "@/components/ProductCard";
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import { ArrowRight, Cross, ShieldCheck, CheckCircle, FileText, Settings, FlaskConical } from "lucide-react";
import { prisma } from "@/lib/db";
import { getGroupedProducts, serializeProductDecimals } from "@/lib/products";
import Image from "next/image";

export const revalidate = 60;

export const metadata = {
  title: "Solusi Alat Lab Industri Farmasi & Medis | AndisLab",
  description:
    "Penyedia alat laboratorium standar CPOB/CPKB untuk industri farmasi, kosmetik, dan medis. Dilengkapi dokumen SPJ, instalasi, dan sertifikasi kalibrasi.",
};

export default async function SolusiFarmasiPage() {
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

  // Filter products relevant to farmasi (picking specific categories for demo)
  const pharmaProducts = getGroupedProducts(
    allProducts.filter(p => p.category === "pyrex" || p.category === "daihan-labtech" || p.category === "general-equipment")
  ).slice(0, 8);

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-emerald-950 pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/Banner Promo MERDEKA AndisLab 2026.png" alt="Pharma Background" fill className="object-cover" />
          <div className="absolute inset-0 bg-emerald-950 mix-blend-multiply"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 border border-emerald-500/20 mb-6">
            <FlaskConical className="h-4 w-4" />
            <span className="tracking-wide uppercase">Pharmaceutical & Medical</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            Solusi Peralatan Lab Standar CPOB & CPKB
          </h1>
          <p className="text-lg md:text-xl text-emerald-100/80 max-w-2xl leading-relaxed mb-10">
            Penuhi kepatuhan regulasi industri farmasi, kosmetik, dan kesehatan Anda. Kami menyuplai instrumen analisis, sterilisasi, dan reagen bersertifikat internasional.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <WaLinkCTA 
              href="?wa=open&source=solusi_farmasi&text=Halo%20AndisLab%2C%20saya%20dari%20industri%20farmasi/kesehatan%20ingin%20konsultasi%20pengadaan%20alat%20lab."
              className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-8 py-4 text-base font-bold text-white hover:bg-emerald-500 transition-colors w-full sm:w-auto shadow-lg shadow-emerald-600/30"
            >
              Konsultasi Pengadaan Farmasi
            </WaLinkCTA>
            <Link
              href="#produk"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 text-base font-bold text-white hover:bg-white/20 transition-colors w-full sm:w-auto"
            >
              Lihat Katalog Terkait
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Factors */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Kepatuhan Regulasi</h3>
                <p className="text-sm text-slate-600">Instrumen pendukung standar CPOB, CPKB, dan ISO 17025.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700 shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Jaminan Sterilisasi</h3>
                <p className="text-sm text-slate-600">Menyediakan autoclave dan biosafety cabinet grade medis.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700 shrink-0">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Dukungan Kalibrasi</h3>
                <p className="text-sm text-slate-600">Siap melayani kalibrasi berkala untuk akurasi data uji klinis.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Dokumen Pengadaan</h3>
                <p className="text-sm text-slate-600">Faktur pajak, garansi resmi, dan panduan teknis operasional.</p>
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
              Instrumen untuk Lab Farmasi
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Peralatan presisi untuk tahap riset, quality control bahan baku, hingga pengujian mikrobiologi produk jadi.
            </p>
          </div>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 rounded-md bg-white border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Lihat Semua Katalog Utama
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pharmaProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Corporate Call to Action */}
      <section className="bg-emerald-50 py-16 border-t border-emerald-100">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold text-emerald-950 mb-4">Siap Membangun Lab Farmasi Anda?</h2>
          <p className="text-emerald-800 mb-8">
            Konsultasikan spesifikasi teknis instrumen yang Anda butuhkan. Tim AndisLab siap membantu menyusun daftar kebutuhan dan memberikan penawaran harga terbaik.
          </p>
          <WaLinkCTA 
            href="?wa=open&source=solusi_farmasi_bottom&text=Halo%20AndisLab%2C%20saya%20ingin%20konsultasi%20kebutuhan%20alat%20lab%20farmasi."
            className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-700 px-8 py-3.5 text-sm font-bold text-white hover:bg-emerald-600 transition-colors shadow-md"
          >
            Hubungi Konsultan Kami
          </WaLinkCTA>
        </div>
      </section>
    </main>
  );
}
