import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateRequestPricing() {
  const productsToUpdate = await prisma.product.findMany({
    where: {
      isRequestPricing: true,
      price: { gt: 0 }
    }
  });

  console.log(`Found ${productsToUpdate.length} products with isRequestPricing=true but price > 0.`);
  for (const p of productsToUpdate) {
    console.log(`Setting isRequestPricing=false for [${p.name}] (${p.model}) - Price: Rp ${Number(p.price).toLocaleString('id-ID')}`);
  }

  const result = await prisma.product.updateMany({
    where: {
      isRequestPricing: true,
      price: { gt: 0 }
    },
    data: {
      isRequestPricing: false
    }
  });

  console.log(`Updated ${result.count} products.`);
}

updateRequestPricing()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
