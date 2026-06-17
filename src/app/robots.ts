import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/inquiry/success'],
    },
    sitemap: 'https://www.andislab.com/sitemap.xml',
  }
}
