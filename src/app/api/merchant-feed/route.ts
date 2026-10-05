import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SEO_CONSTANTS } from "@/constants/seo";
import { serializeProductDecimals } from "@/lib/products";
import { getReadyStockSummary } from "@/lib/readyStock";

export async function GET(req: NextRequest) {
  try {
    // Fetch all products that should be in the feed
    const products = await prisma.product.findMany({
      include: {
        variants: true,
      },
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>AndisLab - Peralatan Laboratorium</title>
    <link>${SEO_CONSTANTS.siteUrl}</link>
    <description>Katalog lengkap alat laboratorium, reagen, dan bahan kimia.</description>
`;

    for (const rawProduct of products) {
      const product = serializeProductDecimals(rawProduct);
      const summary = getReadyStockSummary(product as any);
      
      const link = `${SEO_CONSTANTS.siteUrl}/katalog/${product.slug}`;
      const imageLink = product.image.startsWith("http") ? product.image : `${SEO_CONSTANTS.siteUrl}${product.image}`;
      
      // Get stock and price
      const initialVariant = summary.firstAvailable ?? product.variants?.[0] ?? null;
      const availableStock = initialVariant ? initialVariant.stock - initialVariant.reservedStock : 0;
      
      const availability = availableStock > 0 ? "in_stock" : (product.isReadyStock ? "out_of_stock" : "preorder");
      const price = (!product.isRequestPricing && initialVariant?.price) ? `${initialVariant.price} IDR` : "";
      
      // Only include products with price in merchant center feed by default, or just include them without price (Google might complain).
      // Let's include them, but skip price tag if empty
      
      xml += `
    <item>
      <g:id>${product.slug}</g:id>
      <g:title>${encodeXML(product.name)}</g:title>
      <g:description>${encodeXML(product.description.substring(0, 500))}</g:description>
      <g:link>${link}</g:link>
      <g:image_link>${imageLink}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      ${price ? `<g:price>${price}</g:price>` : ''}
      <g:brand>${encodeXML(product.brand || product.categoryLabel)}</g:brand>
      ${product.model ? `<g:mpn>${encodeXML(product.model)}</g:mpn>` : ''}
    </item>`;
    }

    xml += `
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating merchant feed:", error);
    return new NextResponse("Error generating feed", { status: 500 });
  }
}

function encodeXML(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
