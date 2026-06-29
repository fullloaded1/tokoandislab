import { Suspense } from "react";
import KatalogClient from "./KatalogClient";

export const metadata = {
  title: "Katalog Alat Laboratorium & Reagen Terlengkap — AndisLab",
  description:
    "Jelajahi katalog harga alat laboratorium, bahan kimia lab, reagen air Lovibond, inkubator Daihan Labtech, glassware Pyrex original, dan furnitur lab custom dari distributor resmi AndisLab.",
};

function KatalogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-8 w-48 rounded-xl shimmer mb-6" />
      <div className="h-12 w-full max-w-2xl rounded-2xl shimmer mb-4" />
      <div className="h-10 w-96 rounded-2xl shimmer mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-slate-100 bg-white p-4">
            <div className="aspect-[4/3] rounded-2xl shimmer mb-4" />
            <div className="h-5 w-3/4 rounded-lg shimmer mb-2" />
            <div className="h-4 w-full rounded-lg shimmer mb-4" />
            <div className="h-11 w-full rounded-2xl shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

import { prisma } from "@/lib/db";
import { serializeProductDecimals } from "@/lib/products";

// ISR: revalidate setiap 60 detik
export const revalidate = 60;

import { getReadyStockSummary } from "@/lib/readyStock";

export default async function KatalogPage() {
  let products: any[] = [];
  try {
    products = (await prisma.product.findMany({
      include: { specs: true, variants: true }
    })).map(serializeProductDecimals);
  } catch (error) {
    console.error("KatalogPage: Failed to fetch products", error);
  }

  return (
    <KatalogClient initialProducts={products as any}>
      <div className="mb-10 text-slate-700">
        <p className="text-base leading-relaxed mb-8">
          Katalog ini memuat koleksi lengkap alat laboratorium, reagen kimia, dan furnitur lab yang disediakan oleh PT Andis Sentral Laboratorium. Seluruh produk kami bersumber dari pabrikan dan distributor resmi untuk memastikan keandalan, keakuratan hasil pengujian, serta durabilitas alat sesuai dengan standar laboratorium modern.
        </p>

        <h2 className="text-xl font-bold mb-4 text-slate-900">Perbandingan Produk Laboratorium</h2>
        <div className="overflow-x-auto mb-10">
          <table className="w-full text-left text-sm border-collapse border border-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 border border-slate-200 font-bold text-slate-700">Nama Produk</th>
                <th className="px-4 py-3 border border-slate-200 font-bold text-slate-700">Merek / Kategori</th>
                <th className="px-4 py-3 border border-slate-200 font-bold text-slate-700">Ketersediaan</th>
                <th className="px-4 py-3 border border-slate-200 font-bold text-slate-700">Lead Time</th>
                <th className="px-4 py-3 border border-slate-200 font-bold text-slate-700">Estimasi Harga</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 40).map((p: any) => {
                const summary = getReadyStockSummary(p);
                const initialVariant = summary.firstAvailable ?? p.variants?.[0] ?? null;
                const availableStock = initialVariant ? initialVariant.stock - initialVariant.reservedStock : 0;
                const stockStatus = availableStock > 0 ? "Ready Stock" : (p.isReadyStock ? "Habis" : "Pre-order");
                
                let priceDisplay = "Minta Penawaran";
                if (!p.isRequestPricing && initialVariant?.price) {
                  priceDisplay = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(initialVariant.price));
                }

                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 border border-slate-200 font-medium text-blue-600">
                      <a href={`/katalog/${p.slug}`} className="hover:underline">{p.name}</a>
                    </td>
                    <td className="px-4 py-3 border border-slate-200">{p.brand || p.categoryLabel}</td>
                    <td className="px-4 py-3 border border-slate-200">{availableStock > 0 ? `${availableStock} unit` : stockStatus}</td>
                    <td className="px-4 py-3 border border-slate-200">{p.leadTime || '-'}</td>
                    <td className="px-4 py-3 border border-slate-200 font-medium">{priceDisplay}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-xs text-slate-500 mt-2">* Menampilkan sebagian produk populer. Gunakan fitur pencarian dan filter di bawah untuk melihat keseluruhan katalog produk.</p>
        </div>

        <h2 className="text-xl font-bold mb-4 text-slate-900">Cara Memilih Alat Laboratorium yang Tepat</h2>
        <ol className="list-decimal pl-5 space-y-2 mb-8 text-slate-600">
          <li><strong>Pahami Kebutuhan Analisis:</strong> Pastikan spesifikasi teknis alat (seperti kapasitas, akurasi, dan fitur khusus) sesuai dengan metode pengujian di lab Anda.</li>
          <li><strong>Cek Ketersediaan dan Lead Time:</strong> Perhatikan status ready stock atau pre-order beserta estimasi waktu pengiriman agar tidak mengganggu jadwal operasional.</li>
          <li><strong>Periksa Kelengkapan Dokumen:</strong> Pastikan produk dilengkapi dengan garansi resmi dan, bila diperlukan, Certificate of Analysis (COA) atau sertifikat kalibrasi.</li>
          <li><strong>Konsultasi Teknis:</strong> Jika ragu, tim AndisLab siap mendampingi Anda untuk menemukan solusi alat laboratorium yang paling efisien dan efektif.</li>
        </ol>
      </div>
    </KatalogClient>
  );
}
