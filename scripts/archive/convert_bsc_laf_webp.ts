import sharp from 'sharp';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const dir = "C:\\Users\\Ancimmm\\Documents\\tokoandis\\public\\images\\custom-lab-pdf";
    
    // Paths
    const lafInput = path.join(dir, "page7_img1.jpeg");
    const bscInput = path.join(dir, "page8_img1.png");
    
    const lafOutputName = "laminar_air_flow_custom.webp";
    const bscOutputName = "biosafety_cabinet_custom.webp";
    
    const lafOutput = path.join(dir, lafOutputName);
    const bscOutput = path.join(dir, bscOutputName);
    
    console.log("Converting LAF...");
    // Upscale LAF slightly since it's 336x401, let's make it 800px wide
    await sharp(lafInput)
        .resize(800, null, { withoutEnlargement: false, kernel: 'lanczos3' })
        .webp({ quality: 90 })
        .toFile(lafOutput);
        
    console.log("Converting BSC...");
    // BSC is already 1073x1080
    await sharp(bscInput)
        .webp({ quality: 90 })
        .toFile(bscOutput);
        
    // Update DB
    console.log("Updating database...");
    await prisma.product.updateMany({
        where: { slug: "laminar-air-flow-laf-custom" },
        data: { image: `/images/custom-lab-pdf/${lafOutputName}` }
    });
    
    await prisma.product.updateMany({
        where: { slug: "biosafety-cabinet-bsc-custom" },
        data: { image: `/images/custom-lab-pdf/${bscOutputName}` }
    });
    
    console.log("Selesai!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
