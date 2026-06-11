const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const templatePath = 'C:\\Users\\Ancimmm\\.gemini\\antigravity-ide\\brain\\cf893a34-3112-471b-94ed-072462e18850\\template_option_3_with_logo_1780632554249.png';

async function processImages() {
  const products = await prisma.product.findMany();
  
  for (const product of products) {
    if (!product.image) continue;
    
    // Remove leading slash and resolve path
    const imageRelPath = product.image.startsWith('/') ? product.image.slice(1) : product.image;
    const inputImagePath = path.join(__dirname, 'public', imageRelPath);
    
    if (!fs.existsSync(inputImagePath)) {
      console.log(`File not found: ${inputImagePath}`);
      continue;
    }
    
    console.log(`Processing ${inputImagePath}...`);
    
    try {
      // 1. Load the product image and resize it so it fits nicely inside the template
      // The template is 800x800. We leave some margin (e.g. 500x500 max size for the product)
      const productBuffer = await sharp(inputImagePath)
        .resize({
          width: 550,
          height: 550,
          fit: 'inside',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // transparent background
        })
        .toBuffer();
        
      // 2. Composite the resized product image over the template
      const outputBuffer = await sharp(templatePath)
        .composite([
          {
            input: productBuffer,
            gravity: 'center'
          }
        ])
        .png() // Save as PNG to preserve quality
        .toBuffer();
        
      // 3. Save the result
      // We'll just overwrite the original file, but we should make sure the extension matches if we save as PNG,
      // or we can just change the DB if we change the extension.
      // Let's keep it simple: just overwrite the existing file but convert to webp or png.
      // Let's actually save it as a new file, update the DB, and delete the old one.
      
      const ext = path.extname(imageRelPath);
      const newImageRelPath = imageRelPath.replace(ext, '_framed.png');
      const newImagePath = path.join(__dirname, 'public', newImageRelPath);
      
      fs.writeFileSync(newImagePath, outputBuffer);
      
      // Update DB to point to new image
      await prisma.product.update({
        where: { id: product.id },
        data: { image: '/' + newImageRelPath.replace(/\\/g, '/') }
      });
      
      console.log(`Updated ${product.name} -> /${newImageRelPath}`);
    } catch (err) {
      console.error(`Error processing ${inputImagePath}:`, err);
    }
  }
  
  await prisma.$disconnect();
}

processImages().then(() => console.log('Done!')).catch(console.error);
