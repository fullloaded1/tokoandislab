const { PrismaClient } = require('@prisma/client');
const xlsx = require('xlsx');
const path = require('path');
require('dotenv').config();

async function run() {
  const prisma = new PrismaClient();
  const filePath = path.join(__dirname, 'public/GMC/Feed Google Merchant Center - Products source.xlsx');
  
  const wb = xlsx.readFile(filePath);
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  
  // Get headers
  const headers = xlsx.utils.sheet_to_json(sheet, {header: 1})[0];
  
  const products = await prisma.product.findMany({
    where: {
      isReadyStock: true,
    },
    include: {
      variants: true,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.andislab.com';

  const rows = products.map((p) => {
    const totalStock = p.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
    const availability = totalStock > 0 ? 'in stock' : 'out of stock';
    
    const priceNum = p.price ? Number(p.price.toString()) : 0;
    const formattedPrice = `${priceNum.toFixed(2)} IDR`;
    
    const imageUrl = p.image?.startsWith('http') 
      ? p.image 
      : `${baseUrl}${p.image?.startsWith('/') ? '' : '/'}${p.image}`;

    const hasIdentifier = !!(p.brand || p.model);

    return {
      id: p.id,
      title: p.name,
      description: p.description || p.name,
      availability: availability,
      link: `${baseUrl}/katalog/${p.slug}`,
      image_link: imageUrl,
      price: formattedPrice,
      identifier_exists: hasIdentifier ? 'yes' : 'no',
      mpn: p.model || '',
      brand: p.brand || '',
      condition: 'new'
    };
  });

  // Convert to sheet
  const newSheet = xlsx.utils.json_to_sheet(rows, { header: headers });
  wb.Sheets[sheetName] = newSheet;

  xlsx.writeFile(wb, filePath);
  console.log(`Berhasil mengisi ${rows.length} produk ke dalam file Excel!`);
  
  await prisma.$disconnect();
}

run().catch(e => { console.error(e); process.exit(1); });
