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
    openGraph: {
      title: `${product.name} — AndisLab`,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — AndisLab`,
      description: product.description,
      images: [product.image],
    },
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.image.startsWith("http")
              ? product.image
              : `https://andislabs.com${product.image}`,
            brand: {
              "@type": "Brand",
              name: product.brand || product.categoryLabel,
            },
            sku: product.slug,
            offers: {
              "@type": "Offer",
              url: `https://andislabs.com/katalog/${product.slug}`,
              priceCurrency: "IDR",
              price: product.price,
              availability: "https://schema.org/InStock",
              seller: {
                "@type": "Organization",
                name: "Andis Lab",
              },
            },
          }),
        }}
      />
      <ProductDetailClient product={product as any} relatedProducts={relatedProducts as any} />
    </>
  );
}
