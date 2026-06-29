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

  const stockStatus = availableStock > 0 ? "ready stock" : (product.isReadyStock ? "habis" : "pre-order");
  const priceDisplay = offers.price ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(offers.price)) : "Minta Penawaran";
  const kapsulJawaban = `${product.name} adalah perangkat ${product.subcategory || 'laboratorium'} dari kategori ${product.categoryLabel}. Saat ini produk berstatus ${stockStatus} dengan estimasi pengiriman ${product.leadTime || 'standar'}, ditawarkan dengan harga ${priceDisplay}. Kami menyediakan layanan kirim cepat Jabodetabek, garansi resmi, dan kelengkapan COA (Certificate of Analysis) tersedia.`;

  const faqData = [
    {
      question: `Apakah ${product.name} tersedia ready stock?`,
      answer: `Saat ini, ${product.name} berstatus ${stockStatus}${availableStock > 0 ? ` dengan sisa stok ${availableStock} unit` : ''}.`
    },
    {
      question: `Berapa lama estimasi pengiriman untuk alat ini?`,
      answer: `Estimasi pengiriman atau lead time untuk produk ini adalah ${product.leadTime || 'sesuai standar pengiriman kami'}.`
    },
    {
      question: `Apakah melayani pembelian untuk pengadaan pemerintah atau e-Katalog?`,
      answer: `Ya, PT Andis Sentral Laboratorium mendukung pengadaan barang untuk instansi pemerintah, universitas, maupun industri melalui mekanisme resmi dan e-Katalog.`
    },
    {
      question: `Apakah produk ini disertai garansi dan sertifikat?`,
      answer: `Tentu, setiap pembelian alat laboratorium di AndisLab disertai dengan garansi resmi dan Certificate of Analysis (COA) bila tersedia.`
    }
  ];

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
            dateModified: new Date(product.updatedAt).toISOString()
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map(faq => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer
              }
            }))
          }),
        }}
      />
      <ProductDetailClient 
        product={product as any} 
        relatedProducts={relatedProducts as any}
        variants={variants}
      >
        <div className="mb-10 text-slate-700">
          {/* 1. Kapsul Jawaban */}
          <p className="text-base leading-relaxed mb-8">
            {kapsulJawaban}
          </p>

          {/* 2. Tabel Spesifikasi */}
          <h2 className="text-xl font-bold mb-4 text-slate-900">Spesifikasi Singkat {product.name}</h2>
          <div className="overflow-x-auto mb-10">
            <table className="w-full text-left text-sm border-collapse border border-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 border border-slate-200 font-bold text-slate-700">Atribut</th>
                  <th className="px-4 py-3 border border-slate-200 font-bold text-slate-700">Detail</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 border border-slate-200 font-semibold">Merek / Brand</td>
                  <td className="px-4 py-3 border border-slate-200">{product.brand || product.categoryLabel}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 border border-slate-200 font-semibold">Model / Tipe</td>
                  <td className="px-4 py-3 border border-slate-200">{product.model || '-'}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 border border-slate-200 font-semibold">Kategori</td>
                  <td className="px-4 py-3 border border-slate-200">{product.categoryLabel}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 border border-slate-200 font-semibold">Lead Time</td>
                  <td className="px-4 py-3 border border-slate-200">{product.leadTime || '-'}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 border border-slate-200 font-semibold">Ketersediaan Stok</td>
                  <td className="px-4 py-3 border border-slate-200">{availableStock > 0 ? `${availableStock} unit` : stockStatus}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 3. FAQ */}
          <h2 className="text-xl font-bold mb-4 text-slate-900">Pertanyaan yang Sering Diajukan (FAQ)</h2>
          <div className="space-y-4 mb-8">
            {faqData.map((faq, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm mb-1">{faq.question}</h3>
                <p className="text-sm text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* 5. Diperbarui */}
          <div className="text-xs text-slate-400 font-medium">
            Diperbarui: {new Date(product.updatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </ProductDetailClient>
    </>
  );
}
