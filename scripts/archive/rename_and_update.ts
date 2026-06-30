import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const dir = "C:\\Users\\Ancimmm\\Documents\\tokoandis\\public\\images\\custom-lab-pdf";
    
    const bscOld = path.join(dir, "biosafety_cabinet_custom_clean.webp");
    const bscNew = path.join(dir, "biosafety_cabinet_custom_v2.webp");
    
    const lafOld = path.join(dir, "laminar_air_flow_custom_clean.webp");
    const lafNew = path.join(dir, "laminar_air_flow_custom_v2.webp");
    
    // Rename files
    if (fs.existsSync(bscOld)) {
        fs.renameSync(bscOld, bscNew);
        console.log("Renamed BSC image.");
    }
    
    if (fs.existsSync(lafOld)) {
        fs.renameSync(lafOld, lafNew);
        console.log("Renamed LAF image.");
    }

    // Update DB to bust Next.js cache
    await prisma.product.updateMany({
        where: { slug: "biosafety-cabinet-bsc-custom" },
        data: { image: "/images/custom-lab-pdf/biosafety_cabinet_custom_v2.webp" }
    });
    
    await prisma.product.updateMany({
        where: { slug: "laminar-air-flow-laf-custom" },
        data: { image: "/images/custom-lab-pdf/laminar_air_flow_custom_v2.webp" }
    });

    console.log("Database updated with new filenames to bypass cache.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
