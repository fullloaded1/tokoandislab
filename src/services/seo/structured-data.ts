import { SEO_CONSTANTS } from '@/constants/seo';
import { COMPANY_FACTS } from '@/lib/companyFacts';

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONSTANTS.organizationName,
    url: SEO_CONSTANTS.siteUrl,
    logo: `${SEO_CONSTANTS.siteUrl}/logo.png`,
    description: SEO_CONSTANTS.defaultDescription,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY_FACTS.streetAddress,
      addressLocality: COMPANY_FACTS.addressLocality,
      addressRegion: COMPANY_FACTS.addressRegion,
      postalCode: COMPANY_FACTS.postalCode,
      addressCountry: COMPANY_FACTS.addressCountry,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: COMPANY_FACTS.officePhoneInt,
      contactType: 'customer service',
      areaServed: 'ID',
      availableLanguage: 'Indonesian'
    }
  };
}

export function getProductSchema(product: {
  name: string;
  image: string;
  description: string;
  sku?: string;
  brand: string;
  price?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.image,
    description: product.description,
    sku: product.sku || '',
    brand: {
      '@type': 'Brand',
      name: product.brand
    },
    offers: {
      '@type': 'Offer',
      url: SEO_CONSTANTS.siteUrl,
      priceCurrency: 'IDR',
      price: product.price || 0,
      availability: 'https://schema.org/InStock'
    }
  };
}

export function getArticleSchema(article: {
  title: string;
  image?: string;
  publishedAt: string;
  modifiedAt: string;
  authorName: string;
  url: string;
  description: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    image: article.image ? [article.image] : [],
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt,
    author: {
      '@type': 'Person',
      name: article.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: SEO_CONSTANTS.organizationName,
      logo: {
        '@type': 'ImageObject',
        url: `${SEO_CONSTANTS.siteUrl}/logo.png`
      }
    },
    description: article.description,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url
    }
  };
}
