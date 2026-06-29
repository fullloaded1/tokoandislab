import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  {
    slug: 'biosafety-cabinet-bsc-custom',
    basePrice: 80000000,
    variants: [
      { sku: 'ALC-BSC-MINI-II-A2', name: 'BSC mini II A2', price: 80000000, stock: 0, sortOrder: 1 },
      { sku: 'ALC-BSC-1100-II-A2', name: 'BSC 1100 II A2', price: 88725000, stock: 0, sortOrder: 2 },
      { sku: 'ALC-BSC-1400-II-A2', name: 'BSC 1400 II A2', price: 99750000, stock: 0, sortOrder: 3 },
      { sku: 'ALC-BSC-MINI-II-A2-P', name: 'BSC mini II A2 Prime', price: 110000000, stock: 0, sortOrder: 4 },
      { sku: 'ALC-BSC-1100-II-A2-P', name: 'BSC 1100 II A2 Prime', price: 162750000, stock: 0, sortOrder: 5 },
    ]
  },
  {
    slug: 'laminar-air-flow-laf-custom',
    basePrice: 50000000,
    variants: [
      { sku: 'ALC-LAF-MINI-V', name: 'LAF mini V', price: 50000000, stock: 0, sortOrder: 1 },
      { sku: 'ALC-LAF-1000-V', name: 'LAF 1000 V', price: 61000000, stock: 0, sortOrder: 2 },
      { sku: 'ALC-LAF-1400-V', name: 'LAF 1400 V', price: 67100000, stock: 0, sortOrder: 3 },
      { sku: 'ALC-LAF-MINI-V-D', name: 'LAF mini V Digital', price: 73000000, stock: 0, sortOrder: 4 },
    ]
  },
  {
    slug: 'lemari-penyimpanan-mudah-terbakar',
    basePrice: 28750000,
    variants: [
      { sku: 'ALC-FS-4', name: 'FS 4', price: 28750000, stock: 0, sortOrder: 1 },
      { sku: 'ALC-FS-6', name: 'FS 6', price: 29637000, stock: 0, sortOrder: 2 },
    ]
  }
];

async function main() {
  console.log('Starting AndisLab variants update...');

  for (const update of updates) {
    const product = await prisma.product.findUnique({
      where: { slug: update.slug }
    });

    if (!product) {
      console.warn(`Product not found: ${update.slug}`);
      continue;
    }

    console.log(`Updating product: ${product.name}`);

    // Update base price and isRequestPricing
    await prisma.product.update({
      where: { id: product.id },
      data: {
        price: update.basePrice,
        isRequestPricing: false
      }
    });

    // Add variants if they don't exist
    for (const variantData of update.variants) {
      const existingVariant = await prisma.productVariant.findUnique({
        where: { sku: variantData.sku }
      });

      if (existingVariant) {
        // Update existing variant price
        await prisma.productVariant.update({
          where: { id: existingVariant.id },
          data: { price: variantData.price }
        });
        console.log(`  -> Updated variant ${variantData.sku} (${variantData.name})`);
      } else {
        // Create new variant
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sku: variantData.sku,
            name: variantData.name,
            price: variantData.price,
            stock: variantData.stock,
            sortOrder: variantData.sortOrder
          }
        });
        console.log(`  -> Created variant ${variantData.sku} (${variantData.name})`);
      }
    }
  }

  console.log('Update completed!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
