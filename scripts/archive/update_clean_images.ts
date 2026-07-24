import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Updating database with clean images...");

    await prisma.product.updateMany({
        where: { slug: "laminar-air-flow-laf-custom" },
        data: { image: "/images/custom-lab-pdf/laminar_air_flow_custom_clean.webp" }
    });
    
    await prisma.product.updateMany({
        where: { slug: "biosafety-cabinet-bsc-custom" },
        data: { image: "/images/custom-lab-pdf/biosafety_cabinet_custom_clean.webp" }
    });

    console.log("Database updated.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
