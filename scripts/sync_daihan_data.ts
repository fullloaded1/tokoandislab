import { PrismaClient } from '@prisma/client';
import { daihanKatalog } from './scratch/daihan-products';

const prisma = new PrismaClient();

async function main() {
  console.log('Syncing Daihan Labtech products data...');
  
  const allDaihanProducts = await prisma.product.findMany({
    where: { category: 'daihan-labtech' },
    include: { specs: true }
  });

  console.log(`Found ${allDaihanProducts.length} Daihan products in DB.`);

  let updatedCount = 0;

  for (const dbProduct of allDaihanProducts) {
    // Find matching product in daihanKatalog by model
    let matchedSourceProduct = null;
    let matchedSubcategoryName = '';
    
    for (const kategori of daihanKatalog) {
      const prod = kategori.produk.find(p => p.model.includes(dbProduct.model));
      if (prod) {
        matchedSourceProduct = prod;
        matchedSubcategoryName = kategori.nama;
        break;
      }
    }

    if (matchedSourceProduct) {
      console.log(`Updating ${dbProduct.model}...`);
      
      // Update description
      await prisma.product.update({
        where: { id: dbProduct.id },
        data: {
          description: matchedSourceProduct.deskripsi,
        }
      });
      
      // Update specs
      // First, delete existing specs
      await prisma.productSpec.deleteMany({
        where: { productId: dbProduct.id }
      });
      
      // Create new specs
      const specsData = Object.entries(matchedSourceProduct.spesifikasi).map(([label, value]) => ({
        label,
        value: String(value),
        productId: dbProduct.id
      }));
      
      // Add features as specs if they exist
      if (matchedSourceProduct.fitur && matchedSourceProduct.fitur.length > 0) {
        specsData.push({
          label: 'Fitur Utama',
          value: matchedSourceProduct.fitur.join(', '),
          productId: dbProduct.id
        });
      }
      
      if (specsData.length > 0) {
        await prisma.productSpec.createMany({
          data: specsData
        });
      }
      
      updatedCount++;
    } else {
      console.log(`No match found in source data for model: ${dbProduct.model}`);
    }
  }

  console.log(`Finished updating ${updatedCount} Daihan products.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
