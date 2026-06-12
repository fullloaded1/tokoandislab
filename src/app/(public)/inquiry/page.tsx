"use client";

import { useRFQStore } from "@/store/useRFQStore";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileText, Loader2, Building, User, Phone, Mail, MapPin, CheckCircle } from "lucide-react";
import Image from "next/image";
import { submitInquiry } from "./actions";

export default function InquiryPage() {
  const { items, clearCart } = useRFQStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successQuoteNo, setSuccessQuoteNo] = useState<string | null>(null);

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
            <a
              href={`/api/wa-redirect?source=rfq_success&inquiryNo=${encodeURIComponent(successQuoteNo)}&text=${encodeURIComponent(
                `Halo Tim AndisLab, saya baru saja mengajukan penawaran harga via website dengan Nomor Referensi *${successQuoteNo}*. Mohon segera diproses, terima kasih!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all hover:-translate-y-0.5 shadow-lg shadow-[#25D366]/30"
            >
              <Phone className="h-5 w-5" />
              Lanjutkan Chat ke WhatsApp
            </a>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Pengajuan Penawaran <span className="text-blue-600">Harga</span>
        </h1>
        <p className="text-slate-500 mt-2">Isi formulir di bawah ini untuk mendapatkan surat penawaran resmi dari AndisLab.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/40 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Detail Instansi / Perusahaan
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Nama Instansi *</label>
                  <input required name="institutionName" type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: RSUD Pasar Minggu" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Jenis Instansi *</label>
                  <select required name="type" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="RUMAH_SAKIT">Rumah Sakit / Klinik</option>
                    <option value="UNIVERSITAS">Universitas / Edukasi</option>
                    <option value="INDUSTRI">Pabrik / Industri</option>
                    <option value="PEMERINTAH">Pemerintahan</option>
                    <option value="SWASTA">Swasta Umum</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Alamat Lengkap *</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                  <textarea required name="address" rows={2} className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Alamat lengkap instansi..." />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 mt-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Kontak Person (PIC)
                </h2>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Nama Lengkap PIC *</label>
                <input required name="contactName" type="text" className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Nama Anda" />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Nomor WhatsApp *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <input required name="phone" type="tel" className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0812..." />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Email Valid *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                    <input required name="email" type="email" className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="email@instansi.com" />
                  </div>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-sm font-semibold text-slate-700">Catatan Khusus (Opsional)</label>
                <textarea name="notes" rows={2} className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Contoh: Butuh estimasi biaya ongkir ke Surabaya..." />
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
                  Kirim Permintaan Penawaran
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Summary Column */}
        <div className="lg:col-span-5">
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 sticky top-24">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Ringkasan Produk</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-16 w-16 shrink-0 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover p-1" />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold">NO IMG</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-slate-500 mt-1">Jumlah: {item.qty} unit</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Total Item</span>
                <span className="font-semibold text-slate-800">{items.reduce((s, i) => s + i.qty, 0)}</span>
              </div>
              <div className="flex justify-between items-center mt-2 bg-blue-50 rounded-xl px-4 py-3">
                <span className="text-sm font-bold text-blue-800">Harga Penawaran</span>
                <span className="text-sm font-bold text-blue-600">Akan dikirim via email</span>
              </div>
              <p className="text-xs text-slate-500 text-right mt-1">
                *Tim sales akan mengirimkan surat penawaran resmi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
