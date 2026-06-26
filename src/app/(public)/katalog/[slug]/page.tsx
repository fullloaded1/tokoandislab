import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

import { cache } from "react";
import { serializeProductDecimals } from "@/lib/products";
import { getReadyStockSummary } from "@/lib/readyStock";

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
      canonical: `https://www.andislab.com/katalog/${product.slug}`,
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

  // If STILL less than 3, grab ANY products just to fill the bundle UI
  if (relatedProducts.length < 3) {
    const fallbackProducts = (await prisma.product.findMany({
      where: {
        NOT: {
          id: {
            in: [product.id, ...relatedProducts.map(p => p.id)]
          }
        }
      },
      include: { variants: true },
      take: 3 - relatedProducts.length,
    })).map(serializeProductDecimals);
    relatedProducts = [...relatedProducts, ...fallbackProducts];
  }

  const summary = getReadyStockSummary(product as any);
  const initialVariant = summary.firstAvailable ?? product.variants?.[0] ?? null;
  const availableStock = initialVariant ? initialVariant.stock - initialVariant.reservedStock : 0;
  
  const availability = availableStock > 0 
    ? "https://schema.org/InStock" 
    : (product.isReadyStock ? "https://schema.org/OutOfStock" : "https://schema.org/PreOrder");

  const offers: any = {
    "@type": "Offer",
    url: `https://www.andislab.com/katalog/${product.slug}`,
    priceCurrency: "IDR",
    availability: availability,
    seller: {
      "@type": "Organization",
      name: "Andis Lab",
    },
  };

  if (!product.isRequestPricing && initialVariant?.price) {
    offers.price = initialVariant.price.toString();
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
              : `https://www.andislab.com${product.image}`,
            brand: {
              "@type": "Brand",
              name: product.brand || product.categoryLabel,
            },
            sku: initialVariant?.sku || product.slug,
            offers: offers,
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
