/* Hallmark · component: RFQCartDrawer · genre: modern-minimal · 8-state-ui: pass · contrast: pass · decimal-safety: pass */
"use client";

import { useEffect } from "react";
import { useRFQStore } from "@/store/useRFQStore";
import { X, Trash2, Plus, Minus, ShoppingCart, FileText, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { waMeUrl } from "@/lib/contact";

interface RFQCartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function RFQCartDrawer({ open, onClose }: RFQCartDrawerProps) {
  const { cartType, items, removeItem, updateQty, clearCart, totalItems, totalPrice, notes, setNotes } = useRFQStore();

  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const handleCheckout = () => {
    if (items.length === 0) return;
    onClose();
    if (cartType === 'DIRECT') {
      router.push("/checkout");
    } else {
      router.push("/inquiry");
    }
  };

  const handleWhatsAppDirect = () => {
    if (items.length === 0) return;
    const itemLines = items.map((i, idx) => `${idx + 1}. ${i.name} (${i.qty} unit)`).join("\n");
    const noteSection = notes?.trim() ? `\n*Catatan Kebutuhan Khusus:*\n${notes.trim()}\n` : "";
    const message = `*PERMINTAAN PENAWARAN HARGA (RFQ) - ANDISLAB*\n--------------------------------------------\n*Daftar Produk (${totalItems()} unit):*\n${itemLines}\n--------------------------------------------${noteSection}\nMohon dikirimkan surat penawaran resmi beserta kelengkapan dokumen SPJ & e-Katalog. Terima kasih!`;
    window.open(waMeUrl(message), "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={cartType === 'DIRECT' ? 'Keranjang Belanja' : 'Daftar Penawaran'}
        className={`fixed flex flex-col top-0 right-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-rule)]/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {cartType === 'DIRECT' ? 'Keranjang Belanja' : 'Daftar Penawaran'}
              </h2>
              <p className="text-xs text-slate-500">
                {items.length} produk dipilih
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] active:scale-[0.95]"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 mb-4">
                <ShoppingCart className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">
                Belum ada produk di keranjang
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Jelajahi katalog dan tambahkan produk untuk penawaran
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:shadow-sm"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">NO IMG</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs font-medium text-slate-400 mt-1">
                      {item.category}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          aria-label="Kurangi jumlah"
                          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200 active:scale-90 disabled:opacity-30 disabled:pointer-events-none shadow-2xs"
                          disabled={item.qty <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-black text-slate-900">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          aria-label="Tambah jumlah"
                          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200 active:scale-90 shadow-2xs"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs font-black text-slate-600 bg-slate-200/70 px-2.5 py-1 rounded-lg">
                        {item.qty} unit
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200 active:scale-90 self-start"
                    aria-label={`Hapus ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50/80 px-6 py-5">
            <div className="mb-4">
              <label htmlFor="rfq-notes" className="block text-xs font-bold text-slate-700 mb-1.5">
                Catatan Kebutuhan Khusus (opsional)
              </label>
              <textarea
                id="rfq-notes"
                rows={2}
                value={notes || ""}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: Butuh instalasi, kalibrasi KAN, atau target tanggal pengiriman..."
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-600">Total Produk Pilihan</span>
              <span className="text-xl font-black text-slate-900">{totalItems()} unit</span>
            </div>
            {cartType === 'DIRECT' && (
              <div className="flex items-center justify-between mb-4 mt-2 bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 shadow-2xs">
                <span className="text-sm font-black text-emerald-900">Total Harga</span>
                <span className="text-lg font-black text-emerald-700">Rp {totalPrice().toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="mb-4 rounded-2xl bg-white p-3 text-xs font-semibold text-slate-600 border border-slate-200 shadow-2xs leading-relaxed flex items-start gap-2.5">
              <span className="text-emerald-600 font-bold text-sm shrink-0">🛡️</span>
              {cartType === 'DIRECT' ? (
                <span>*Harga belum termasuk PPN 12% dan ongkos kirim. Dilengkapi dokumen resmi SPJ & e-Katalog.</span>
              ) : (
                <span>*Pengajuan RFQ resmi instansi B2B/Pemerintah. Balasan resmi surat penawaran maksimal 1x24 jam.</span>
              )}
            </div>
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className={`flex w-full min-h-[48px] items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-black text-white shadow-xl transition-all duration-200 ease-out hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.98] ${
                  cartType === 'DIRECT' 
                    ? "bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 shadow-emerald-600/30 hover:from-emerald-500 hover:to-teal-600" 
                    : "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 shadow-blue-600/30 hover:from-blue-500 hover:to-cyan-500"
                }`}
              >
                {cartType === 'DIRECT' ? (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    <span>Checkout Sekarang &rarr;</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5 text-emerald-300" />
                    <span>Lanjut Minta Penawaran (RFQ) &rarr;</span>
                  </>
                )}
              </button>
              {cartType !== 'DIRECT' && (
                <button
                  onClick={handleWhatsAppDirect}
                  className="flex w-full min-h-[48px] items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-xs font-black text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 transition-all duration-200 active:scale-[0.98]"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Kirim Penawaran Langsung via WhatsApp</span>
                </button>
              )}
              <button
                onClick={clearCart}
                className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all duration-200 active:scale-[0.98]"
              >
                <Trash2 className="h-4 w-4" />
                <span>Kosongkan Keranjang</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
