import { PrismaClient, Prisma } from '@prisma/client';
import Decimal from 'decimal.js';

const prisma = new PrismaClient();

interface PriceUpdate {
  productId: string;
  slug: string;
  name: string;
  newPrice: Decimal;
  newCostPrice: Decimal;
  excelNo: number;
  excelName: string;
  variantUpdates: Array<{
    sku: string;
    newPrice: Decimal;
  }>;
}

const updates: PriceUpdate[] = [
  // 1. AUTOCLAVE LAC-1031SV (Fix severe 40x error: was 2,289,375 -> should be 82,062,500)
  {
    productId: 'cmq7kdv5s000dvzuk8m6f8ded',
    slug: 'daihan-lac-1031sv-autoclave',
    name: 'AUTOCLAVE',
    newPrice: new Decimal('82062500'),
    newCostPrice: new Decimal('65650000'),
    excelNo: 124,
    excelName: 'Autoclave LAC-1031SV',
    variantUpdates: [
      { sku: 'DH-LAC-1031SV', newPrice: new Decimal('82062500') }
    ]
  },
  // 2. Incubator Shaker BR-23UM (was 88,942,218.75 -> should be 197,437,500)
  {
    productId: 'cmqabuz0p0020vzasdvvupk1w',
    slug: 'incubator-shaker-br-23um-taitec',
    name: 'Incubator Shaker BR-23UM',
    newPrice: new Decimal('197437500'),
    newCostPrice: new Decimal('157950000'),
    excelNo: 61,
    excelName: 'Incubator Shaker BR-23UM',
    variantUpdates: [
      { sku: 'TAITEC-BR-23UM', newPrice: new Decimal('197437500') }
    ]
  },
  // 3. Incubator Shaker BR-43FL (was 88,942,218.75 -> should be 245,691,562.50)
  {
    productId: 'cmqabv0pp0026vzas0l2lo9hs',
    slug: 'incubator-shaker-br-43fl-taitec',
    name: 'Incubator Shaker BR-43FL',
    newPrice: new Decimal('245691562.50'),
    newCostPrice: new Decimal('196553250'),
    excelNo: 64,
    excelName: 'Incubator Shaker BR-43FL',
    variantUpdates: [
      { sku: 'TAITEC-BR-43FL', newPrice: new Decimal('245691562.50') }
    ]
  },
  // 4. Aluminum Block Bath DTU-R (was 36,380,250 -> should be 51,458,906.25)
  {
    productId: 'cmqabuuz2001nvzasmzxgp14n',
    slug: 'aluminum-block-bath-dtu-r-taitec',
    name: 'Aluminum Block Bath',
    newPrice: new Decimal('51458906.25'),
    newCostPrice: new Decimal('41167125'),
    excelNo: 52,
    excelName: 'Aluminum Block Bath DTU-R',
    variantUpdates: [
      { sku: 'TAITEC-DTU-R', newPrice: new Decimal('51458906.25') }
    ]
  },
  // 5. Colony Counter Infitek CC-J2S (was 12,500,000 -> should be 10,000,000)
  {
    productId: 'cmt0y6njn000pvzs0ny3ulyys',
    slug: 'infitek-colony-counter-cc-j2s',
    name: 'Colony Counter Infitek CC-J2S',
    newPrice: new Decimal('10000000'),
    newCostPrice: new Decimal('8000000'),
    excelNo: 157,
    excelName: 'Colony Counter Infitek CC-J2S',
    variantUpdates: [
      { sku: 'INFITEK-CC-J2S', newPrice: new Decimal('10000000') }
    ]
  },
  // 6. Universal Drying Oven LDO-030E (was 14,500,000 -> should be 13,000,000)
  {
    productId: 'cmq7kdmyr0007vzukjckk7iwu',
    slug: 'daihan-ldo-030e-oven',
    name: 'UNIVERSAL DRYING OVEN',
    newPrice: new Decimal('13000000'),
    newCostPrice: new Decimal('10400000'),
    excelNo: 118,
    excelName: 'Universal Drying Oven LDO-030E',
    variantUpdates: [
      { sku: 'DH-LDO-030E', newPrice: new Decimal('13000000') }
    ]
  },
  // 7. Buffer pH Meter pH 10 (was 10,532,812 -> should be 8,203,125)
  {
    productId: 'cmsyaq8zz0002vzyckt6n72i5',
    slug: 'buffer-ph-meter-ph-10',
    name: 'Buffer pH Meter pH 10',
    newPrice: new Decimal('8203125'),
    newCostPrice: new Decimal('6562500'),
    excelNo: 182,
    excelName: 'IONIX, pH 10 , pH/mV/Temp',
    variantUpdates: [
      { sku: 'STANDAR-PH-10', newPrice: new Decimal('8203125') }
    ]
  },
  // 8. Lemari Penyimpanan Mudah Terbakar (was 28,750,000 modal -> should be 35,937,500 selling)
  {
    productId: 'cmpxespv50030vz04gduhp920',
    slug: 'lemari-penyimpanan-mudah-terbakar',
    name: 'Lemari Penyimpanan Mudah Terbakar',
    newPrice: new Decimal('35937500'),
    newCostPrice: new Decimal('28750000'),
    excelNo: 142,
    excelName: 'Fumehood / Safety Cabinet FS 4',
    variantUpdates: [
      { sku: 'ALC-FS-4', newPrice: new Decimal('35937500') },
      { sku: 'ALC-FS-6', newPrice: new Decimal('37046250') }
    ]
  },
  // 9. Lemari Asam (Fume Hood) FH (was 90,000,000 modal -> should be 112,500,000 selling)
  {
    productId: 'cmpxess33003evz04y3y05wr0',
    slug: 'lemari-asam-fume-hood-fh',
    name: 'Lemari Asam (Fume Hood) FH',
    newPrice: new Decimal('112500000'),
    newCostPrice: new Decimal('90000000'),
    excelNo: 141,
    excelName: 'Fume Hood FH 1200 MG',
    variantUpdates: [
      { sku: 'ALC-FH-Series', newPrice: new Decimal('112500000') }
    ]
  },
  // 10. Biosafety Cabinet (BSC) Kelas II Tipe A2 Custom (was 80,000,000 modal -> should be 100,000,000 selling)
  {
    productId: 'cmq7opart0000vzg8iinp8uuo',
    slug: 'biosafety-cabinet-bsc-custom',
    name: 'Biosafety Cabinet (BSC) Kelas II Tipe A2 Custom',
    newPrice: new Decimal('100000000'),
    newCostPrice: new Decimal('80000000'),
    excelNo: 132,
    excelName: 'Biosafety Cabinet BSC Mini II A2',
    variantUpdates: [
      { sku: 'ALC-BSC-MINI-II-A2', newPrice: new Decimal('100000000') },
      { sku: 'ALC-BSC-1100-II-A2', newPrice: new Decimal('110906250') },
      { sku: 'ALC-BSC-1400-II-A2', newPrice: new Decimal('124687500') },
      { sku: 'ALC-BSC-MINI-II-A2-P', newPrice: new Decimal('137500000') },
      { sku: 'ALC-BSC-1100-II-A2-P', newPrice: new Decimal('203437500') }
    ]
  },
  // 11. Laminar Air Flow (LAF) Vertikal Custom (was 50,000,000 modal -> should be 62,500,000 selling)
  {
    productId: 'cmq7opbl60001vzg8ey2fh2j9',
    slug: 'laminar-air-flow-laf-custom',
    name: 'Laminar Air Flow (LAF) Vertikal Custom',
    newPrice: new Decimal('62500000'),
    newCostPrice: new Decimal('50000000'),
    excelNo: 137,
    excelName: 'Laminar Air Flow LAF Mini V',
    variantUpdates: [
      { sku: 'ALC-LAF-MINI-V', newPrice: new Decimal('62500000') },
      { sku: 'ALC-LAF-1000-V', newPrice: new Decimal('76250000') },
      { sku: 'ALC-LAF-1400-V', newPrice: new Decimal('83875000') },
      { sku: 'ALC-LAF-MINI-V-D', newPrice: new Decimal('91250000') }
    ]
  },
  // 12. Wet Scrubber (Set CostPrice = 31,000,000, Price = 38,750,000)
  {
    productId: 'cmpxest75003lvz0450ry6dep',
    slug: 'wet-scrubber-anti-pencemaran',
    name: 'Wet Scrubber Anti Pencemaran',
    newPrice: new Decimal('38750000'),
    newCostPrice: new Decimal('31000000'),
    excelNo: 146,
    excelName: 'Wet Scrubber',
    variantUpdates: [
      { sku: 'ALC-WS-Series', newPrice: new Decimal('38750000') }
    ]
  },
  // 13. Flokulator Portabel FB-4S (Set CostPrice = 25,000,000, Price = 31,250,000)
  {
    productId: 'cmpxesqz70037vz04afeug999',
    slug: 'flokulator-portabel-fb-4s',
    name: 'Flokulator Portabel FB-4S',
    newPrice: new Decimal('31250000'),
    newCostPrice: new Decimal('25000000'),
    excelNo: 148,
    excelName: 'Flokulator',
    variantUpdates: [
      { sku: 'ALC-FB-4S', newPrice: new Decimal('31250000') }
    ]
  }
];

async function main() {
  console.log('=== MEMULAI SINKRONISASI HARGA DENGAN WORKSPACE DOWNLOADS ===\n');

  await prisma.$transaction(
    async (tx) => {
    for (const item of updates) {
      const current = await tx.product.findUnique({
        where: { id: item.productId },
        include: { variants: true }
      });

      if (!current) {
        console.warn(`Product not found: ${item.productId} (${item.slug})`);
        continue;
      }

      const oldPriceStr = current.price.toString();
      const oldCostStr = current.costPrice.toString();
      const newPriceStr = item.newPrice.toString();
      const newCostStr = item.newCostPrice.toString();

      console.log(`Updating [${current.name}] (Model: ${current.model})`);
      console.log(`  Price:     Rp ${Number(oldPriceStr).toLocaleString('id-ID')} -> Rp ${Number(newPriceStr).toLocaleString('id-ID')}`);
      console.log(`  CostPrice: Rp ${Number(oldCostStr).toLocaleString('id-ID')} -> Rp ${Number(newCostStr).toLocaleString('id-ID')}`);

      // 1. Update Product
      await tx.product.update({
        where: { id: item.productId },
        data: {
          price: new Prisma.Decimal(newPriceStr),
          costPrice: new Prisma.Decimal(newCostStr),
        }
      });

      // 2. Update Variants
      for (const vu of item.variantUpdates) {
        const v = current.variants.find(cv => cv.sku === vu.sku);
        if (v) {
          const vOldPrice = v.price.toString();
          const vNewPrice = vu.newPrice.toString();
          await tx.productVariant.update({
            where: { id: v.id },
            data: {
              price: new Prisma.Decimal(vNewPrice)
            }
          });
          console.log(`    Variant [${v.name}] (${vu.sku}): Rp ${Number(vOldPrice).toLocaleString('id-ID')} -> Rp ${Number(vNewPrice).toLocaleString('id-ID')}`);
        } else {
          // If no SKU match, check if there's only 1 variant and update it
          if (current.variants.length === 1) {
            const singleV = current.variants[0];
            await tx.productVariant.update({
              where: { id: singleV.id },
              data: {
                price: new Prisma.Decimal(vu.newPrice.toString())
              }
            });
            console.log(`    Single Variant [${singleV.name}]: -> Rp ${Number(vu.newPrice.toString()).toLocaleString('id-ID')}`);
          }
        }
      }

      // 3. Write AuditLog
      await tx.auditLog.create({
        data: {
          action: 'PRICE_CORRECTION',
          entityType: 'Product',
          entityId: item.productId,
          oldValue: JSON.stringify({ price: oldPriceStr, costPrice: oldCostStr }),
          newValue: JSON.stringify({ price: newPriceStr, costPrice: newCostStr }),
          notes: `Validasi & penyesuaian harga resmi dari Master Inventory ASL Excel #${item.excelNo} (${item.excelName}).`
        }
      });
    }
  },
  {
    maxWait: 15000,
    timeout: 60000,
  });

  console.log('\n=== SINKRONISASI SELESAI DENGAN SUKSES DI DALAM DB TRANSACTION ===');
}

main()
  .catch((e) => {
    console.error('Gagal melakukan sinkronisasi harga:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
