import { PrismaClient } from '@prisma/client';
// import { products } from '../src/lib/products'; // Note: you may need to compile or run this via ts-node

const prisma = new PrismaClient();

async function main() {
  console.log('Seed script is disabled. Database is managed manually or already seeded.');

  // for (const product of products) {
  //   const existing = await prisma.product.findUnique({
  //     where: { slug: product.slug }
  //   });
  //
  //   if (!existing) {
  //     const createdProduct = await prisma.product.create({
  //       data: {
  //         slug: product.slug,
  //         name: product.name,
  //         category: product.category as any,
  //         categoryLabel: product.categoryLabel,
  //         brand: product.brand,
  //         model: product.model,
  //         subcategory: product.subcategory,
  //         image: product.image,
  //         description: product.description,
  //         price: product.price,
  //         specs: {
  //           create: product.specs.map(spec => ({
  //             label: spec.label,
  //             value: spec.value
  //           }))
  //         }
  //       },
  //     });
  //     console.log(`Created product: ${createdProduct.name}`);
  //   } else {
  //     console.log(`Product already exists: ${product.name}`);
  //   }
  // }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
