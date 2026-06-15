import { CheckCircle, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Pesanan Berhasil — AndisLab",
};

export default async function CheckoutSuccessPage(
  props: { searchParams: Promise<{ orderNo?: string }> }
) {
  const { orderNo } = await props.searchParams;

  if (!orderNo) {
    notFound();
  }

  // Ambil detail singkat pesanan
  const order = await prisma.order.findUnique({
    where: { orderNo },
    select: {
      orderNo: true,
      totalAmount: true,
      createdAt: true,
      paymentMethod: true,
    }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-30 rounded-full"></div>
          <CheckCircle className="h-24 w-24 text-emerald-500 relative z-10" />
        </div>
      </div>
      
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
        Pesanan Berhasil Dibuat!
      </h1>
      
      <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-xl mx-auto">
        Terima kasih telah berbelanja di AndisLab. Kami telah menerima pesanan Anda dan stok saat ini telah diamankan untuk Anda.
      </p>

      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-10 mb-10 text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-8 border-b border-slate-200 border-dashed">
           <div>
             <p className="text-sm font-semibold text-slate-500 mb-1">Nomor Pesanan</p>
             <p className="text-xl font-bold text-slate-900">{order.orderNo}</p>
           </div>
           <div className="sm:text-right">
             <p className="text-sm font-semibold text-slate-500 mb-1">Total Tagihan</p>
             <p className="text-xl font-black text-emerald-600">
               Rp {order.totalAmount.toNumber().toLocaleString('id-ID')}
             </p>
           </div>
        </div>

        <div className="space-y-4">
           <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
             <FileText className="h-5 w-5 text-blue-600" />
             Instruksi Pembayaran
           </h3>
           {order.paymentMethod === 'MANUAL_TRANSFER' ? (
             <div className="p-5 rounded-2xl bg-white border border-slate-200">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Silakan lakukan transfer sesuai dengan <strong>Total Tagihan</strong> ke salah satu rekening berikut:
                </p>
                <div className="mt-4 space-y-3">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Bank BCA</p>
                    <p className="text-lg font-black text-slate-800 font-mono tracking-widest">123 456 7890</p>
                    <p className="text-sm font-medium text-slate-600 mt-1">a.n. PT Andis Peralatan Laboratorium</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Bank Mandiri</p>
                    <p className="text-lg font-black text-slate-800 font-mono tracking-widest">098 765 4321</p>
                    <p className="text-sm font-medium text-slate-600 mt-1">a.n. PT Andis Peralatan Laboratorium</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mt-4">
                  Setelah melakukan transfer, tim kami akan memverifikasi pembayaran Anda maksimal 1x24 jam (hari kerja).
                </p>
             </div>
           ) : (
             <div className="p-5 rounded-2xl bg-white border border-slate-200">
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Sistem Payment Gateway akan segera disiapkan oleh tim terkait. Tunggu instruksi pembayaran lebih lanjut yang akan dikirimkan ke email atau WhatsApp Anda.
                </p>
             </div>
           )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-slate-100 px-8 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors"
        >
          Kembali ke Beranda
        </Link>
        <Link
          href="/katalog"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
        >
          Lanjut Belanja <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
