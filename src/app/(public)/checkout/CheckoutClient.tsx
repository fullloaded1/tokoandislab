"use client";

import { useRFQStore } from "@/store/useRFQStore";
import { useToast } from "@/components/Toast";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createDirectOrder } from "./actions";
import { ChevronRight, ShoppingCart, Loader2, Info, ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import { PaymentMethod } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { money } from "@/lib/money";
import { SHIPPING_REGIONS, getShippingRegion } from "@/lib/shipping";

const TAX_RATE = 11;

export default function CheckoutClient() {
  const { cartType, items, clearCart, totalItems } = useRFQStore();
  const router = useRouter();
  
  let toast: ReturnType<typeof useToast> | null = null;
  try { toast = useToast(); } catch {}

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    institution: "",
    address: "",
  });

  const [shippingRegion, setShippingRegion] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MANUAL_TRANSFER");

  useEffect(() => {
    setMounted(true);
    if (items.length > 0 && cartType !== 'DIRECT') {
      toast?.showToast("Keranjang Anda saat ini berisi produk pre-order (RFQ).", "error");
      router.push("/inquiry");
    }
  }, [items, cartType, router, toast]);

  const { subtotal, tax, shippingFee, grandTotal } = useMemo(() => {
    const sub = items.reduce(
      (acc, i) => acc.add(money.toDecimal(i.price).mul(i.qty)),
      money.toDecimal(0)
    );
    const t = money.applyTax(sub, TAX_RATE);
    const region = getShippingRegion(shippingRegion);
    const fee = region ? money.toDecimal(region.flatRate) : money.toDecimal(0);
    return {
      subtotal: sub.toNumber(),
      tax: t.toNumber(),
      shippingFee: fee.toNumber(),
      grandTotal: sub.add(t).add(fee).toNumber(),
    };
  }, [items, shippingRegion]);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="flex h-24 w-24 mx-auto items-center justify-center rounded-full bg-slate-100 mb-6">
          <ShoppingCart className="h-10 w-10 text-slate-300" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Keranjang Anda Kosong</h1>
        <p className="text-slate-500 mb-8">Belum ada produk Ready Stock yang Anda pilih.</p>
        <Link href="/ready-stock" className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors">
          Belanja Sekarang
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingRegion) {
      toast?.showToast("Pilih wilayah pengiriman dulu.", "error");
      return;
    }
    setLoading(true);

    try {
      const payload = {
        items: items.map(i => ({ variantId: i.variantId as string, quantity: i.qty })),
        buyer: form,
        shippingRegion,
        paymentMethod
      };

      const res = await createDirectOrder(payload) as any;

      if (!res.success) {
        toast?.showToast(res.error || "Gagal membuat pesanan", "error");
      } else {
        clearCart();
        toast?.showToast("Pesanan berhasil dibuat!", "success");
        router.push(`/checkout/success?orderNo=${res.orderNo}`);
      }
    } catch (err: any) {
      toast?.showToast(err.message || "Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/katalog" className="hover:text-blue-600 transition-colors">Katalog</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-slate-800">Checkout</span>
      </nav>

      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checkout Pembelian</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Form Kiri */}
        <div className="lg:col-span-7 space-y-8">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
               <Info className="h-5 w-5 text-blue-600" /> Informasi Pengiriman & Kontak
            </h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap *</label>
                  <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="john@example.com" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nomor WhatsApp *</label>
                  <input required type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="0812..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Instansi / Perusahaan</label>
                  <input type="text" value={form.institution} onChange={e => setForm({...form, institution: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder="PT ABC atau Universitas XYZ" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Pengiriman Lengkap *</label>
                <textarea required rows={4} value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none" placeholder="Jalan, Gedung, Nomor, Kota, Provinsi, Kode Pos..." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" /> Wilayah Pengiriman *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SHIPPING_REGIONS.map((r) => (
                    <label
                      key={r.key}
                      className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${shippingRegion === r.key ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingRegion"
                          value={r.key}
                          checked={shippingRegion === r.key}
                          onChange={() => setShippingRegion(r.key)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-slate-800">{r.label}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{money.formatIDR(r.flatRate)}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          </div>
          
          {/* Metode Pembayaran */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
               <ShieldCheck className="h-5 w-5 text-emerald-600" /> Metode Pembayaran
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <label className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${paymentMethod === 'MANUAL_TRANSFER' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <input type="radio" name="payment" value="MANUAL_TRANSFER" checked={paymentMethod === 'MANUAL_TRANSFER'} onChange={() => setPaymentMethod('MANUAL_TRANSFER')} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500" />
                    <span className="font-bold text-slate-800">Transfer Bank Manual</span>
                  </div>
                  <p className="text-xs text-slate-500 pl-7">Transfer langsung ke rekening BCA / Mandiri perusahaan kami.</p>
               </label>
               <label className={`cursor-pointer rounded-2xl border-2 p-4 transition-all ${paymentMethod === 'PAYMENT_GATEWAY' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <input type="radio" name="payment" value="PAYMENT_GATEWAY" checked={paymentMethod === 'PAYMENT_GATEWAY'} onChange={() => setPaymentMethod('PAYMENT_GATEWAY')} className="h-4 w-4 text-emerald-600 focus:ring-emerald-500" />
                    <span className="font-bold text-slate-800">Payment Gateway</span>
                  </div>
                  <p className="text-xs text-slate-500 pl-7">Virtual Account, Kartu Kredit, atau QRIS (Dikenakan biaya layanan).</p>
               </label>
            </div>
          </div>
        </div>

        {/* Ringkasan Pesanan */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-3xl border border-slate-100 bg-white shadow-lg overflow-hidden">
             <div className="bg-slate-900 px-6 py-4">
                <h2 className="text-lg font-bold text-white">Ringkasan Pesanan</h2>
             </div>
             <div className="p-6">
                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 hide-scrollbar">
                   {items.map(item => (
                     <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="relative h-16 w-16 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                           {item.image ? (
                             <Image src={item.image} alt={item.name} fill className="object-cover" />
                           ) : (
                             <span className="text-[10px] font-bold text-slate-400">NO IMG</span>
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-semibold text-slate-800 leading-snug">{item.name}</p>
                           <p className="text-xs text-slate-500 mt-1">{item.qty} x Rp {item.price.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="font-bold text-slate-800 text-sm">
                           Rp {(item.qty * item.price).toLocaleString('id-ID')}
                        </div>
                     </div>
                   ))}
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-100 border-dashed mb-6">
                   <div className="flex justify-between text-sm font-medium text-slate-600">
                     <span>Subtotal ({totalItems()} produk)</span>
                     <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                   </div>
                   <div className="flex justify-between text-sm font-medium text-slate-600">
                     <span>PPN 11%</span>
                     <span>Rp {tax.toLocaleString('id-ID')}</span>
                   </div>
                   <div className="flex justify-between text-sm font-medium text-slate-600">
                     <span>Ongkos Kirim</span>
                     {shippingRegion ? (
                       <span>Rp {shippingFee.toLocaleString('id-ID')}</span>
                     ) : (
                       <span className="text-amber-600 text-xs mt-0.5">Pilih wilayah</span>
                     )}
                   </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl mb-8">
                   <span className="text-sm font-bold text-emerald-800">Total Pembayaran</span>
                   <span className="text-xl font-black text-emerald-600">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={loading || !shippingRegion}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-base font-bold text-white transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/25 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Memproses Pesanan...</>
                  ) : (
                    <><ShoppingCart className="h-5 w-5" /> Buat Pesanan Sekarang</>
                  )}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
