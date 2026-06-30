import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const result = await prisma.product.deleteMany({
        where: {
            name: {
                startsWith: "Produk Baru:"
            }
        }
    });

    console.log(`Deleted ${result.count} placeholder products.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
