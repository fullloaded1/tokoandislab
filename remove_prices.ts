import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const result = await prisma.product.updateMany({
        where: {
            category: "daihan-labtech",
            isReadyStock: true
        },
        data: {
            price: 0
        }
    });
    console.log(`Updated ${result.count} products. Prices set to 0.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  });
