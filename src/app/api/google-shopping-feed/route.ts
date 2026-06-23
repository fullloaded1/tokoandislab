import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function escapeXml(unsafe: string) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isReadyStock: true,
        isRequestPricing: false,
      },
      include: {
        variants: true,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tokoandislab.com';

    const itemsXml = products.map((product) => {
      // Calculate stock
      const totalStock = product.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
      const availability = totalStock > 0 ? 'in_stock' : 'out_of_stock';
      
      // Format price
      const priceStr = product.price ? product.price.toString() : '0';
      const formattedPrice = `${priceStr} IDR`;
      
      const imageUrl = product.image?.startsWith('http') 
        ? product.image 
        : `${baseUrl}${product.image?.startsWith('/') ? '' : '/'}${product.image}`;

      return `
    <item>
      <g:id>${escapeXml(product.slug)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.description || product.name)}</g:description>
      <g:link>${baseUrl}/katalog/${product.slug}</g:link>
      <g:image_link>${escapeXml(imageUrl || '')}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${formattedPrice}</g:price>
      <g:brand>${escapeXml(product.brand)}</g:brand>
      <g:mpn>${escapeXml(product.model)}</g:mpn>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
    }).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>TokoAndisLab Product Feed</title>
    <link>${baseUrl}</link>
    <description>Google Shopping Product Feed for TokoAndisLab</description>
${itemsXml}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating Google Shopping Feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
