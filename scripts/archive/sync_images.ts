import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Get all products that are ready stock and from daihan
    const products = await prisma.product.findMany({
        where: {
            category: "daihan-labtech",
            isReadyStock: true
        }
    });

    const fallbackImage = "/images/daihanlabtechlogo.png";
    let updatedCount = 0;

    for (const product of products) {
        if (product.image === fallbackImage) {
            // Find another product with the same name that does NOT have the fallback image
            const sameNameProduct = await prisma.product.findFirst({
                where: {
                    name: product.name,
                    category: product.category,
                    image: {
                        not: fallbackImage
                    }
                }
            });

            if (sameNameProduct) {
                console.log(`Updating ${product.model} (${product.name}) to use image from ${sameNameProduct.model}: ${sameNameProduct.image}`);
                await prisma.product.update({
                    where: { id: product.id },
                    data: { image: sameNameProduct.image }
                });
                updatedCount++;
            } else {
                console.log(`No reference image found for ${product.model} (${product.name})`);
            }
        }
    }

    console.log(`Done. Updated ${updatedCount} products with reference images.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
