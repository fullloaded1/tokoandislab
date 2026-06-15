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
    <Suspense fallback={<KatalogLoading />}>
      <KatalogClient initialProducts={products as any} />
    </Suspense>
  );
}
