import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SEO_CONSTANTS } from '@/constants/seo';

export async function GET() {
  const articles = await (prisma as any).article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>${SEO_CONSTANTS.defaultTitle}</title>
        <link>${SEO_CONSTANTS.siteUrl}</link>
        <description>${SEO_CONSTANTS.defaultDescription}</description>
        <language>${SEO_CONSTANTS.locale.replace('_', '-')}</language>
        ${articles
          .map((article: any) => {
            return `
              <item>
                <title><![CDATA[${article.title}]]></title>
                <link>${SEO_CONSTANTS.siteUrl}/artikel/${article.slug}</link>
                <guid>${SEO_CONSTANTS.siteUrl}/artikel/${article.slug}</guid>
                <pubDate>${new Date(article.createdAt).toUTCString()}</pubDate>
                <description><![CDATA[${article.excerpt || ''}]]></description>
              </item>
            `;
          })
          .join('')}
      </channel>
    </rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
    },
  });
}
