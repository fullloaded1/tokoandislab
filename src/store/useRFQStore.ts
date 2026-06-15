"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;         // Unique ID for the cart (bisa gabungan productId + variantId)
  productId: string;
  variantId?: string; // Optional (untuk RFQ tanpa varian)
  slug: string;
  name: string;
  image: string;
  category: string;
  price: number;
  qty: number;
  type: "RFQ" | "DIRECT";
}

interface CartState {
  cartType: "RFQ" | "DIRECT" | null;
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">) => { success: boolean; error?: string };
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useRFQStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartType: null,
      items: [],

      addItem: (item) => {
        const state = get();
        
        // Cek bentrokan tipe keranjang
        if (state.cartType !== null && state.cartType !== item.type && state.items.length > 0) {
          return { 
            success: false, 
            error: `Keranjang Anda sedang berisi item ${state.cartType === 'RFQ' ? 'Permintaan Penawaran' : 'Beli Langsung'}. Harap selesaikan atau kosongkan keranjang sebelum mencampur dengan tipe pesanan lain.` 
          };
        }

        const existing = state.items.find((i) => i.id === item.id);
        
        if (existing) {
          set({
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, qty: i.qty + 1 } : i
            ),
          });
        } else {
          set({ 
            cartType: item.type, // Kunci mode keranjang
            items: [...state.items, { ...item, qty: 1 }] 
          });
        }

        return { success: true };
      },

      removeItem: (id) => {
        const newItems = get().items.filter((i) => i.id !== id);
        set({ 
          items: newItems,
          // Reset tipe keranjang jika kosong
          cartType: newItems.length === 0 ? null : get().cartType 
        });
      },

      updateQty: (id, qty) => {
        if (qty < 1) return;
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, qty } : i)),
        });
      },

      clearCart: () => set({ items: [], cartType: null }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    {
      name: "andislab-cart-v2",
    }
  )
);
