import { PrismaClient } from '@prisma/client';
import { removeBackground } from '@imgly/background-removal-node';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const prisma = new PrismaClient();

const templatePath = 'C:\\Users\\Ancimmm\\.gemini\\antigravity-ide\\brain\\cf893a34-3112-471b-94ed-072462e18850\\template_option_3_with_logo_1780632554249.png';
const sourceDir = path.resolve('public/gambarproduk');
const outputDir = path.resolve('public/images/products');

const imageMappings = [
  {
    slug: 'vortex-mixer-servicebio-smv-4500b',
    filename: 'Vortex Mixer Servicebio SMV-4500B.png'
  },
  {
    slug: 'mikroskop-olympus-cx-23',
    filename: 'Mikroskop Olympus CX-23.webp'
  },
  {
    slug: 'autoklaf-labtech-lac-50455p',
    filename: 'Autoklaf Labtech LAC-50455P.jpg'
  },
  {
    slug: 'water-purificator-puris-mirae-st',
    filename: 'Water Purificator Puris Mirae ST Expe-CB Ele 10-M.jpg'
  }
];

async function main() {
  console.log('Memulai pemrosesan gambar produk baru...');
  
  if (!fs.existsSync(templatePath)) {
    console.error('Template tidak ditemukan di:', templatePath);
    return;
  }

  for (const mapping of imageMappings) {
    const inputPath = path.join(sourceDir, mapping.filename);
    const outputPath = path.join(outputDir, `${mapping.slug}_framed.png`);
    const dbImagePath = `/images/products/${mapping.slug}_framed.png`;

    if (!fs.existsSync(inputPath)) {
      console.warn(`File sumber tidak ditemukan: ${inputPath}`);
      continue;
    }

    try {
      console.log(`\nProcessing: ${mapping.filename} -> ${mapping.slug}_framed.png`);
      
      // 1. Hapus background menggunakan @imgly/background-removal-node
      console.log('  -> Menghapus background...');
      const imageBuffer = fs.readFileSync(inputPath);
      const blob = await removeBackground(new Blob([imageBuffer]));
      const noBgBuffer = Buffer.from(await blob.arrayBuffer());
      
      // 2. Resize gambar agar pas di dalam frame template (max 550x550)
      console.log('  -> Meresize gambar...');
      const resizedProductBuffer = await sharp(noBgBuffer)
        .resize({
          width: 550,
          height: 550,
          fit: 'inside',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .toBuffer();
        
      // 3. Composite produk di atas frame template
      console.log('  -> Memasang frame template...');
      const outputBuffer = await sharp(templatePath)
        .composite([
          {
            input: resizedProductBuffer,
            gravity: 'center'
          }
        ])
        .png()
        .toBuffer();
        
      // 4. Simpan ke public/images/products
      fs.writeFileSync(outputPath, outputBuffer);
      console.log(`  -> Berhasil menyimpan gambar ber-frame ke: ${outputPath}`);

      // 5. Update database produk
      const product = await prisma.product.findUnique({
        where: { slug: mapping.slug }
      });

      if (product) {
        await prisma.product.update({
          where: { slug: mapping.slug },
          data: { image: dbImagePath }
        });
        console.log(`  -> Database updated untuk ${mapping.slug} dengan path: ${dbImagePath}`);
      } else {
        console.warn(`  -> Produk dengan slug ${mapping.slug} tidak ditemukan di database.`);
      }

    } catch (err) {
      console.error(`  -> Gagal memproses ${mapping.filename}:`, err);
    }
  }

  console.log('\nSemua gambar selesai diproses!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
