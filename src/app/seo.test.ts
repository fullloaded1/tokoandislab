import { describe, it, expect, vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Inter: () => ({
    variable: '--font-inter',
  }),
}));
import { metadata as rootMetadata } from './layout';
import { metadata as homeMetadata } from './(public)/page';
import { generateMetadata as generateKatalogMetadata } from './(public)/katalog/page';
import { metadata as readyStockMetadata } from './(public)/ready-stock/page';
import { metadata as pemerintahMetadata } from './(public)/pemerintah/page';
import { metadata as daihanMetadata } from './(public)/daihan-labtech/page';
import { metadata as promoMerdekaMetadata } from './(public)/promo-merdeka/page';
import { metadata as kebijakanMetadata } from './(public)/kebijakan-privasi/page';
import { metadata as syaratMetadata } from './(public)/syarat-ketentuan/page';
import { metadata as checkoutMetadata } from './(public)/checkout/page';

describe('SEO Metadata & OpenGraph Verification', () => {
  it('root layout has valid metadataBase and OpenGraph fallback', () => {
    expect(rootMetadata.metadataBase?.toString()).toBe('https://www.andislab.com/');
    expect(rootMetadata.openGraph?.images).toBeDefined();
    expect(rootMetadata.alternates?.canonical).toBe('https://www.andislab.com');
  });

  it('all primary public pages have canonical alternates defined', async () => {
    expect(homeMetadata.alternates?.canonical).toBe('/');
    const katalogMetadata = await generateKatalogMetadata({ searchParams: Promise.resolve({}) } as any);
    expect(katalogMetadata.alternates?.canonical).toBe('/katalog');
    expect(readyStockMetadata.alternates?.canonical).toBe('/ready-stock');
    expect(pemerintahMetadata.alternates?.canonical).toBe('/pemerintah');
    expect(daihanMetadata.alternates?.canonical).toBe('/daihan-labtech');
    expect(promoMerdekaMetadata.alternates?.canonical).toBe('/promo-merdeka');
    expect(kebijakanMetadata.alternates?.canonical).toBe('/kebijakan-privasi');
    expect(syaratMetadata.alternates?.canonical).toBe('/syarat-ketentuan');
    expect(checkoutMetadata.alternates?.canonical).toBe('/checkout');
  });

  it('all key landing pages have explicit OpenGraph and Twitter tags', async () => {
    const katalogMetadata = await generateKatalogMetadata({ searchParams: Promise.resolve({}) } as any);
    const pages = [homeMetadata, katalogMetadata, readyStockMetadata, pemerintahMetadata, daihanMetadata, promoMerdekaMetadata];
    for (const pageMeta of pages) {
      expect(pageMeta.openGraph).toBeDefined();
      expect(pageMeta.openGraph?.title).toBeTruthy();
      expect(pageMeta.openGraph?.description).toBeTruthy();
      expect(pageMeta.twitter).toBeDefined();
      expect((pageMeta.twitter as any)?.card).toBe('summary_large_image');
    }
  });
});
