import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

import { cache } from "react";
import { serializeProductDecimals } from "@/lib/products";

// Memoize the product fetch so it's only executed once per request
const getProduct = cache(async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { specs: true, variants: true }
  });
  return serializeProductDecimals(product);
});

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Jual Alat Laboratorium — AndisLab`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Jual Alat Laboratorium — AndisLab`,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: `${product.name} - AndisLab`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Jual Alat Laboratorium — AndisLab`,
      description: product.description,
      images: [product.image],
    },
    alternates: {
      canonical: `https://andislabs.com/katalog/${product.slug}`,
    },
  };
}

export default async function ProductDetailPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  // Fetch variants concurrently with related products
  const [variants, relatedProductsBase] = await Promise.all([
    prisma.product.findMany({
      where: {
        name: product.name,
        brand: product.brand,
      },
      select: {
        id: true,
        slug: true,
        model: true,
        subcategory: true,
      },
      orderBy: {
        model: 'asc'
      }
    }),
    prisma.product.findMany({
      where: { 
        category: product.category,
        subcategory: product.subcategory,
        NOT: { id: product.id }
      },
      include: { variants: true },
      take: 3,
    }).then(prods => prods.map(serializeProductDecimals))
  ]);

  let relatedProducts = relatedProductsBase;

  // If we don't have enough from the same subcategory, fallback to the same category
  if (relatedProducts.length < 3) {
    const additionalProducts = (await prisma.product.findMany({
      where: {
        category: product.category,
        NOT: {
          id: {
            in: [product.id, ...relatedProducts.map(p => p.id)]
          }
        }
      },
      include: { variants: true },
      take: 3 - relatedProducts.length,
    })).map(serializeProductDecimals);
    relatedProducts = [...relatedProducts, ...additionalProducts];
  }

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
      <ProductDetailClient 
        product={product as any} 
        relatedProducts={relatedProducts as any}
        variants={variants}
      />
    </>
  );
}
