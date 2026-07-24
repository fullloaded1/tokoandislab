import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const dir = "C:\\Users\\Ancimmm\\Documents\\tokoandis\\public\\images\\custom-lab-pdf";
    
    // Find largest image on page 7
    let maxLAFSize = 0;
    let lafFile = "";
    // Find largest image on page 8
    let maxBSCSize = 0;
    let bscFile = "";
    
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const stat = fs.statSync(path.join(dir, f));
        if (f.startsWith("page7_")) {
            if (stat.size > maxLAFSize) {
                maxLAFSize = stat.size;
                lafFile = f;
            }
        }
        if (f.startsWith("page8_")) {
            if (stat.size > maxBSCSize) {
                maxBSCSize = stat.size;
                bscFile = f;
            }
        }
    }
    
    console.log("LAF Image:", lafFile);
    console.log("BSC Image:", bscFile);
    
    if (lafFile) {
        await prisma.product.updateMany({
            where: { slug: "laminar-air-flow-laf-custom" },
            data: { image: `/images/custom-lab-pdf/${lafFile}` }
        });
    }
    
    if (bscFile) {
        await prisma.product.updateMany({
            where: { slug: "biosafety-cabinet-bsc-custom" },
            data: { image: `/images/custom-lab-pdf/${bscFile}` }
        });
    }
    
    console.log("Updated products with images.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
