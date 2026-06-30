const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { specs: true },
    orderBy: { category: 'asc' }
  });

  for (const p of products) {
    console.log('========================================');
    console.log(`Slug: ${p.slug}`);
    console.log(`Name: ${p.name}`);
    console.log(`Category: ${p.category} (${p.categoryLabel})`);
    console.log(`Brand: ${p.brand}`);
    console.log(`Model: ${p.model}`);
    console.log(`Price: ${p.price}`);
    console.log(`Image: ${p.image}`);
    console.log(`Description: ${p.description.substring(0, 100)}...`);
    console.log(`Specs (${p.specs.length}):`);
    p.specs.forEach(s => console.log(`  - ${s.label}: ${s.value}`));
    console.log('');
  }

  console.log(`\nTotal: ${products.length} products`);
  await prisma.$disconnect();
}

main().catch(console.error);
