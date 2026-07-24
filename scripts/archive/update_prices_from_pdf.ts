import { PrismaClient } from '@prisma/client';
import Decimal from 'decimal.js';

const prisma = new PrismaClient();

// Data harga dari PDF "Stock Juni 2026 - PT Attekno Solusi Indonesia"
// Harga jual = harga beli / 0.85
// Hanya produk yang ada model-nya di database yang di-update

const supplierPrices: { model: string; buyPrice: number; note?: string }[] = [
  // === ACZET ===
  { model: 'CY285C', buyPrice: 80_952_300, note: 'Analytical Balance CY285C' },
  { model: 'CY 223', buyPrice: 24_031_500, note: 'Precision Balance CY 223' },

  // === AELAB ===
  { model: 'AE-MA08', buyPrice: 832_500, note: 'Micropipette Single Channel 100-1000μl (Non Sterile)' },
  { model: 'AE-MB05', buyPrice: 1_831_500, note: 'Micropipette Single Channel 10-100μl (Fully Autoclave)' },
  { model: 'AE-8M50', buyPrice: 4_535_932, note: '8-channels Adjustable Volume Pipettes 5-50μL' },
  { model: 'PCR-1000', buyPrice: 72_649_500, note: 'PCR Cabinet PCR-1000' },
  { model: 'SK-O330-PRO', buyPrice: 33_244_500, note: 'Digital Orbital Shaker SK-O330-PRO' },

  // === LABEX ===
  { model: 'EUM-4001', buyPrice: 19_425_000, note: 'Biological Microscope EUM-4001' },

  // === MILWAUKEE ===
  { model: 'MW-150', buyPrice: 23_115_750, note: 'pH Meter MW-150 Max Milwaukee' },

  // === TAITEC ===
  { model: 'DTU-R', buyPrice: 41_167_125, note: 'Aluminum Block Bath DTU-R' },
  { model: 'MG-70C', buyPrice: 180_000_000, note: 'CO2 Incubator MG-70C' },
  { model: 'BR-23UM', buyPrice: 157_950_000, note: 'Incubator Shaker BR-23UM' },
  { model: 'BR-43FL', buyPrice: 196_553_250, note: 'Incubator Shaker BR-43FL' },
  { model: 'Se-04', buyPrice: 7_770_000, note: 'Vortex Mixer Delta Mixer Se-04' },

  // === YAMATO ===
  { model: 'IC113C', buyPrice: 22_755_000, note: 'Incubators Natural Convection IC113C' },
];

async function main() {
  console.log('=== Update Harga Produk dari PDF Stock Juni 2026 ===');
  console.log('=== Harga Jual = Harga Supplier / 0.85 ===\n');

  const divisor = new Decimal('0.85');
  let updated = 0;
  let notFound = 0;

  for (const item of supplierPrices) {
    const sellPrice = new Decimal(item.buyPrice).dividedBy(divisor).toDecimalPlaces(2);

    // Cari produk berdasarkan model (case-insensitive match)
    const product = await prisma.product.findFirst({
      where: {
        model: {
          equals: item.model,
          mode: 'insensitive',
        },
      },
      select: { id: true, name: true, model: true, price: true, brand: true },
    });

    if (!product) {
      console.log(`❌ TIDAK DITEMUKAN DI DB: Model "${item.model}" (${item.note})`);
      notFound++;
      continue;
    }

    const oldPrice = new Decimal(product.price.toString());

    await prisma.product.update({
      where: { id: product.id },
      data: { price: sellPrice },
    });

    console.log(
      `✅ [${product.brand}] ${product.model} | ${product.name}\n` +
      `   Harga Beli    : Rp ${item.buyPrice.toLocaleString('id-ID')}\n` +
      `   Harga Lama    : Rp ${oldPrice.toNumber().toLocaleString('id-ID')}\n` +
      `   Harga Jual    : Rp ${sellPrice.toNumber().toLocaleString('id-ID')}\n`
    );
    updated++;
  }

  console.log(`\n=== Selesai: ${updated} diperbarui, ${notFound} tidak ditemukan ===`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
