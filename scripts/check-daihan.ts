import { PrismaClient } from '@prisma/client';
import Decimal from 'decimal.js';

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
  if (products.length > 0) {
    console.log(products[0].name, products[0].price.toString(), products[0].brand);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
