/* Hallmark · page: Wilayah Makassar · genre: local-seo · macrostructure: Clean Enterprise */
import ProductCard from "@/components/ProductCard";
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import { ArrowRight, MapPin, Truck, ShieldCheck, FileText } from "lucide-react";
import { prisma } from "@/lib/db";
import { getGroupedProducts, serializeProductDecimals } from "@/lib/products";

export const revalidate = 60;

export const metadata = {
  title: "Distributor Alat Laboratorium Makassar & Sulawesi Selatan | AndisLab",
  description:
    "Distributor alat laboratorium di Makassar dan Sulawesi. Melayani rumah sakit, universitas (Unhas, UNM), balai riset, dan industri pengolahan — packing kayu aman, dokumen lengkap.",
};

export default async function WilayahMakassarPage() {
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

  const geoProducts = getGroupedProducts(allProducts).slice(0, 8);

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-slate-900 pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] mix-blend-overlay"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 border border-blue-500/20 mb-6">
            <MapPin className="h-4 w-4" />
            <span className="tracking-wide uppercase">Layanan Pengiriman Makassar & Indonesia Timur</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6 max-w-4xl mx-auto">
            Distributor Alat Laboratorium Resmi di Makassar & Sulawesi
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            AndisLab melayani pengiriman peralatan laboratorium riset, instrumen analitik, cold storage vaksin, dan glassware untuk rumah sakit, perguruan tinggi, dan industri di Makassar dan seluruh Sulawesi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <WaLinkCTA
              href="?wa=open&source=seo_makassar&text=Halo%20AndisLab%2C%20saya%20dari%20Makassar%2FSulawesi%20ingin%20konsultasi%20alat%20lab."
              className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-8 py-4 text-base font-bold text-white hover:bg-blue-500 transition-colors w-full sm:w-auto shadow-lg shadow-blue-600/30"
            >
              Hubungi Tim Makassar
            </WaLinkCTA>
          </div>
        </div>
      </section>

      {/* Local Value Props */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-700 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Pengiriman Kargo Udara & Laut</h3>
                <p className="text-sm text-slate-600">Packing kayu standar kargo penerbangan dan kapal laut dengan asuransi penuh hingga ke laboratorium Anda di Makassar.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-700 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Garansi Purna Jual Terjamin</h3>
                <p className="text-sm text-slate-600">Didukung teknisi resmi untuk panduan instalasi jarak jauh (*remote commissioning*) dan video training operasional alat.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-50 rounded-lg text-amber-700 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Dukungan Pengadaan e-Katalog</h3>
                <p className="text-sm text-slate-600">Melayani transaksi APBN/APBD dan dana BLU kampus dengan faktur pajak dan berkas SPJ lengkap.</p>
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
              Katalog Produk Populer
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Instrumen pengujian yang banyak digunakan oleh laboratorium klinik, universitas, dan dinas lingkungan di Makassar.
            </p>
          </div>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 rounded-md bg-white border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Lihat Semua Alat
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
