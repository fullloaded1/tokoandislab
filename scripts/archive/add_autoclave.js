const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const prisma = new PrismaClient();

async function addAutoclave() {
  const rawImagePath = 'C:\\Users\\Ancimmm\\.gemini\\antigravity-ide\\brain\\cf893a34-3112-471b-94ed-072462e18850\\daihan_autoclave_1780641226188.png';
  const templatePath = 'C:\\Users\\Ancimmm\\.gemini\\antigravity-ide\\brain\\cf893a34-3112-471b-94ed-072462e18850\\template_option_3_with_logo_1780632554249.png';
  const finalImageRelPath = 'images/products/daihan-autoclave_framed.png';
  const finalImagePath = path.join(__dirname, 'public', finalImageRelPath);

  // 1. Frame the image
  console.log('Framing image...');
  const productBuffer = await sharp(rawImagePath)
    .resize({
      width: 550,
      height: 550,
      fit: 'inside',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .toBuffer();
    
  const outputBuffer = await sharp(templatePath)
    .composite([
      {
        input: productBuffer,
        gravity: 'center'
      }
    ])
    .png()
    .toBuffer();

  fs.writeFileSync(finalImagePath, outputBuffer);
  console.log('Saved framed image to', finalImagePath);

  // 2. Insert into database
  console.log('Inserting into database...');
  await prisma.product.create({
    data: {
      slug: 'autoclave-maxterile',
      name: 'Autoclave MaXterile 60L',
      category: 'daihan-labtech',
      image: '/' + finalImageRelPath,
      price: 0, // Users request penawaran anyway
      description: 'Floor-standing Autoclave dengan kapasitas 60 Liter. Cocok untuk sterilisasi alat laboratorium, media kultur, dan limbah medis. Dilengkapi dengan kontrol digital mikroprosesor, sistem pengaman tekanan otomatis, dan material stainless steel tahan karat kelas atas.',
      brand: 'Daihan Labtech',
      categoryLabel: 'Daihan Labtech',
      model: 'MaXterile 60',
      subcategory: 'Sterilization'
    }
  });

  console.log('Product added successfully!');
}

addAutoclave()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
