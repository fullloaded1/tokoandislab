import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import ClientLogos from "@/components/ClientLogos";
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import { 
  ChevronRight, 
  CheckCircle2, 
  FileText, 
  Download, 
  ShoppingCart, 
  MessageSquare,
  Building2
} from "lucide-react";
import { getGroupedProducts, serializeProductDecimals } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pengadaan Lab Pemerintah & B2B — AndisLab",
  description: "Ready Stock & Harga Jelas untuk Pengadaan Lab — Siap PO, Siap SPJ. Temukan kemudahan berbelanja alat lab dengan dokumen lengkap untuk instansi pemerintah.",
};

export default async function PemerintahPage() {
  const allProducts = (await prisma.product.findMany({
    where: {
      isReadyStock: true,
      isRequestPricing: false,
    },
    include: {
      variants: true,
    },
    orderBy: {
      price: "asc",
    },
  })).map(serializeProductDecimals);

  const products = getGroupedProducts(allProducts).sort((a, b) => Number(a.price) - Number(b.price));

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900 z-0"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-400/30 px-4 py-1.5 text-sm font-bold text-blue-200 mb-6">
            <Building2 className="w-4 h-4" /> Khusus Instansi & B2B
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
            Ready Stock & Harga Jelas <br className="hidden sm:block" />
            untuk <span className="text-blue-400">Pengadaan Lab</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
            Siap PO, Siap SPJ. Kami memudahkan PPK dan ULP dalam proses pengadaan alat laboratorium dengan transparansi harga, ketersediaan stok aktual, dan kelengkapan dokumen legal.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/ready-stock"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5"
            >
              <ShoppingCart className="w-5 h-5" />
              Lihat Produk Ready Stock
            </Link>
            <WaLinkCTA 
              href="/?wa=open&source=pemerintah"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/20 hover:-translate-y-0.5"
            >
              <MessageSquare className="w-5 h-5" />
              Konsultasi Pengadaan
            </WaLinkCTA>
          </div>
        </div>
      </section>

      {/* Nilai Jual Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Ready Stock Siap PO</h3>
              <p className="text-slate-500 font-medium">Barang tersedia di gudang kami, siap dikirim segera setelah PO/SPK diterbitkan tanpa waktu tunggu indent yang lama.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Harga Jelas HPS/SPJ</h3>
              <p className="text-slate-500 font-medium">Transparansi harga untuk memudahkan penyusunan HPS. Harga include/exclude PPN dapat disesuaikan pada dokumen penawaran.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Paket Budgeting Lab</h3>
              <p className="text-slate-500 font-medium">Kami bantu menyusun RAB dan kebutuhan alat sesuai standar lab Anda dengan total anggaran yang tersedia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <ClientLogos />

      {/* Produk Siap Pengadaan Section */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Produk Siap Pengadaan</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Kurasi alat laboratorium dengan stok siap dan harga yang dipublikasikan transparan.</p>
          </div>
          
          {products.length === 0 ? (
             <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-3xl text-center">
               <p className="text-slate-500 font-medium">Belum ada produk yang memenuhi kriteria pengadaan saat ini.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link 
              href="/ready-stock"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-700 transition-all hover:border-blue-500 hover:text-blue-600 hover:shadow-md"
            >
              Lihat Seluruh Katalog
            </Link>
          </div>
        </div>
      </section>

      {/* Dokumen Pengadaan & Cara Order */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Cara Order */}
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Cara Order untuk PPK / ULP</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center text-lg">1</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">Minta Penawaran (RFQ)</h4>
                    <p className="text-slate-500 font-medium">Pilih produk dan masukkan ke keranjang RFQ. Lengkapi data instansi Anda di halaman <Link href="/inquiry" className="text-blue-600 hover:underline">Daftar Penawaran</Link>.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center text-lg">2</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">Terima Quotation Resmi</h4>
                    <p className="text-slate-500 font-medium">Tim kami akan menerbitkan dokumen Quotation resmi beserta ketersediaan stok yang mengikat (reserved) dan rincian pajak (PPN).</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center text-lg">3</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">Terbitkan PO / SPK</h4>
                    <p className="text-slate-500 font-medium">Setelah setuju, terbitkan dokumen Purchase Order atau Surat Perintah Kerja. Barang langsung kami proses kirim.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dokumen Legalitas */}
            <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4">Dokumen Pengadaan</h2>
              <p className="text-slate-500 font-medium mb-8">Unduh salinan dokumen legalitas perusahaan kami untuk keperluan administrasi Vendor/Rekanan.</p>
              
              <div className="space-y-4">
                <a href="#" className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-colors group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                    <div>
                      <div className="font-bold text-slate-800">NPWP Perusahaan</div>
                      <div className="text-xs text-slate-500">PDF Document</div>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                </a>
                <a href="#" className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-colors group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                    <div>
                      <div className="font-bold text-slate-800">NIB (Nomor Induk Berusaha)</div>
                      <div className="text-xs text-slate-500">PDF Document</div>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                </a>
                <a href="#" className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-colors group">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
                    <div>
                      <div className="font-bold text-slate-800">Draft / Contoh SPK</div>
                      <div className="text-xs text-slate-500">PDF Document</div>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                </a>
              </div>
            </div>
            
          </div>
        </div>
      </section>

    </div>
  );
}
