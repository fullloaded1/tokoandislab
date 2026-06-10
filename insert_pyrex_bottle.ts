import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Menambahkan produk Pyrex Media Bottle...");

    const product = await prisma.product.create({
        data: {
            slug: "pyrex-screw-cap-media-bottle-500ml",
            name: "Botol Media Kaca (Screw Cap Media/Reagent Bottle) 500ml",
            model: "Pyrex 1395",
            brand: "Pyrex",
            category: "pyrex",
            categoryLabel: "Pyrex Glassware",
            subcategory: "General Glassware",
            price: 0,
            isRequestPricing: true,
            isReadyStock: false,
            image: "/images/new product image/pyrex-screw-cap-media-bottle.webp",
            description: "Botol reagen / media kaca bening berkapasitas 500ml dengan tutup ulir (screw cap) biru dari bahan Polypropylene yang tahan panas. Memiliki skala graduasi yang jelas. Sangat ideal untuk pencampuran, penyimpanan bahan kimia, dan sterilisasi autoklaf (hingga 140°C)."
        }
    });

    console.log(`Berhasil menambahkan: ${product.name}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
