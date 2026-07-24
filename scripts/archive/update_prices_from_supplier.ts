import { PrismaClient } from '@prisma/client';
import Decimal from 'decimal.js';

const prisma = new PrismaClient();

// Data harga dari supplier (gambar) — harga beli
// Harga jual = harga beli / 0.85
const supplierPrices: { model: string; buyPrice: number }[] = [
  { model: 'LOM-205RM', buyPrice: 6_000_000 },
  { model: 'LOM-210RM', buyPrice: 9_900_000 },
  { model: 'LWB-211A', buyPrice: 4_450_000 },
  { model: 'LWD-104S', buyPrice: 8_400_000 },   // S/S BASIC WATER STILL
  { model: 'GMC-361', buyPrice: 3_000_000 },
  { model: 'LBH-T02', buyPrice: 6_000_000 },
  { model: 'LDO-060E', buyPrice: 11_600_000 },
  { model: 'LDO-030E', buyPrice: 10_400_000 },
  { model: 'LDO-080F', buyPrice: 18_400_000 },
  // LWD-104S sudah ada di atas, ini yang kedua WATER STILL — sama model di DB
  { model: 'LCO-065AI', buyPrice: 63_850_000 },
  { model: 'LCO-165AI', buyPrice: 70_250_000 },
  { model: 'LAC-1011SV', buyPrice: 47_300_000 },
  { model: 'LAC-1021SV', buyPrice: 53_300_000 },
  { model: 'LAC-1031SV', buyPrice: 65_650_000 },
  { model: 'LAC-1031SVF', buyPrice: 69_850_000 },
  { model: 'LCV-203GR', buyPrice: 57_900_000 },
  { model: 'LDF-9015S', buyPrice: 115_050_000 },
  { model: 'LDF-9010U', buyPrice: 111_350_000 },
  { model: 'LDF-9020U', buyPrice: 131_700_000 },
  { model: 'LDF-9110C', buyPrice: 97_400_000 },
  { model: 'LLF-403SR', buyPrice: 63_900_000 },
];

async function main() {
  console.log('=== Update Harga Produk (Harga Supplier / 0.85) ===\n');

  const divisor = new Decimal('0.85');
  let updated = 0;
  let notFound = 0;

  for (const item of supplierPrices) {
    const sellPrice = new Decimal(item.buyPrice).dividedBy(divisor).toDecimalPlaces(2);

    // Cari produk berdasarkan model
    const product = await prisma.product.findFirst({
      where: { model: item.model },
      select: { id: true, name: true, model: true, price: true },
    });

    if (!product) {
      console.log(`❌ TIDAK DITEMUKAN: Model "${item.model}"`);
      notFound++;
      continue;
    }

    const oldPrice = new Decimal(product.price.toString());

    await prisma.product.update({
      where: { id: product.id },
      data: { price: sellPrice },
    });

    console.log(
      `✅ ${product.model} | ${product.name}\n` +
      `   Harga Beli : Rp ${item.buyPrice.toLocaleString('id-ID')}\n` +
      `   Harga Lama : Rp ${oldPrice.toNumber().toLocaleString('id-ID')}\n` +
      `   Harga Baru : Rp ${sellPrice.toNumber().toLocaleString('id-ID')}\n`
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
