import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const imageMappings = [
  {
    slug: 'vortex-mixer-servicebio-smv-4500b',
    dbImagePath: '/images/products/vortex-mixer-servicebio-smv-4500b.png'
  },
  {
    slug: 'mikroskop-olympus-cx-23',
    dbImagePath: '/images/products/mikroskop-olympus-cx-23.png'
  },
  {
    slug: 'autoklaf-labtech-lac-50455p',
    dbImagePath: '/images/products/autoklaf-labtech-lac-50455p.png'
  },
  {
    slug: 'water-purificator-puris-mirae-st',
    dbImagePath: '/images/products/water-purificator-puris-mirae-st.png'
  }
];

async function main() {
  console.log('Updating product images in PostgreSQL using Prisma...');
  for (const mapping of imageMappings) {
    const product = await prisma.product.findUnique({
      where: { slug: mapping.slug }
    });
    if (product) {
      await prisma.product.update({
        where: { slug: mapping.slug },
        data: { image: mapping.dbImagePath }
      });
      console.log(`Updated ${mapping.slug} with image path: ${mapping.dbImagePath}`);
    } else {
      console.warn(`Product not found: ${mapping.slug}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
