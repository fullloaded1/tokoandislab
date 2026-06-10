import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany({
        select: {
            id: true,
            model: true,
            name: true,
            category: true,
            image: true
        }
    });

    for (const p of products) {
        console.log(`[${p.category}] Model: ${p.model} | Name: ${p.name} | Image: ${p.image}`);
    }
}

main().finally(() => prisma.$disconnect());
