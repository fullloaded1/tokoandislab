import { prisma } from "@/lib/db";
import AdminClient from "./AdminClient";
import { serializeProductDecimals } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serializedProducts = products.map(serializeProductDecimals);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminClient initialProducts={serializedProducts as any} />
      </div>
    </div>
  );
}
