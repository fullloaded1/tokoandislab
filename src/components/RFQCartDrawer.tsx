"use client";

import { useRFQStore } from "@/store/useRFQStore";
import { X, Trash2, Plus, Minus, ShoppingCart, FileText } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RFQCartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function RFQCartDrawer({ open, onClose }: RFQCartDrawerProps) {
  const { cartType, items, removeItem, updateQty, clearCart, totalItems, totalPrice } = useRFQStore();

  const router = useRouter();

  const handleCheckout = () => {
    if (items.length === 0) return;
    onClose();
    if (cartType === 'DIRECT') {
      router.push("/checkout");
    } else {
      router.push("/inquiry");
    }
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
        className={`fixed flex flex-col top-0 right-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
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
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
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
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-colors"
                        disabled={item.qty <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-slate-700">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      </div>
                      <p className="text-xs font-semibold text-slate-500">
                        {item.qty} unit
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors self-start"
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
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-500">Total Produk</span>
              <span className="text-xl font-black text-slate-800">{totalItems()} unit</span>
            </div>
            {cartType === 'DIRECT' && (
              <div className="flex items-center justify-between mb-4 mt-2 bg-blue-50 p-3 rounded-xl border border-blue-100">
                <span className="text-sm font-bold text-blue-800">Total Harga</span>
                <span className="text-lg font-black text-blue-700">Rp {totalPrice().toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${
                  cartType === 'DIRECT' 
                    ? "bg-emerald-600 shadow-emerald-500/25 hover:bg-emerald-700" 
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 shadow-blue-500/25"
                }`}
              >
                {cartType === 'DIRECT' ? (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Checkout Sekarang
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5" />
                    Minta Penawaran (RFQ)
                  </>
                )}
              </button>
              <button
              onClick={clearCart}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-medium text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
            >
              <Trash2 className="h-4 w-4" />
              Kosongkan Keranjang
            </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
