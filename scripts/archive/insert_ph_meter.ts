import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Menambahkan produk pH Meter Lovibond...");

    const product = await prisma.product.create({
        data: {
            name: "pH Meter Lovibond",
            slug: "ph-meter-lovibond",
            description: "Alat pengukur pH air presisi tinggi dari Lovibond, dirancang untuk analisis air di laboratorium dan lapangan. Menawarkan pengukuran yang cepat, akurat, dan mudah digunakan.",
            price: 0,
            image: "/images/new product image/SD10_20_30_40_Allst_rs_Multimedia_mb4.webp",
            model: "SD 50 pH",
            category: "lovibond",
            categoryLabel: "Lovibond",
            brand: "Lovibond",
            subcategory: "lovibond"
        }
    });

    console.log("Berhasil menambahkan:", product);
}

main().catch(console.error).finally(() => prisma.$disconnect());
