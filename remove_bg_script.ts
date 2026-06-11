import { removeBackground } from '@imgly/background-removal-node';
import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function processImages() {
  console.log('Fetching products from database...');
  const products = await prisma.product.findMany({
    where: {
      image: {
        not: {
          contains: 'vercel-storage'
        }
      }
    }
  });

  console.log(`Found ${products.length} products to process.`);

  for (const product of products) {
    try {
      console.log(`Processing image for ${product.name} (${product.slug})...`);
      
      let localImagePath = product.image;
      
      // Fix paths like /images/... to point to public/images/...
      if (localImagePath.startsWith('/images/')) {
        localImagePath = decodeURIComponent(localImagePath); // Decode %20 to spaces
        localImagePath = path.join('C:\\Users\\Ancimmm\\Documents\\tokoandis\\public', localImagePath);
      } else if (localImagePath.startsWith('C:\\images\\')) {
        localImagePath = localImagePath.replace('C:\\images\\', 'C:\\Users\\Ancimmm\\Documents\\tokoandis\\public\\images\\');
      }

      // If it's a Vercel blob or external URL, we can pass it directly
      let imageSource: string | Blob = localImagePath;
      
      // If it's a local file, read it into a Buffer
      if (localImagePath.includes('C:\\Users\\Ancimmm')) {
        if (fs.existsSync(localImagePath)) {
          let buffer = fs.readFileSync(localImagePath);
          // Convert to PNG using webp-converter to avoid unsupported format errors
          if (localImagePath.endsWith('.webp')) {
             const webp = require('webp-converter');
             webp.grant_permission();
             const tempPng = localImagePath + '.temp.png';
             await webp.dwebp(localImagePath, tempPng, "-o");
             buffer = fs.readFileSync(tempPng);
             fs.unlinkSync(tempPng);
          }
          // @ts-ignore
          imageSource = new Blob([buffer], { type: 'image/png' });
        } else {
           console.log(`File not found: ${localImagePath}`);
           continue;
        }
      }

      // Remove background
      const blob = await removeBackground(imageSource);
      const outputBuffer = Buffer.from(await blob.arrayBuffer());

      // Upload to Vercel Blob
      const filename = `${product.slug}-transparent.png`;
      console.log(`Uploading ${filename} to Vercel Blob...`);
      const { url } = await put(`products/${filename}`, outputBuffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN
      });

      // Update database
      console.log(`Updating database with new URL: ${url}`);
      await prisma.product.update({
        where: { id: product.id },
        data: { image: url }
      });

      console.log(`Successfully processed ${product.name}\n`);
    } catch (error) {
      console.error(`Failed to process ${product.name}:`, error);
    }
  }

  console.log('All done!');
  await prisma.$disconnect();
}

processImages().catch(console.error);
