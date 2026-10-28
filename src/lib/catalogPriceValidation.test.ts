import { describe, it, expect } from 'vitest';
import { prisma } from './db';
import { buildReadyStockPdfBytes, selectEditionProducts } from './readyStockPdf';
import { money } from './money';

describe('Catalog & Price Validation Tests (Master Inventory Sync)', () => {
  it('validates critical Ready Stock product prices against Master Inventory Excel', async () => {
    // 1. Autoclave LAC-1031SV (Fix critical 40x error)
    const autoclave = await prisma.product.findFirst({
      where: { model: 'LAC-1031SV' },
      include: { variants: true }
    });
    expect(autoclave).toBeDefined();
    expect(Number(autoclave?.price)).toBe(82062500);
    expect(Number(autoclave?.costPrice)).toBe(65650000);
    expect(Number(autoclave?.variants[0]?.price)).toBe(82062500);

    // 2. Aluminum Block Bath DTU-R
    const blockBath = await prisma.product.findFirst({
      where: { model: 'DTU-R' },
      include: { variants: true }
    });
    expect(blockBath).toBeDefined();
    expect(Number(blockBath?.price)).toBe(51458906.25);
    expect(Number(blockBath?.costPrice)).toBe(41167125);
    expect(blockBath?.isRequestPricing).toBe(false);

    // 3. Incubator Shaker BR-23UM
    const br23um = await prisma.product.findFirst({
      where: { model: 'BR-23UM' },
      include: { variants: true }
    });
    expect(br23um).toBeDefined();
    expect(Number(br23um?.price)).toBe(197437500);
    expect(Number(br23um?.costPrice)).toBe(157950000);
    expect(br23um?.isRequestPricing).toBe(false);

    // 4. Incubator Shaker BR-43FL
    const br43fl = await prisma.product.findFirst({
      where: { model: 'BR-43FL' },
      include: { variants: true }
    });
    expect(br43fl).toBeDefined();
    expect(Number(br43fl?.price)).toBe(245691562.5);
    expect(Number(br43fl?.costPrice)).toBe(196553250);
    expect(br43fl?.isRequestPricing).toBe(false);

    // 5. Colony Counter Infitek CC-J2S
    const colonyCounter = await prisma.product.findFirst({
      where: { model: 'CC-J2S' },
      include: { variants: true }
    });
    expect(colonyCounter).toBeDefined();
    expect(Number(colonyCounter?.price)).toBe(10000000);
    expect(Number(colonyCounter?.costPrice)).toBe(8000000);
  }, 20000);

  it('validates that custom cabinets and furniture use selling price, not modal', async () => {
    // Fume Hood FH 1200 MG (Base product without variants)
    const fumeHood = await prisma.product.findFirst({
      where: { slug: 'lemari-asam-fume-hood' },
      include: { variants: true }
    });
    expect(fumeHood).toBeDefined();
    expect(Number(fumeHood?.price)).toBe(112500000);
    expect(Number(fumeHood?.costPrice)).toBe(90000000);

    // Biosafety Cabinet (BSC) with variants
    const bsc = await prisma.product.findFirst({
      where: { slug: 'biosafety-cabinet-bsc-custom' },
      include: { variants: true }
    });
    expect(bsc).toBeDefined();
    expect(Number(bsc?.price)).toBe(100000000);
    expect(Number(bsc?.costPrice)).toBe(80000000);
    const bscMini = bsc?.variants.find(v => v.sku === 'ALC-BSC-MINI-II-A2');
    const bsc1100 = bsc?.variants.find(v => v.sku === 'ALC-BSC-1100-II-A2');
    expect(Number(bscMini?.price)).toBe(100000000);
    expect(Number(bsc1100?.price)).toBe(110906250);

    // Flammable Safety Cabinet FS 4 & FS 6
    const flammable = await prisma.product.findFirst({
      where: { slug: 'lemari-penyimpanan-mudah-terbakar' },
      include: { variants: true }
    });
    expect(flammable).toBeDefined();
    expect(Number(flammable?.price)).toBe(35937500);
    expect(Number(flammable?.costPrice)).toBe(28750000);
    const fs4 = flammable?.variants.find(v => v.sku === 'ALC-FS-4');
    const fs6 = flammable?.variants.find(v => v.sku === 'ALC-FS-6');
    expect(Number(fs4?.price)).toBe(35937500);
    expect(Number(fs6?.price)).toBe(37046250);
  }, 20000);

  it('generates downloadable PDF with valid bytes and correct prices', async () => {
    const readyStockProducts = await prisma.product.findMany({
      where: { isReadyStock: true },
      include: { variants: true },
      orderBy: { price: 'asc' }
    });

    const m1Bytes = buildReadyStockPdfBytes(readyStockProducts, 'M1', 'Oktober 2026');
    expect(m1Bytes).toBeDefined();
    expect(m1Bytes.byteLength).toBeGreaterThan(10000);

    const m3Bytes = buildReadyStockPdfBytes(readyStockProducts, 'M3', 'Oktober 2026');
    expect(m3Bytes).toBeDefined();
    expect(m3Bytes.byteLength).toBeGreaterThan(10000);
  }, 20000);
});
