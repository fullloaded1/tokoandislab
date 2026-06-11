import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Produk Ready Stock — AndisLab",
  description: "STOCK Terbatas! Segera pre-ORDER hubungi kami barang siap kirim ke instansi/perusahaan Anda.Dapatkan diskon khusus jika beli hari ini.",
};

import { getGroupedProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ReadyStockPage() {
  const allProducts = await prisma.product.findMany({
    where: {
      isReadyStock: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const products = getGroupedProducts(allProducts);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-slate-800">
          Ready Stock
        </span>
      </nav>

      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 mb-3">
          🔥 Tersedia Sekarang
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-3">
          Produk <span className="text-emerald-600">Ready Stock</span>
        </h1>
        <p className="text-base text-slate-500 max-w-2xl">
          STOCK Terbatas! Segera pre-ORDER hubungi kami barang siap kirim ke instansi/perusahaan Anda.Dapatkan diskon khusus jika beli hari ini.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-100 rounded-3xl text-center">
          <p className="text-slate-500 font-medium">Belum ada produk Ready Stock saat ini.</p>
          <Link href="/katalog" className="mt-4 text-blue-600 font-semibold hover:underline">
            Lihat Semua Katalog &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
