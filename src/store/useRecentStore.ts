import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentStore {
  recentProducts: any[];
  addRecent: (product: any) => void;
}

export const useRecentStore = create<RecentStore>()(
  persist(
    (set, get) => ({
      recentProducts: [],
      addRecent: (product) => {
        const current = get().recentProducts;
        const minimalProduct = {
          id: product.id,
          slug: product.slug,
          model: product.model,
          name: product.name,
          brand: product.brand,
          categoryLabel: product.categoryLabel,
          image: product.image,
          isReadyStock: product.isReadyStock,
          price: product.price,
          clearanceDiscount: product.clearanceDiscount,
          leadTime: product.leadTime,
          variantCount: product.variantCount || (product.variants?.length ?? 1),
          variants: product.variants?.map((v: any) => ({
             id: v.id, price: v.price, stock: v.stock, reservedStock: v.reservedStock, name: v.name
          })) || []
        };
        const filtered = current.filter((p) => p.id !== product.id);
        set({ recentProducts: [minimalProduct, ...filtered].slice(0, 8) });
      }
    }),
    { name: 'andislab-recent-v1' }
  )
);
