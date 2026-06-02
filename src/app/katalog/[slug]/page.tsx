import { notFound } from "next/navigation";
import { products, getProductBySlug, getRelatedProducts } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
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
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product.relatedSlugs);

  return (
    <ProductDetailClient product={product} relatedProducts={relatedProducts} />
  );
}
