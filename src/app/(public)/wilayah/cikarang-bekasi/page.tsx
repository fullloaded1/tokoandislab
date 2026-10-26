/* Hallmark · page: Wilayah Cikarang Bekasi · genre: local-seo · macrostructure: Clean Enterprise */
import ProductCard from "@/components/ProductCard";
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import { ArrowRight, MapPin, Truck, ShieldCheck, FileText } from "lucide-react";
import { prisma } from "@/lib/db";
import { getGroupedProducts, serializeProductDecimals } from "@/lib/products";

export const revalidate = 60;

export const metadata = {
  title: "Distributor Alat Lab Cikarang & Kawasan Industri Bekasi | AndisLab",
  description:
    "Distributor resmi alat laboratorium dan instrumen QC untuk kawasan industri Jababeka, EJIP, MM2100, Delta Silicon di Cikarang dan Bekasi. Ready stock & dokumen SPJ lengkap.",
};

export default async function WilayahCikarangPage() {
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
    console.error("Failed to fetch products for Cikarang:", error);
  }

  const geoProducts = getGroupedProducts(allProducts).slice(0, 8);

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-slate-900 pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 border border-blue-500/20 mb-6">
            <MapPin className="h-4 w-4" />
            <span className="tracking-wide uppercase">Layanan Cepat Cikarang &amp; Bekasi</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6 max-w-4xl mx-auto">
            Distributor Alat Laboratorium &amp; QC Industri di Kawasan Cikarang &amp; Bekasi
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            Mendukung kelancaran uji mutu pabrik di Kawasan Industri Jababeka, EJIP, MM2100, GIIC, dan Delta Silicon dengan instrumen analitik ready stock (anti-indent) dan garansi distributor resmi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <WaLinkCTA 
              href="?wa=open&source=seo_cikarang&text=Halo%20AndisLab%2C%20saya%20dari%20kawasan%20industri%20Cikarang/Bekasi%20ingin%20konsultasi%20pengadaan%20alat%20lab."
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white hover:bg-blue-500 transition-colors w-full sm:w-auto shadow-lg shadow-blue-600/30"
            >
              Konsultasi Pengadaan Cikarang
            </WaLinkCTA>
          </div>
        </div>
      </section>

      {/* Local Value Props */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-700 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Pengiriman Cepat Koridor Cibinong - Cikarang</h3>
                <p className="text-sm text-slate-600">Akses langsung via tol lingkar luar, pengiriman instrumen ready stock 24–48 jam kerja.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Dukungan Kalibrasi &amp; Commissioning</h3>
                <p className="text-sm text-slate-600">Teknisi bersertifikasi siap on-site untuk instalasi, training operator, dan sertifikasi KAN.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-700 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Faktur Pajak Elektronik &amp; PO Resmi</h3>
                <p className="text-sm text-slate-600">Kepatuhan legalitas PT, kelengkapan berkas audit, dan surat dukungan penawaran resmi ber-PPN.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="produk" className="py-16 sm:py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Instrumen Lab Populer untuk Kawasan Industri Cikarang
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Peralatan uji kualitas, oven sterilisasi, timbangan presisi, dan analisis kualitas air yang paling banyak digunakan di lab manufaktur Bekasi.
            </p>
          </div>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
          >
            Lihat Semua Produk
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {geoProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
