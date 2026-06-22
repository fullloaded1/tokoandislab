import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import Decimal from 'decimal.js';

const prisma = new PrismaClient();

function calculateNewPrice(originalStr: string) {
  const original = parseInt(originalStr.replace(/,/g, ''), 10);
  const target = original * 0.99;
  
  let multiple = original > 100000 ? 10000 : 1000;
  
  let base = Math.floor(target / multiple) * multiple;
  let finalPrice = base + 700;
  
  if (finalPrice >= original) {
    finalPrice -= multiple;
  }
  
  return finalPrice;
}

async function main() {
  console.log('Memulai update harga produk...');
  const text = fs.readFileSync('scratch/pdf_content.txt', 'utf-8');

  // Cari produk yang ditambahkan baru-baru ini
  const products = await prisma.product.findMany({
    where: {
      createdAt: { gte: new Date('2026-06-10') }
    },
    select: {
      id: true,
      name: true,
      model: true,
      brand: true,
      price: true
    }
  });

  let updateCount = 0;

  for (const p of products) {
    if (!p.model) continue;
    
    // Cari posisi model di dalam text PDF
    const modelIndex = text.indexOf(p.model);
    if (modelIndex === -1) continue;
    
    const afterModelText = text.substring(modelIndex);
    const priceMatch = afterModelText.match(/\b\d{1,3}(,\d{3})+\b/);
    
    if (priceMatch) {
      const pdfPriceStr = priceMatch[0];
      const finalPrice = calculateNewPrice(pdfPriceStr);
      const newPriceDecimal = new Decimal(finalPrice);
      
      // Update Product table
      await prisma.product.update({
        where: { id: p.id },
        data: { price: newPriceDecimal }
      });

      // Update ProductVariant table (agar harga variant juga ikut berubah)
      await prisma.productVariant.updateMany({
        where: { productId: p.id },
        data: { price: newPriceDecimal }
      });

      console.log(`✅ [${p.brand}] ${p.model} | Rp ${finalPrice.toLocaleString('id-ID')}`);
      updateCount++;
    }
  }

  console.log(`\n🎉 Selesai! Berhasil memperbarui harga ${updateCount} produk beserta variant-nya di database.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
