import { PrismaClient, StockLogType } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function adjustStock({
  variantId,
  quantity,
  type,
  notes,
  actorId,
}: {
  variantId: string;
  quantity: number;
  type: StockLogType;
  notes?: string;
  actorId?: string;
}) {
  return await prisma.$transaction(async (tx) => {
    const variant = await tx.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new Error(`Variant dengan ID ${variantId} tidak ditemukan.`);
    }

    let newStock = variant.stock;
    if (type === StockLogType.IN) {
      newStock += quantity;
    } else if (type === StockLogType.OUT) {
      newStock -= quantity;
    } else if (type === StockLogType.ADJUST) {
      newStock = quantity;
    }

    if (newStock < 0) {
      throw new Error(`Koreksi ditolak: Stok tidak boleh minus. Sisa stok: ${variant.stock}`);
    }

    const updatedVariant = await tx.productVariant.update({
      where: { id: variantId },
      data: { stock: newStock },
    });

    await tx.stockLog.create({
      data: {
        variantId,
        type,
        quantity: type === StockLogType.ADJUST ? quantity : Math.abs(quantity),
        notes: notes || null,
        actorId: actorId || null,
      },
    });

    return updatedVariant;
  });
}

async function main() {
  const ateknoText = fs.readFileSync('scratch/pdf_content.txt', 'utf-8');
  const daihanText = fs.readFileSync('scratch/daihan_pdf_content.txt', 'utf-8');

  const products = await prisma.product.findMany({
    include: { variants: true }
  });

  let count = 0;

  for (const p of products) {
    if (!p.model) continue;

    let targetQty: number | null = null;
    let source = '';

    // Check Daihan text first
    const daihanIdx = daihanText.indexOf(p.model);
    if (daihanIdx !== -1) {
       const afterModel = daihanText.substring(daihanIdx, daihanIdx + 200);
       const match = afterModel.match(/\n\s*(\d+)\s*\n\s*EA\s*\n/);
       if (match) {
         targetQty = parseInt(match[1], 10);
         source = 'Daihan PDF';
       }
    }

    // If not Daihan, check Atekno
    if (targetQty === null) {
      const ateknoIdx = ateknoText.indexOf(p.model);
      if (ateknoIdx !== -1) {
         const afterModel = ateknoText.substring(ateknoIdx, ateknoIdx + 300);
         const match = afterModel.match(/\n\s*(\d+)\s*\n\s*(Unit|Case|Bag|Pcs|Rack)\s*\n/i);
         if (match) {
           targetQty = parseInt(match[1], 10);
           source = 'Atekno PDF';
         }
      }
    }

    if (targetQty !== null && p.variants.length > 0) {
      // Adjust stock for all variants of this product that don't match the targetQty
      for (const variant of p.variants) {
        if (variant.stock === targetQty) continue;

        try {
          await adjustStock({
            variantId: variant.id,
            quantity: targetQty,
            type: StockLogType.ADJUST,
            notes: `Sync stock from ${source}`,
            actorId: undefined
          });
          console.log(`✅ [${p.brand}] ${p.model} (Variant ${variant.name}) | Stock adjusted to ${targetQty} (Source: ${source})`);
          count++;
        } catch (e) {
           console.error(`❌ Failed to adjust stock for ${p.model} (Variant ${variant.name}):`, e);
        }
      }
    }
  }

  console.log(`\n🎉 Successfully adjusted stock for ${count} product variants.`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
