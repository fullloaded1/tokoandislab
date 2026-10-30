import { terms, promoPaymentTiers } from "@/data/promo-akhir-tahun";
import { PromoState, HERO_SPH_MESSAGE } from "@/lib/promo-akhir-tahun";
import PromoWaLink from "./PromoWaLink";
import ClientTestimonial from "@/components/ClientTestimonial";
import {
  ShieldCheck,
  PackageCheck,
  Headset,
  HelpCircle,
  FileText,
  Clock,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  Coins,
} from "lucide-react";

interface PromoExtrasProps {
  promoState: PromoState;
}

export default function PromoExtras({ promoState }: PromoExtrasProps) {
  const faqs = [
    {
      q: "Bagaimana cara meminta Surat Penawaran Harga (SPH) resmi?",
      a: "Cukup klik tombol 'Minta SPH' pada produk yang Anda minati di halaman ini, atau hubungi tim sales kami via WhatsApp. Tim spesialis kami akan menerbitkan dokumen SPH resmi ber-KOP surat lengkap dengan spesifikasi teknis dalam waktu 1x24 jam untuk pengajuan anggaran Anda.",
    },
    {
      q: "Apakah pengadaan bisa melalui jalur e-Katalog / INAPROC atau SIPLah?",
      a: "Tentu. Silakan hubungi tim sales kami untuk konsultasi skema pengadaan yang paling sesuai dengan kebutuhan instansi Anda (baik e-Katalog LKPP / INAPROC, SIPLah, tender kampus, maupun pengadaan langsung B2B swasta).",
    },
    {
      q: "Bagaimana dengan instalasi dan training operator alat?",
      a: "Untuk area Jabodetabek, instalasi dan uji fungsi dilakukan langsung secara on-site oleh teknisi resmi AndisLab tanpa biaya tambahan, termasuk panduan dasar bagi operator. Untuk area di luar Jabodetabek, pelaksanaan dilakukan sesuai kesepakatan penawaran resmi.",
    },
    {
      q: "Berapa lama masa garansi untuk unit promo ini?",
      a: "Seluruh produk adalah unit baru dengan jaminan garansi resmi prinsipal masing-masing brand (umumnya 1 tahun garansi servis dan suku cadang). Dokumen kartu garansi dan faktur resmi disertakan saat pengiriman unit.",
    },
    {
      q: "Bagaimana ketentuan dan skema pembayaran?",
      a: "Hubungi tim sales kami untuk mendiskusikan termin dan skema pembayaran yang sesuai dengan regulasi instansi Anda, termasuk penerbitan Faktur Pajak elektronik dan Berita Acara Serah Terima (BAST) sebelum tutup buku 2026.",
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-12">
      {/* 1. Kenapa sebelum 30 Desember? */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              <Clock className="w-3.5 h-3.5" />
              Tenggat Waktu Akhir Tahun
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Kenapa Harus Menuntaskan PO Sebelum 30 Desember?
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Bagi universitas, rumah sakit, instansi riset, dan perusahaan industri, sisa pagu anggaran tahun 2026 yang tidak terserap optimal berisiko hangus saat tutup buku finansial.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs sm:text-sm">
              <div className="flex gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white mb-0.5">Penyerapan Anggaran Tepat Guna</div>
                  <div className="text-slate-400">Ubah sisa saldo anggaran menjadi aset instrumen lab berkualitas tinggi tanpa proses lelang berbelit.</div>
                </div>
              </div>

              <div className="flex gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white mb-0.5">Faktur &amp; BAST Tuntas 2026</div>
                  <div className="text-slate-400">Unit ready stock menjamin nomor seri alat, berita acara serah terima, dan faktur pajak terbit sebelum audit tutup buku.</div>
                </div>
              </div>

              <div className="flex gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white mb-0.5">100% Aman Pemeriksaan SPJ</div>
                  <div className="text-slate-400">Draft SPJ pengadaan langsung, e-Faktur Pajak resmi, dan berita acara uji fungsi disiapkan lengkap oleh tim kami.</div>
                </div>
              </div>

              <div className="flex gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white mb-0.5">Inspeksi Fisik Sebelum Bayar</div>
                  <div className="text-slate-400">Silakan video call live atau kunjungi gudang kami di Jabodetabek untuk memeriksa fisik unit sebelum menandatangani BAST.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Strip Kepercayaan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0 border border-emerald-100">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 mb-1">100% Ready Stock</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Unit fisik siap kirim dari gudang kami di Jabodetabek. Tanpa menunggu waktu antre impor berbulan-bulan.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 shrink-0 border border-blue-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Garansi Resmi Prinsipal</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Produk orisinal bergaransi resmi dari Daihan Labtech, Yamato, Infitek, Opto Edu, dan Labex.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0 border border-indigo-100">
              <Headset className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Dukungan Purna Jual</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Dukungan teknisi tersertifikasi, ketersediaan suku cadang, dan konsultasi operasional jangka panjang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2b. Testimoni Instansi & Industri */}
      <ClientTestimonial />

      {/* 3. FAQ 5 Pertanyaan */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            <HelpCircle className="w-3.5 h-3.5" />
            Tanya Jawab Pengadaan
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Informasi lengkap seputar prosedur pemesanan, pengiriman, dan administrasi instansi
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white p-5 sm:p-6 border border-slate-200 shadow-xs space-y-2"
            >
              <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-start gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs shrink-0 font-extrabold mt-0.5">
                  {idx + 1}
                </span>
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7.5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Skema Diskon & Syarat Pembayaran Resmi */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>Skema Diskon &amp; Syarat Pembayaran</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Ketentuan Diskon Pembayaran Resmi Akhir Tahun
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            Diskon diberikan secara transparan berbasis komitmen cara bayar, menjaga fleksibilitas cashflow instansi Anda.
          </p>
        </div>

        {/* 4 Tier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {promoPaymentTiers.map((tier, idx) => (
            <div
              key={idx}
              className={`p-5 rounded-2xl border transition-all ${
                tier.highlight
                  ? "bg-gradient-to-b from-blue-900 to-slate-900 text-white border-blue-500 shadow-lg shadow-blue-900/20"
                  : "bg-white text-slate-900 border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-md ${
                    tier.highlight
                      ? "bg-amber-400 text-slate-950 font-black"
                      : "bg-blue-100 text-blue-800 font-extrabold"
                  }`}
                >
                  {tier.discount}
                </span>
                {tier.highlight && (
                  <span className="text-[10px] uppercase font-bold text-cyan-300">
                    Maksimal
                  </span>
                )}
              </div>

              <div
                className={`text-sm font-bold leading-snug mb-2 ${
                  tier.highlight ? "text-white" : "text-slate-900"
                }`}
              >
                {tier.terms}
              </div>

              <p
                className={`text-xs leading-relaxed ${
                  tier.highlight ? "text-slate-300" : "text-slate-600"
                }`}
              >
                {tier.eligibility}
              </p>
            </div>
          ))}
        </div>

        {/* Syarat dan Ketentuan Lengkap */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Syarat dan Ketentuan Pengadaan Promo Akhir Tahun</span>
          </div>

          <ol className="list-decimal list-outside pl-5 space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            {terms.map((term, idx) => (
              <li key={idx}>{term}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. CTA Penutup */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-8 sm:p-12 text-white shadow-xl space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-bold text-cyan-200 backdrop-blur-md">
            Konsultasi Bebas Biaya
          </span>

          <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Amankan Alokasi Alat Lab Sebelum Tutup Buku 2026
          </h3>

          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Diskusikan kebutuhan spesifikasi alat, ketersediaan unit di gudang, dan permintaan SPH resmi bersama tim spesialis AndisLab hari ini.
          </p>

          <div className="pt-2">
            <PromoWaLink
              message={HERO_SPH_MESSAGE}
              promoPhase={promoState.phaseId}
              placement="footer_closing"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-blue-900 hover:bg-slate-100 px-8 py-4 text-sm sm:text-base font-black shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>Minta SPH Sekarang via WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </PromoWaLink>
          </div>
        </div>
      </section>
    </div>
  );
}
