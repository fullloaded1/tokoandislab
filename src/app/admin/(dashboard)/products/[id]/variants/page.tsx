import { prisma } from "@/lib/db";
import VariantsClient from "./VariantsClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductVariantsPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    select: { id: true, name: true, brand: true, model: true }
  });

  if (!product) {
    return notFound();
  }

  const variants = await prisma.productVariant.findMany({
    where: { productId: params.id },
    orderBy: { name: "asc" },
    include: {
      stockLogs: {
        orderBy: { createdAt: "desc" },
        take: 5
      }
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VariantsClient initialVariants={variants as any} product={product} />
      </div>
    </div>
  );
}
