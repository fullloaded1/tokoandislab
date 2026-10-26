/* Hallmark · page: Alternatif Alat Lab · genre: competitor-comparison · macrostructure: Clean Enterprise */
import ProductCard from "@/components/ProductCard";
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Clock, FileText, Scale, Flame, Droplets } from "lucide-react";
import { prisma } from "@/lib/db";
import { getGroupedProducts, serializeProductDecimals } from "@/lib/products";

export const revalidate = 60;

export const metadata = {
  title: "Panduan Alternatif Alat Laboratorium Cerdas: Efisiensi Biaya & Tanpa Indent | AndisLab",
  description:
    "Bandingkan alternatif alat lab berkualitas tinggi (Daihan vs Memmert, Aczet vs Mettler, Lovibond vs Hach). Hemat anggaran belanja modal (CAPEX) hingga 40% dengan unit ready stock dan garansi resmi.",
};

export default async function AlternatifAlatLabPage() {
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
    console.error("Failed to fetch products for alternatives:", error);
  }

  const featuredProducts = getGroupedProducts(allProducts).slice(0, 6);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Apakah merek alternatif seperti Daihan dan Aczet sudah teruji untuk audit akreditasi KAN / ISO 17025?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ya, seluruh instrumen Daihan Labtech (Korea) dan Aczet (Jerman/Swiss sensor) kompatibel penuh dengan kalibrasi laboratorium terakreditasi KAN (Komite Akreditasi Nasional). Sertifikat kalibrasi resmi dapat langsung diterbitkan sebelum pengiriman."
        }
      },
      {
        "@type": "Question",
        "name": "Berapa lama waktu tunggu (lead time) dibandingkan brand Eropa tradisional yang sering indent?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Jika brand impor tertentu membutuhkan indent 8-16 minggu karena kuota pengapalan global, AndisLab menjaga buffer ready stock di Jabodetabek untuk kapasitas populer, siap dikirim dalam 1-3 hari kerja."
        }
      },
      {
        "@type": "Question",
        "name": "Bagaimana ketersediaan suku cadang dan teknisi servis lokal?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AndisLab menyediakan garansi servis dan suku cadang resmi didukung teknisi berpengalaman. Komponen pemanas, sensor PT100, maupun load cell tersedia tanpa harus menunggu importasi part lama."
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
      <section className="bg-slate-900 pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 border border-cyan-500/20 mb-6">
            <Scale className="h-4 w-4" />
            <span className="tracking-wide uppercase">Smart B2B Procurement Strategy</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6 max-w-4xl mx-auto">
            Alternatif Cerdas Pengadaan Alat Lab: Presisi Setara, Hemat Biaya &amp; Tanpa Indent
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
            Hindari proyek tertunda akibat lead-time impor 8–16 minggu atau anggaran CAPEX yang membengkak. Temukan padanan instrumen laboratorium bereputasi global dengan dukungan purnajual resmi di Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <WaLinkCTA
              href="?wa=open&source=solusi_alternatif&text=Halo%20AndisLab%2C%20saya%20ingin%20diskusi%20kebutuhan%20dan%20benchmarking%20alat%20lab%20alternatif."
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-bold text-white shadow-lg hover:bg-emerald-500 transition-all"
            >
              Diskusi Kebutuhan &amp; Benchmarking Alat
            </WaLinkCTA>
            <Link
              href="/inquiry"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-8 py-3.5 text-base font-semibold text-white hover:bg-slate-750 transition-all"
            >
              Minta Surat Penawaran Resmi (RFQ)
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Kecepatan Delivery (Anti-Indent)</h3>
                <p className="text-slate-600 text-sm mt-1">
                  Stok instrumen utama ready di gudang Jabodetabek. Siap kirim dan instalasi dalam hitungan hari, bukan hitungan bulan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Total Cost of Ownership (TCO)</h3>
                <p className="text-slate-600 text-sm mt-1">
                  Biaya investasi awal lebih terukur hingga 30-40% dengan biaya reagen operasional dan suku cadang yang ekonomis.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Lolos Audit KAN / ISO 17025</h3>
                <p className="text-slate-600 text-sm mt-1">
                  Spesifikasi teknis memenuhi standar farmasi, kimia, dan lingkungan dengan dukungan kalibrasi berkala bersertifikat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Modules */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Perbandingan Head-to-Head Kategori Populer
            </h2>
            <p className="text-slate-600 mt-2">
              Analisis objektif faktor performa, ketersediaan, dan biaya operasional jangka panjang bagi pengambil keputusan laboratorium.
            </p>
          </div>

          {/* Module 1: Oven & Incubator */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Flame className="h-6 w-6 text-amber-400" />
                <div>
                  <h3 className="text-lg font-bold">1. Oven &amp; Inkubator Laboratorium</h3>
                  <p className="text-xs text-slate-300">Pemanasan Presisi, Sterilisasi &amp; Pengujian Kadar Air</p>
                </div>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                Heating &amp; Drying
              </span>
            </div>

            <div className="p-6 md:p-8 overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="py-3 px-4 font-bold text-slate-700 w-1/4">Parameter Evaluasi</th>
                    <th className="py-3 px-4 font-bold text-slate-700 w-3/8">Brand Tradisional (Memmert / Binder)</th>
                    <th className="py-3 px-4 font-bold text-blue-700 w-3/8 bg-blue-50/60">Alternatif Solutif: Daihan Labtech</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Lead Time / Ketersediaan</td>
                    <td className="py-3.5 px-4 text-slate-500">Sering kali indent 8–14 minggu untuk ukuran populer</td>
                    <td className="py-3.5 px-4 font-semibold text-blue-900 bg-blue-50/30">Ready stock unit 50L, 105L, 155L di Jabodetabek</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Akurasi &amp; Kontrol Suhu</td>
                    <td className="py-3.5 px-4">Digital PID controller kelas industri Jerman</td>
                    <td className="py-3.5 px-4 font-semibold text-blue-900 bg-blue-50/30">Digital Fuzzy PID mikroprosesor Korea dengan kestabilan ±0.1°C</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Material Chamber</td>
                    <td className="py-3.5 px-4">Stainless Steel tahan korosi</td>
                    <td className="py-3.5 px-4 font-semibold text-blue-900 bg-blue-50/30">Stainless Steel SUS304 berkualitas tinggi dengan isolasi ceramic wool</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Investasi Anggaran (CAPEX)</td>
                    <td className="py-3.5 px-4">Harga premium kurs Euro dengan margin brand tinggi</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-700 bg-blue-50/30">Lebih hemat 25% – 35% dengan spesifikasi ekuivalen</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Dukungan Garansi &amp; Servis</td>
                    <td className="py-3.5 px-4">Suku cadang original harus pesan impor</td>
                    <td className="py-3.5 px-4 font-semibold text-blue-900 bg-blue-50/30">Garansi resmi 1 tahun, teknisi lokal ready Jabodetabek</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-6 p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs sm:text-sm text-blue-900">
                  <strong>Rekomendasi AndisLab:</strong> Daihan LDO Series adalah pilihan paling rasional untuk QC makanan/minuman, farmasi sekunder, dan universitas yang membutuhkan keandalan tinggi tanpa kendala jadwal produksi.
                </p>
                <Link
                  href="/katalog?category=heating-drying"
                  className="shrink-0 text-xs font-bold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1.5"
                >
                  Lihat Katalog Oven Daihan
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Module 2: Analytical Balance */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Scale className="h-6 w-6 text-cyan-400" />
                <div>
                  <h3 className="text-lg font-bold">2. Timbangan Analitik &amp; Presisi</h3>
                  <p className="text-xs text-slate-300">Penimbangan Akurasi 0.1 mg (4 Desimal) &amp; 1 mg</p>
                </div>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30">
                Weighing Instruments
              </span>
            </div>

            <div className="p-6 md:p-8 overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="py-3 px-4 font-bold text-slate-700 w-1/4">Parameter Evaluasi</th>
                    <th className="py-3 px-4 font-bold text-slate-700 w-3/8">Brand Tradisional (Mettler / Sartorius)</th>
                    <th className="py-3 px-4 font-bold text-cyan-700 w-3/8 bg-cyan-50/60">Alternatif Solutif: Aczet</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Teknologi Sensor Penimbangan</td>
                    <td className="py-3.5 px-4">MonoBloc / EMFR sensor kelas atas</td>
                    <td className="py-3.5 px-4 font-semibold text-cyan-900 bg-cyan-50/30">Monolithic EMFR Sensor (High-precision Swiss/German design)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Kalibrasi Internal Otomatis</td>
                    <td className="py-3.5 px-4">Tersedia pada varian level atas dengan biaya tambahan tinggi</td>
                    <td className="py-3.5 px-4 font-semibold text-cyan-900 bg-cyan-50/30">Tersedia internal calibration otomatis berbasis temperatur</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Kesesuaian Audit KAN</td>
                    <td className="py-3.5 px-4">Standar industri global farmasi</td>
                    <td className="py-3.5 px-4 font-semibold text-cyan-900 bg-cyan-50/30">Dapat dikalibrasi KAN LK-001 dengan hasil ketidakpastian memuaskan</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Ketersediaan &amp; Harga Unit</td>
                    <td className="py-3.5 px-4">Rentang harga tinggi (40jt - 90jt+ untuk 0.1mg)</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-700 bg-cyan-50/30">Harga sangat kompetitif (hemat 30-40%) dengan unit ready stock</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-6 p-4 rounded-xl bg-cyan-50/60 border border-cyan-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs sm:text-sm text-cyan-900">
                  <strong>Rekomendasi AndisLab:</strong> Timbangan analitik Aczet CY Series menawarkan rasio performa-harga terbaik di kelasnya dengan sensor monolitik yang stabil terhadap getaran.
                </p>
                <Link
                  href="/aczet"
                  className="shrink-0 text-xs font-bold text-cyan-700 hover:text-cyan-800 inline-flex items-center gap-1.5"
                >
                  Lihat Seri Timbangan Aczet
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Module 3: Water Quality & Photometry */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Droplets className="h-6 w-6 text-blue-400" />
                <div>
                  <h3 className="text-lg font-bold">3. Analisis Air &amp; Fotometer IPAL / WWTP</h3>
                  <p className="text-xs text-slate-300">Pengujian COD, Amonia, Nitrat, Logam Berat &amp; Kekeruhan</p>
                </div>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-500/30">
                Water Analysis
              </span>
            </div>

            <div className="p-6 md:p-8 overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="py-3 px-4 font-bold text-slate-700 w-1/4">Parameter Evaluasi</th>
                    <th className="py-3 px-4 font-bold text-slate-700 w-3/8">Brand Tradisional (Hach)</th>
                    <th className="py-3 px-4 font-bold text-blue-700 w-3/8 bg-blue-50/60">Alternatif Solutif: Lovibond Tintometer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Asal Teknologi</td>
                    <td className="py-3.5 px-4">Amerika Serikat</td>
                    <td className="py-3.5 px-4 font-semibold text-blue-900 bg-blue-50/30">Jerman / UK (Spesialis optik sejak 1885)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Biaya Reagen Operasional</td>
                    <td className="py-3.5 px-4">Format barcode eksklusif, biaya per-test relatif tinggi</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-700 bg-blue-50/30">Format tablet &amp; vial fleksibel, shelf-life 5-10 tahun, biaya per test lebih hemat</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Kemudahan Lapangan &amp; Lab</td>
                    <td className="py-3.5 px-4">Sangat akurat namun perawatan kuvet sensitif</td>
                    <td className="py-3.5 px-4 font-semibold text-blue-900 bg-blue-50/30">Desain IP68 tahan air kuat, filter optik interferensi tinggi</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Kepatuhan Regulasi LHK</td>
                    <td className="py-3.5 px-4">Sesuai Permen LHK No. 68/2016</td>
                    <td className="py-3.5 px-4 font-semibold text-blue-900 bg-blue-50/30">Sesuai standar metode baku SNI &amp; Permen LHK</td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-6 p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs sm:text-sm text-blue-900">
                  <strong>Rekomendasi AndisLab:</strong> Lovibond MD600 / MD200 adalah standar terbaik bagi instalasi pengolahan air limbah industri yang mencari stabilitas hasil uji tanpa terjebak mahalnya biaya reagen bulanan.
                </p>
                <Link
                  href="/lovibond"
                  className="shrink-0 text-xs font-bold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1.5"
                >
                  Lihat Seri Lovibond
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Unit Siap Kirim (Ready Stock)</h2>
                <p className="text-slate-600 text-sm mt-1">
                  Produk alternatif rekomendasi yang dapat dikirim dan diuji dalam 24-48 jam.
                </p>
              </div>
              <Link
                href="/ready-stock"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hidden sm:flex items-center gap-1"
              >
                Lihat Semua Ready Stock <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Banner */}
      <section className="bg-slate-900 py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
            Butuh Telaah Komparasi Spesifikasi untuk Tim Pengadaan Anda?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
            Tim teknis PT Andis Sentral Laboratorium siap membantu menyiapkan dokumen telaah teknis, brosur komparatif, dan surat penawaran harga resmi (RFQ) dalam hitungan jam.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <WaLinkCTA
              href="?wa=open&source=solusi_alternatif_bottom&text=Halo%20AndisLab%2C%20saya%20ingin%20konsultasi%20komparasi%20alat%20lab%20via%20WhatsApp."
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-bold text-white shadow-lg hover:bg-emerald-500 transition-all"
            >
              Konsultasi Komparasi via WhatsApp
            </WaLinkCTA>
            <Link
              href="/inquiry"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-bold text-white hover:bg-blue-500 transition-all"
            >
              Ajukan Penawaran Resmi Sekarang
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
