/* Hallmark · page: Paket Pengadaan Alat Lab · genre: turnkey-offers · macrostructure: Clean Enterprise */
import WaLinkCTA from "@/components/WaLinkCTA";
import Link from "next/link";
import { Check, ShieldCheck, ArrowRight, Package, Sparkles, Building2, Droplets, GraduationCap, Award } from "lucide-react";

export const metadata = {
  title: "Paket Pengadaan Alat Lab Turnkey: Bebas Ribet, Free Kalibrasi & SPJ Lengkap | AndisLab",
  description:
    "Solusi bundling alat laboratorium turnkey untuk industri farmasi, IPAL/WWTP lingkungan, dan kampus riset. Sudah termasuk free kalibrasi KAN, garansi 12 bulan, dan kelengkapan dokumen pengadaan resmi.",
};

export default function PaketPengadaanPage() {
  const bundles = [
    {
      id: "qc-farmasi-fnb",
      name: "Paket QC Farmasi, Kosmetik & F&B",
      badge: "Paling Populer untuk Pabrik",
      icon: Building2,
      accentColor: "blue",
      target: "Kebutuhan Rilis Batch CPOB / CPOTB / ISO 22000 / Halal",
      description: "Bundling esensial untuk pengujian kadar air, penimbangan bahan baku mikrogram, dan kontrol keasaman formulasi.",
      items: [
        "Oven Pengering Presisi Daihan Labtech (Kapasitas 50L / 105L, digital PID)",
        "Timbangan Analitik 4 Desimal Aczet CY Series (Akurasi 0.0001 g, sensor monolitik)",
        "Benchtop pH / mV / Temp Meter Milwaukee (Resolusi 0.01 pH + elektroda kaca)",
        "Protokol Dokumen Kualifikasi IQ / OQ siap audit BPOM / KAN",
      ],
      bonuses: [
        "Free Sertifikat Kalibrasi Perdana KAN (Hemat Rp 3.000.000+)",
        "Free Onsite Delivery & Commissioning area Jabodetabek / Banten",
        "Garansi Resmi Distributor 12 Bulan (Sparepart & Jasa Servis)",
      ],
      waMessage: "Halo Admin AndisLab, saya ingin meminta surat penawaran resmi (RFQ) untuk Paket QC Farmasi, Kosmetik & F&B.",
    },
    {
      id: "ipal-lingkungan-wwtp",
      name: "Paket Pemantauan IPAL & Air Limbah (WWTP)",
      badge: "Sesuai Regulasi KLHK",
      icon: Droplets,
      accentColor: "emerald",
      target: "Kepatuhan Permen LHK No. 68/2016 & Baku Mutu Air Industri",
      description: "Instrumen terpadu untuk monitoring harian COD, BOD, DO, dan logam berat tanpa kendala biaya reagen operasional.",
      items: [
        "Multi-parameter Water Photometer Lovibond Tintometer MD Series (Jerman)",
        "BOD Incubator Low-Temperature Daihan Labtech (Suhu presisi 20°C)",
        "Waterproof Dissolved Oxygen (DO) & BOD Portable Meter Milwaukee",
        "Starter Kit Reagent COD & Amonia Lovibond (Shelf-life s/d 5 tahun)",
      ],
      bonuses: [
        "Free Sertifikat Kalibrasi Pabrikan & Kalibrasi Suhu Incubator",
        "Free Pelatihan Pengoperasian & Standarisasi Metode Uji",
        "Garansi Resmi Unit 12 Bulan + Akses Fast-track Reagen Pengganti",
      ],
      waMessage: "Halo Admin AndisLab, saya ingin meminta surat penawaran resmi (RFQ) untuk Paket Pemantauan IPAL & Air Limbah (WWTP).",
    },
    {
      id: "kampus-riset-praktikum",
      name: "Paket Laboratorium Kampus & Riset Dasar",
      badge: "Ekonomis & Tahan Lama",
      icon: GraduationCap,
      accentColor: "indigo",
      target: "Praktikum Mahasiswa, Lab Kimia Sekolah, & Hibah Penelitian",
      description: "Paket peremajaan alat praktikum sains dengan material borosilikat tinggi dan instrumen tahan pemakaian intensif.",
      items: [
        "Digital Hotplate Magnetic Stirrer Daihan (Plate keramik anti-asam kuat)",
        "Set Mikropipet Ergonomis Akurasi Tinggi (Volume 0.5-10uL, 20-200uL, 100-1000uL)",
        "Paket Gelas Laboratorium Borosilikat Pyrex Starter Pack (Beaker, Erlenmeyer, Labu Ukur)",
        "Autoclave Portabel / Benchtop Sterilizer Labtech",
      ],
      bonuses: [
        "Free Pipette Stand Carousel & Rak Tabung Stainless Steel",
        "Dokumen Lengkap untuk SPJ LPPM / Pengadaan Hibah Kemendikbud",
        "Garansi Distributor 12 Bulan",
      ],
      waMessage: "Halo Admin AndisLab, saya ingin meminta surat penawaran resmi (RFQ) untuk Paket Laboratorium Kampus & Riset Dasar.",
    },
  ];

  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "name": "Paket Pengadaan Alat Laboratorium Turnkey PT Andis Sentral Laboratorium",
    "description": "Bundling instrumen laboratorium siap pakai untuk industri farmasi, IPAL limbah, dan riset akademik.",
    "itemListElement": bundles.map((bundle, index) => ({
      "@type": "Offer",
      "position": index + 1,
      "name": bundle.name,
      "description": bundle.description,
      "seller": {
        "@type": "Organization",
        "name": "PT Andis Sentral Laboratorium"
      }
    }))
  };

  return (
    <main className="flex flex-col min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-slate-900 pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300 border border-blue-500/20 mb-6">
            <Package className="h-4 w-4" />
            <span className="tracking-wide uppercase">Turnkey Procurement Solutions</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6 max-w-4xl mx-auto">
            Paket Pengadaan Alat Laboratorium Turnkey: Bebas Ribet &amp; Siap Audit
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
            Didesain khusus untuk Tim Purchasing, Manager QC, dan Dosen Peneliti. Dapatkan bundling instrumen esensial berkualitas dunia lengkap dengan free kalibrasi KAN, garansi 12 bulan, dan kelengkapan administrasi SPJ legalitas resmi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <WaLinkCTA
              href="?wa=open&source=paket_pengadaan_hero&text=Halo%20AndisLab%2C%20saya%20ingin%20konsultasi%20paket%20pengadaan%20alat%20lab%20turnkey."
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-bold text-white shadow-lg hover:bg-emerald-500 transition-all"
            >
              Konsultasi Paket via WhatsApp
            </WaLinkCTA>
            <Link
              href="/inquiry"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-8 py-3.5 text-base font-semibold text-white hover:bg-slate-750 transition-all"
            >
              Minta Penawaran Formal (RFQ)
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-3">
              <span className="block text-2xl font-extrabold text-blue-600">Free</span>
              <span className="text-xs sm:text-sm text-slate-600 font-medium">Kalibrasi KAN Perdana</span>
            </div>
            <div className="p-3">
              <span className="block text-2xl font-extrabold text-blue-600">12 Bulan</span>
              <span className="text-xs sm:text-sm text-slate-600 font-medium">Garansi Resmi Distributor</span>
            </div>
            <div className="p-3">
              <span className="block text-2xl font-extrabold text-blue-600">100% Legal</span>
              <span className="text-xs sm:text-sm text-slate-600 font-medium">Faktur Pajak PPN &amp; SPJ PT</span>
            </div>
            <div className="p-3">
              <span className="block text-2xl font-extrabold text-blue-600">&lt; 24 Jam</span>
              <span className="text-xs sm:text-sm text-slate-600 font-medium">SLA Respons Teknisi Ahli</span>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Pilihan Paket Solutif Sesuai Kebutuhan Sektor Anda
            </h2>
            <p className="text-slate-600 mt-3 text-base">
              Setiap paket telah dikurasi oleh teknisi lab berpengalaman untuk memastikan kompatibilitas alat, akurasi data pengujian, dan kemudahan audit.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {bundles.map((bundle) => {
              const IconComponent = bundle.icon;
              return (
                <div
                  key={bundle.id}
                  className="flex flex-col bg-white rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-xl transition-all hover:border-blue-500 overflow-hidden"
                >
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                        <Sparkles className="h-3.5 w-3.5" />
                        {bundle.badge}
                      </span>
                      <IconComponent className="h-6 w-6 text-slate-400" />
                    </div>

                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                      {bundle.name}
                    </h3>
                    <p className="text-xs font-semibold text-blue-700 bg-blue-50/60 px-3 py-1.5 rounded-lg mb-4">
                      {bundle.target}
                    </p>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                      {bundle.description}
                    </p>

                    <div className="border-t border-slate-100 pt-6 mb-6">
                      <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">
                        Instrumen yang Termasuk:
                      </h4>
                      <ul className="space-y-2.5">
                        {bundle.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-800">
                            <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-slate-100 pt-6 mb-6 bg-slate-50/80 -mx-6 md:-mx-8 px-6 md:px-8 py-4">
                      <h4 className="text-xs font-bold uppercase text-emerald-700 tracking-wider mb-2 flex items-center gap-1.5">
                        <Award className="h-4 w-4" />
                        Bonus Value Termasuk:
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                        {bundle.bonuses.map((bonus, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>{bonus}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto pt-4 space-y-3">
                      <WaLinkCTA
                        href={`?wa=open&source=paket_${bundle.id}&text=${encodeURIComponent(bundle.waMessage)}`}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow hover:bg-emerald-500 transition-all"
                      >
                        Tanya Penawaran Paket Ini via WA
                      </WaLinkCTA>
                      <Link
                        href="/inquiry"
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-6 py-3 text-sm font-semibold text-slate-800 transition-all"
                      >
                        Minta Draft Penawaran Resmi
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Procurement Process Guarantee */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Jaminan Kemudahan Administrasi Pengadaan Perusahaan &amp; Instansi
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Kami memahami kepatuhan SOP procurement adalah prioritas mutlak Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Penawaran Formal Kilat</h3>
              <p className="text-slate-600 text-sm">
                Surat penawaran harga resmi PT ber-kop, bermaterai/ttd basah/digital siap terbit dalam hitungan jam untuk rujukan PO Anda.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Faktur Pajak &amp; Legalitas PT</h3>
              <p className="text-slate-600 text-sm">
                PT berstatus PKP aktif, NIB lengkap, siap menerbitkan e-Faktur Pajak PPN 11% dan invoice resmi untuk kelancaran laporan pajak.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Commissioning &amp; Berita Acara</h3>
              <p className="text-slate-600 text-sm">
                Pengiriman diantar armada teknisi resmi, uji coba di tempat (commissioning), training user, dan penandatanganan BAST resmi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-slate-900 py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
            Punya Rencana Anggaran Khusus atau Kebutuhan Kustom?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
            Konsultasikan spesifikasi dan batasan budget Anda dengan Technical Sales Specialist AndisLab. Kami buatkan proposal paket kustom optimal untuk instansi Anda.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <WaLinkCTA
              href="?wa=open&source=paket_pengadaan_custom&text=Halo%20AndisLab%2C%20saya%20ingin%20konsultasi%20kebutuhan%20paket%20pengadaan%20alat%20lab%20kustom."
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-bold text-white shadow-lg hover:bg-emerald-500 transition-all"
            >
              Konsultasi Kustom via WhatsApp
            </WaLinkCTA>
            <Link
              href="/inquiry"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-bold text-white hover:bg-blue-500 transition-all"
            >
              Minta Proposal Kustom Sekarang
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
