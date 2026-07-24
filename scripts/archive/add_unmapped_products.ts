import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const inputDir = path.join(process.cwd(), 'public/images/new product image');

async function main() {
    const files = fs.readdirSync(inputDir);
    let addedCount = 0;

    // Get all current product images to know which ones are already linked
    const existingProducts = await prisma.product.findMany({
        select: { image: true }
    });
    const linkedImages = new Set(existingProducts.map(p => p.image));

    for (const file of files) {
        if (file.endsWith('.webp')) {
            const imagePath = `/images/new product image/${encodeURIComponent(file)}`;
            
            // If this image is NOT linked to any product
            if (!linkedImages.has(imagePath)) {
                // Determine a temporary name based on file name
                const baseName = path.basename(file, '.webp');
                
                // Let's try to make a somewhat readable name
                let cleanName = baseName.replace(/[^a-zA-Z0-9 ]/g, ' ').trim();
                if (cleanName.length > 50) {
                    cleanName = cleanName.substring(0, 50) + '...';
                }
                
                const productName = `Produk Baru: ${cleanName}`;
                const slug = `new-product-${baseName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${Date.now()}`;
                
                console.log(`Adding new product for image: ${file}`);
                
                await prisma.product.create({
                    data: {
                        slug: slug,
                        name: productName,
                        category: "general-equipment",
                        categoryLabel: "General Equipment",
                        brand: "Unknown Brand",
                        model: `MOD-${Math.floor(Math.random() * 10000)}`,
                        subcategory: "Uncategorized",
                        image: imagePath,
                        description: `Produk baru yang ditambahkan dari gambar ${file}. Silakan ubah nama, model, dan deskripsi produk ini melalui halaman Admin.`,
                        price: 0,
                        isRequestPricing: true,
                        isReadyStock: false
                    }
                });
                
                addedCount++;
            }
        }
    }
    
    console.log(`Done. Added ${addedCount} new placeholder products.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
