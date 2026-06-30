import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const inputDir = path.join(process.cwd(), 'public/images/new product image');

async function main() {
    const files = fs.readdirSync(inputDir);
    
    const fileToModel: Record<string, string> = {
        'SD10_20_30_40_Allstαrs_Multimedia_mb4.jpg': 'SD Series',
        'bd600_mb2_04.jpg': 'BOD',
        'beaker.jpg': 'Pyrex 1000',
        'et730_mb2_01.jpg': 'ET 730',
        'thermoreactors_rd-125-1_4_3nd.jpg': 'RD 125',
        'Lab-Glassware-1-100ml-Transfer-Volumetric-Pipette-Class-a-Measuring-Pipettes-Glass-Volumetric-Pipette-with-One-Mark.avif': 'Pyrex Pipette',
        'FLA7101.jpg': 'Pyrex Vol', // 7101 is volumetric flask
        'FLA40660.jpg': 'Pyrex 4980' // guessing Erlenmeyer
    };

    let updatedCount = 0;

    for (const file of files) {
        if (file === 'images.jpg' || file === '.DS_Store') continue;
        
        const ext = path.extname(file);
        const baseName = path.basename(file, ext);
        // Replace special characters to avoid URI issues
        const safeBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
        const webpName = `${safeBaseName}.webp`;
        const webpPath = path.join(inputDir, webpName);
        
        if (ext.toLowerCase() !== '.webp') {
            console.log(`Converting ${file} to WebP (high quality)...`);
            try {
                await sharp(path.join(inputDir, file))
                    .webp({ quality: 90 }) // High quality
                    .toFile(webpPath);
            } catch (err) {
                console.error(`Error converting ${file}:`, err);
                continue;
            }
        }
        
        const targetModel = fileToModel[file];
        if (targetModel) {
            const product = await prisma.product.findFirst({
                where: { model: targetModel }
            });
            if (product) {
                const newImagePath = `/images/new product image/${encodeURIComponent(webpName)}`;
                console.log(`Updating ${product.name} (${product.model}) with ${newImagePath}`);
                await prisma.product.update({
                    where: { id: product.id },
                    data: { image: newImagePath }
                });
                updatedCount++;
            }
        } else {
            // For unmapped ones, just log it. They are converted to WebP though.
            console.log(`Converted ${file} to WebP, but no specific product model mapping found.`);
        }
    }
    
    console.log(`Done. Converted images and updated ${updatedCount} products.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
