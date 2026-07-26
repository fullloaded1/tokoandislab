import { MetadataRoute } from 'next';
import { SEO_CONSTANTS } from '@/constants/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/inquiry/success', '/*?wa=open*'],
      },
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'Bingbot'],
        allow: '/',
      }
    ],
    sitemap: `${SEO_CONSTANTS.siteUrl}/sitemap.xml`,
  }
}
