import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Menambahkan produk AndisLab Custom...");

    const products = [
        {
            slug: "biosafety-cabinet-bsc-custom",
            name: "Biosafety Cabinet (BSC) Custom",
            model: "BSC-AL-Custom",
            brand: "AndisLab Custom",
            category: "andislab-custom",
            categoryLabel: "AndisLab Custom",
            subcategory: "Safety Equipment",
            price: 0,
            isRequestPricing: true,
            isReadyStock: false,
            image: "", // Placeholder, can be updated later
            description: "Biosafety Cabinet (BSC) dirancang khusus untuk memberikan perlindungan tingkat tinggi bagi operator, sampel, dan lingkungan dari kontaminasi agen biologis. Ukuran, material, dan spesifikasi filter dapat disesuaikan (custom) dengan kebutuhan dan dimensi ruang laboratorium Anda."
        },
        {
            slug: "laminar-air-flow-laf-custom",
            name: "Laminar Air Flow (LAF) Custom",
            model: "LAF-AL-Custom",
            brand: "AndisLab Custom",
            category: "andislab-custom",
            categoryLabel: "AndisLab Custom",
            subcategory: "Clean Room Equipment",
            price: 0,
            isRequestPricing: true,
            isReadyStock: false,
            image: "", // Placeholder, can be updated later
            description: "Laminar Air Flow (LAF) berkualitas tinggi yang menyediakan area kerja ultra-bersih bebas partikel untuk melindungi produk atau kultur sel dari kontaminasi silang. Tersedia dalam tipe Vertical maupun Horizontal, dibuat sesuai dengan standar kebutuhan Anda."
        }
    ];

    for (const productData of products) {
        const product = await prisma.product.create({
            data: productData
        });
        console.log(`Berhasil menambahkan: ${product.name}`);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
