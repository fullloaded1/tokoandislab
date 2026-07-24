/* Hallmark · page: InquiryPage · genre: modern-minimal · macrostructure: High-Density Form · design-system: design.md */
"use client";

import { useRFQStore } from "@/store/useRFQStore";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileText, Loader2, Building, User, Phone, Mail, MapPin, CheckCircle } from "lucide-react";
import Image from "next/image";
import { submitInquiry } from "./actions";
import { useWhatsAppLeadStore } from "@/store/useWhatsAppLeadStore";

export default function InquiryPage() {
  const { items, clearCart } = useRFQStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successQuoteNo, setSuccessQuoteNo] = useState<string | null>(null);
  const openWaModal = useWhatsAppLeadStore((s) => s.openModal);

  if (successQuoteNo) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Permintaan Berhasil!</h2>
          <p className="text-slate-500 mb-6">
            Nomor Referensi: <span className="font-bold text-slate-800">{successQuoteNo}</span>
          </p>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            Tim sales AndisLab telah menerima permintaan penawaran harga Anda. Silakan lanjutkan ke WhatsApp agar tim kami dapat segera merespon Anda.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => openWaModal({
                source: "rfq_success",
                inquiryNo: successQuoteNo,
                text: `Halo Tim AndisLab, saya baru saja mengajukan penawaran harga via website dengan Nomor Referensi *${successQuoteNo}*. Mohon segera diproses, terima kasih!`
              })}
              className="w-full py-4 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all hover:-translate-y-0.5 shadow-lg shadow-[#25D366]/30"
            >
              <Phone className="h-5 w-5" />
              Lanjutkan Chat ke WhatsApp
            </button>
            <button
              onClick={() => router.push("/katalog")}
              className="w-full py-4 border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Kembali ke Katalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <FileText className="h-16 w-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Keranjang RFQ Kosong</h2>
        <p className="text-slate-500 mb-6 text-center max-w-md">
          Anda belum memilih produk apapun untuk diajukan penawarannya.
        </p>
        <button
          onClick={() => router.push("/katalog")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          Jelajahi Katalog
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("items", JSON.stringify(items));

    const res = await submitInquiry(formData);
    
    setIsLoading(false);
    
    if (res.success) {
      clearCart();
      setSuccessQuoteNo(res.inquiryNo || "TERKIRIM");
    } else {
      alert("Gagal: " + res.error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* High-Density Dark Console Conversion Stage Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-950 via-indigo-950/90 to-slate-950 p-8 sm:p-12 text-white shadow-2xl border border-blue-500/30 mb-10 text-center">
        <div className="absolute inset-0 -z-0 opacity-20 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-400/40 px-3.5 py-1 text-xs font-bold text-blue-200 mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sistem RFQ & SPJ Resmi Instansi</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3 leading-tight">
            Pengajuan Penawaran <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Harga</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
            Isi formulir di bawah ini untuk mendapatkan surat penawaran resmi dari AndisLab lengkap dengan spesifikasi, ketersediaan stok, dan berkas administrasi.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 sm:gap-10">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 border border-slate-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <span>Detail Instansi / Perusahaan</span>
              </h2>
              <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 shrink-0">
                Langkah 1 dari 2
              </span>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Nama Instansi *</label>
                  <input required name="institutionName" type="text" className="w-full min-h-[48px] rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600 outline-none transition-all shadow-2xs" placeholder="Contoh: RSUD Pasar Minggu" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Jenis Instansi *</label>
                  <select required name="type" className="w-full min-h-[48px] rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600 outline-none transition-all shadow-2xs">
                    <option value="RUMAH_SAKIT">Rumah Sakit / Klinik</option>
                    <option value="UNIVERSITAS">Universitas / Edukasi</option>
                    <option value="INDUSTRI">Pabrik / Industri</option>
                    <option value="PEMERINTAH">Pemerintahan</option>
                    <option value="SWASTA">Swasta Umum</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Alamat Lengkap *</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                  <textarea required name="address" rows={2} className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-11 pr-4 py-3 text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600 outline-none transition-all resize-none shadow-2xs" placeholder="Alamat lengkap instansi (Jalan, Kota, Provinsi, Kode Pos)..." />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 mt-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <User className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span>Kontak Person (PIC)</span>
                  </h2>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Langkah 2 dari 2
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Nama Lengkap PIC *</label>
                <input required name="contactName" type="text" className="w-full min-h-[48px] rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600 outline-none transition-all shadow-2xs" placeholder="Nama lengkap penanggung jawab" />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Nomor WhatsApp *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <input required name="phone" type="tel" className="w-full min-h-[48px] rounded-2xl border border-slate-200 bg-slate-50/80 pl-11 pr-4 py-3 text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600 outline-none transition-all shadow-2xs" placeholder="0812xxxx (Aktif)" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">Untuk konfirmasi cepat oleh tim sales kami.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Email Valid *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <input required name="email" type="email" className="w-full min-h-[48px] rounded-2xl border border-slate-200 bg-slate-50/80 pl-11 pr-4 py-3 text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600 outline-none transition-all shadow-2xs" placeholder="email@instansi.com" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">Surat penawaran resmi PDF akan dikirim ke email ini.</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-sm font-bold text-slate-700">Catatan Khusus (Opsional)</label>
                <textarea name="notes" rows={2} className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-900 focus:bg-white focus:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600 outline-none transition-all resize-none shadow-2xs" placeholder="Contoh: Butuh spesifikasi lengkap, estimasi ongkir, atau masa garansi..." />
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  className="w-full flex min-h-[52px] items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-base py-4 rounded-2xl shadow-xl shadow-emerald-600/30 transition-all duration-200 ease-out focus-visible:outline-2 focus-visible:outline-emerald-600 active:scale-[0.98] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
                  <span>Kirim Permintaan Penawaran Resmi &rarr;</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Summary Column */}
        <div className="lg:col-span-5">
          <div className="bg-slate-50/80 rounded-3xl p-6 sm:p-8 border border-slate-200 sticky top-24 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span>Ringkasan Produk RFQ</span>
            </h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-white rounded-2xl border border-slate-100 shadow-2xs">
                  <div className="relative h-16 w-16 shrink-0 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover p-1" />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold">NO IMG</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 line-clamp-2">{item.name}</p>
                    <p className="text-xs font-semibold text-blue-600 mt-1">Jumlah: {item.qty} unit</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200/80 pt-4 space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Total Item Diajukan</span>
                <span className="font-extrabold text-slate-800 bg-slate-200/60 px-2.5 py-0.5 rounded-full text-xs">
                  {items.reduce((s, i) => s + i.qty, 0)} unit
                </span>
              </div>
              <div className="flex justify-between items-center mt-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl px-5 py-3.5 shadow-md shadow-blue-500/15">
                <span className="text-sm font-bold">Harga Penawaran</span>
                <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full">Resmi PDF (1x24 Jam)</span>
              </div>
            </div>

            {/* SLA Guarantee Box */}
            <div className="mt-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4.5 text-left">
              <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm mb-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Garansi Layanan & SPJ Resmi</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 pl-5 list-disc leading-relaxed">
                <li>Surat penawaran resmi PDF balasan maksimal <strong className="text-slate-800 font-bold">1x24 jam kerja</strong>.</li>
                <li>Lengkap dengan spesifikasi teknis, garansi pabrik, dan estimasi lead time PO.</li>
                <li>Tersedia format khusus HPS / RAB sesuai standar kelengkapan dokumen SPJ instansi Anda.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
