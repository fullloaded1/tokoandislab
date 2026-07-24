import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: {
      price: 700
    }
  });
  for (const p of products) {
    await prisma.product.update({
      where: { id: p.id },
      data: { price: 0 }
    });
    console.log(`Reverted price for product ${p.name} to 0`);
  }

  const variants = await prisma.productVariant.findMany({
    where: {
      price: 700
    }
  });
  for (const v of variants) {
    await prisma.productVariant.update({
      where: { id: v.id },
      data: { price: 0 }
    });
    console.log(`Reverted price for variant ${v.name} to 0`);
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
