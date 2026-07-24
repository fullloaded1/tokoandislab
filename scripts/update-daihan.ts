import { PrismaClient } from '@prisma/client';
import { Decimal } from 'decimal.js';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: {
      brand: {
        contains: 'daihan labtech',
        mode: 'insensitive'
      }
    },
    include: {
      variants: true
    }
  });

  console.log(`Found ${products.length} products for Daihan Labtech`);

  let updatedProducts = 0;
  let updatedVariants = 0;

  for (const product of products) {
    const p = new Decimal(product.price.toString());
    const increased = p.mul(1.15);
    const roundedDown = increased.div(1000).floor().mul(1000);
    const newPrice = roundedDown.plus(700);

    console.log(`Updating product ${product.name}: ${p.toString()} -> ${newPrice.toString()}`);

    await prisma.product.update({
      where: { id: product.id },
      data: { price: newPrice }
    });
    updatedProducts++;

    for (const variant of product.variants) {
      const vp = new Decimal(variant.price.toString());
      if (vp.gt(0)) {
        const increasedVar = vp.mul(1.15);
        const roundedDownVar = increasedVar.div(1000).floor().mul(1000);
        const newVarPrice = roundedDownVar.plus(700);

        console.log(`  Updating variant ${variant.name}: ${vp.toString()} -> ${newVarPrice.toString()}`);

        await prisma.productVariant.update({
          where: { id: variant.id },
          data: { price: newVarPrice }
        });
        updatedVariants++;
      }
    }
  }

  console.log(`Successfully updated ${updatedProducts} products and ${updatedVariants} variants.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
