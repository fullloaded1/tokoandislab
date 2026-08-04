/* Hallmark · page: Solusi Manufaktur · genre: corporate-b2b · macrostructure: Clean Enterprise */
import ProductCard from "@/components/ProductCard";
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import { ArrowRight, Factory, ShieldCheck, CheckCircle, FileText, Settings, FlaskConical } from "lucide-react";
import { prisma } from "@/lib/db";
import { getGroupedProducts, serializeProductDecimals } from "@/lib/products";
import Image from "next/image";

export const revalidate = 60;

export const metadata = {
  title: "Solusi Alat Lab QC Pabrik & Manufaktur | AndisLab",
  description:
    "Distributor alat laboratorium Quality Control (QC) & R&D untuk pabrik dan industri manufaktur. Tersedia dokumen SPJ lengkap, harga e-Katalog, dan instalasi alat.",
};

export default async function SolusiManufakturPage() {
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

  // Filter products relevant to manufacturing (just pick ready stock & daihan for demo)
  const factoryProducts = getGroupedProducts(
    allProducts.filter(p => p.category === "daihan-labtech" || p.category === "lovibond" || p.category === "general-equipment")
  ).slice(0, 8);

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-slate-900 pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/Banner Promo MERDEKA AndisLab 2026.png" alt="Industrial Background" fill className="object-cover" />
          <div className="absolute inset-0 bg-slate-900 mix-blend-multiply"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 border border-blue-500/20 mb-6">
            <Factory className="h-4 w-4" />
            <span className="tracking-wide uppercase">Industrial Solutions</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            Solusi Instrumen Quality Control untuk Pabrik Berstandar ISO
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed mb-10">
            Tingkatkan efisiensi dan akurasi lab QC industri Anda. AndisLab menyediakan alat presisi tinggi dengan dokumen SPJ lengkap, garansi resmi, dan teknisi bersertifikat.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <WaLinkCTA 
              href="?wa=open&source=solusi_manufaktur&text=Halo%20AndisLab%2C%20saya%20dari%20pabrik/industri%20ingin%20konsultasi%20pengadaan%20alat%20QC."
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-8 py-4 text-base font-bold text-white hover:bg-blue-500 transition-colors w-full sm:w-auto shadow-lg shadow-blue-600/30"
            >
              Konsultasi Pengadaan Pabrik
            </WaLinkCTA>
            <Link
              href="#produk"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 text-base font-bold text-white hover:bg-white/20 transition-colors w-full sm:w-auto"
            >
              Lihat Alat Terkait
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
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Garansi Pabrik Resmi</h3>
                <p className="text-sm text-slate-600">Surat penunjukan principal & layanan purna jual terjamin.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Dokumen B2B Lengkap</h3>
                <p className="text-sm text-slate-600">Faktur pajak, BAST, dan kebutuhan administrasi korporat.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 rounded-lg text-indigo-700 shrink-0">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Instalasi & Kalibrasi</h3>
                <p className="text-sm text-slate-600">Tim teknisi bersertifikat untuk instalasi alat berat & presisi.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 rounded-lg text-amber-700 shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Tersedia di e-Katalog</h3>
                <p className="text-sm text-slate-600">Transparansi harga sesuai sistem LKPP & mudah diaudit.</p>
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
              Instrumen Lab untuk Pabrik & QC
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Koleksi alat ukur, preparasi, dan analisa material dengan durabilitas tinggi untuk lingkungan industri dan manufaktur.
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
          {factoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Corporate Call to Action */}
      <section className="bg-slate-100 py-16 border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Butuh Penawaran Skala Besar (Tender)?</h2>
          <p className="text-slate-600 mb-8">
            Kirimkan Bill of Quantities (BoQ) pabrik Anda. Tim analis kami akan merumuskan spesifikasi instrumen yang tepat dan menyusun surat penawaran harga resmi (Quotation) dalam 1x24 jam.
          </p>
          <WaLinkCTA 
            href="?wa=open&source=solusi_manufaktur_bottom&text=Halo%20AndisLab%2C%20saya%20ingin%20mengirimkan%20daftar%20kebutuhan%20alat%20lab%20untuk%20pabrik."
            className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-8 py-3.5 text-sm font-bold text-white hover:bg-slate-800 transition-colors shadow-md"
          >
            Minta Penawaran Resmi Sekarang
          </WaLinkCTA>
        </div>
      </section>
    </main>
  );
}
