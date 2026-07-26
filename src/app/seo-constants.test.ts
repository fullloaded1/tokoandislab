import { describe, it, expect } from 'vitest';
import { SEO_CONSTANTS } from '@/constants/seo';
import { getOrganizationSchema, getProductSchema } from '@/services/seo';

describe('SEO Constants & Structured Data', () => {
  it('should have valid base SEO constants', () => {
    expect(SEO_CONSTANTS.siteUrl).toBeDefined();
    expect(SEO_CONSTANTS.siteUrl).toContain('http');
    expect(SEO_CONSTANTS.defaultTitle).toContain('AndisLab');
  });

  it('should generate valid organization schema', () => {
    const schema = getOrganizationSchema();
    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBe(SEO_CONSTANTS.organizationName);
    expect(schema.url).toBe(SEO_CONSTANTS.siteUrl);
    expect(schema.logo).toBe(`${SEO_CONSTANTS.siteUrl}/logo.png`);
  });

  it('should generate valid product schema', () => {
    const schema = getProductSchema({
      name: 'Test Product',
      image: 'test.jpg',
      description: 'A test product',
      brand: 'AndisLab',
      price: 1000000
    });
    
    expect(schema['@type']).toBe('Product');
    expect(schema.name).toBe('Test Product');
    expect(schema.brand.name).toBe('AndisLab');
    expect(schema.offers.price).toBe(1000000);
  });
});
