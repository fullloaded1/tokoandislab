import { PrismaClient } from '@prisma/client';
import Decimal from 'decimal.js';

const prisma = new PrismaClient();

function calculateNewPrice(original: number) {
  const target = original;
  
  let multiple = original > 100000 ? 10000 : 1000;
  
  let base = Math.floor(target / multiple) * multiple;
  let finalPrice = base + 700;
  
  if (finalPrice >= original) {
    finalPrice -= multiple;
  }
  
  return finalPrice;
}

async function main() {
  console.log('Memulai update harga Daihan menjadi berakhiran .700...');
  
  // Ambil semua produk yang memiliki variant dengan SKU diawali 'DH-'
  const daihanVariants = await prisma.productVariant.findMany({
    where: {
      sku: { startsWith: 'DH-' },
    },
    include: {
      product: { select: { id: true, name: true, brand: true, price: true } },
    },
  });

  const processedProducts = new Set();
  let updateCount = 0;

  for (const v of daihanVariants) {
    if (processedProducts.has(v.productId)) continue;
    
    const currentPrice = parseFloat(v.product.price.toString());
    const finalPrice = calculateNewPrice(currentPrice);
    const newPriceDecimal = new Decimal(finalPrice);
    
    // Update Product table
    await prisma.product.update({
      where: { id: v.productId },
      data: { price: newPriceDecimal }
    });

    // Update ProductVariant table
    await prisma.productVariant.updateMany({
      where: { productId: v.productId },
      data: { price: newPriceDecimal }
    });

    console.log(`✅ [${v.product.brand || 'Daihan'}] ${v.sku} | Rp ${finalPrice.toLocaleString('id-ID')}`);
    
    processedProducts.add(v.productId);
    updateCount++;
  }

  console.log(`\n🎉 Selesai! Berhasil memperbarui harga ${updateCount} produk Daihan beserta variant-nya di database.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
