import { PrismaClient } from '@prisma/client';
import Decimal from 'decimal.js';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Fix 1: Buat variant Default untuk produk ready stock yang belum punya variant ===\n');

  const productsWithoutVariants = await prisma.product.findMany({
    where: {
      isReadyStock: true,
      variants: { none: {} },
    },
    select: { id: true, model: true, name: true, price: true, brand: true },
  });

  for (const p of productsWithoutVariants) {
    const sku = `${p.brand?.toUpperCase().replace(/\s+/g, '-') || 'GEN'}-${p.model.replace(/\s+/g, '-')}`;
    
    await prisma.productVariant.create({
      data: {
        productId: p.id,
        sku,
        name: 'Default',
        price: p.price,  // Gunakan harga produk yang sudah di-set (harga jual)
        stock: 5,
        reservedStock: 0,
        sortOrder: 0,
      },
    });

    console.log(`✅ Variant dibuat: [${p.brand}] ${p.model} | ${p.name} | SKU: ${sku} | Harga: Rp ${Number(p.price).toLocaleString('id-ID')}`);
  }

  console.log(`\n📦 ${productsWithoutVariants.length} variant baru dibuat.\n`);

  // === Fix 2: Update harga variant Daihan yang sudah ada ===
  console.log('=== Fix 2: Update harga variant Daihan ke harga jual (÷ 0.85) ===\n');

  const divisor = new Decimal('0.85');

  const daihanVariants = await prisma.productVariant.findMany({
    where: {
      product: { isReadyStock: true },
      sku: { startsWith: 'DH-' },
    },
    include: {
      product: { select: { model: true, name: true, price: true } },
    },
  });

  for (const v of daihanVariants) {
    // Harga variant saat ini = harga beli. Harga jual = harga beli / 0.85
    const oldVariantPrice = new Decimal(v.price.toString());
    const newVariantPrice = oldVariantPrice.dividedBy(divisor).toDecimalPlaces(2);

    // Hanya update kalau variant price belum sama dengan product price (belum di-update)
    const productPrice = new Decimal(v.product.price.toString());
    
    if (oldVariantPrice.equals(productPrice)) {
      console.log(`⏭️  ${v.product.model} | Variant "${v.name}" sudah sesuai product price, skip.`);
      continue;
    }

    await prisma.productVariant.update({
      where: { id: v.id },
      data: { price: newVariantPrice },
    });

    console.log(
      `✅ ${v.product.model} | Variant "${v.name}"\n` +
      `   Lama: Rp ${oldVariantPrice.toNumber().toLocaleString('id-ID')}\n` +
      `   Baru: Rp ${newVariantPrice.toNumber().toLocaleString('id-ID')}`
    );
  }

  console.log('\n=== Selesai! ===');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
