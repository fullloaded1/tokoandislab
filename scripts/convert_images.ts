import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const inputDir = path.join(process.cwd(), 'public/images/daihanreadystock');

async function main() {
    const files = fs.readdirSync(inputDir);
    
    for (const file of files) {
        if (file === 'images.jpg') continue; // Skip non-product images
        
        const ext = path.extname(file);
        const baseName = path.basename(file, ext);
        const webpName = `${baseName}.webp`;
        const webpPath = path.join(inputDir, webpName);
        
        // Convert to webp if it's not already webp
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
        } else {
            console.log(`File ${file} is already WebP.`);
        }
        
        // Match product by extracting model name from start
        // "LAC-1021SV AUTOCLAVE" -> "LAC-1021SV"
        const modelMatch = baseName.match(/^([A-Z0-9-]+)/);
        if (modelMatch) {
            const model = modelMatch[1];
            // Find and update the corresponding product in DB
            const product = await prisma.product.findFirst({
                where: { model: model }
            });
            
            if (product) {
                // Check if image path is already correct
                const newImagePath = `/images/daihanreadystock/${encodeURIComponent(webpName)}`;
                if (product.image !== newImagePath) {
                    console.log(`Updating product ${model} image to ${newImagePath}`);
                    await prisma.product.update({
                        where: { id: product.id },
                        data: { image: newImagePath }
                    });
                }
            } else {
                console.log(`Product model ${model} not found in DB.`);
            }
        }
    }
    console.log("Image conversion and database update complete.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
