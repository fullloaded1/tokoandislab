import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: `${product.name} — AndisLab`,
    description: product.description,
  };
}

export default async function ProductDetailPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { specs: true }
  });

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, excluding current product)
  const relatedProducts = await prisma.product.findMany({
    where: { 
      category: product.category,
      NOT: { id: product.id }
    },
    take: 3,
  });

  return (
    <ProductDetailClient product={product as any} relatedProducts={relatedProducts as any} />
  );
}
