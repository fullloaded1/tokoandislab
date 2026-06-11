import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: {
      specs: true,
    },
  });

  console.log(`Total products: ${products.length}`);

  const noSpecs = products.filter(p => p.specs.length === 0);
  console.log(`\nProducts with 0 specs (${noSpecs.length}):`);
  noSpecs.forEach(p => {
    console.log(`- [${p.categoryLabel}] ${p.name} (ID: ${p.id})`);
  });

  const shortDesc = products.filter(p => p.description.length < 30);
  console.log(`\nProducts with very short descriptions (${shortDesc.length}):`);
  shortDesc.forEach(p => {
    console.log(`- [${p.categoryLabel}] ${p.name}: "${p.description}"`);
  });

  const zeroPrice = products.filter(p => p.price === 0);
  console.log(`\nProducts with 0 price (${zeroPrice.length}):`);
  zeroPrice.forEach(p => {
    console.log(`- [${p.categoryLabel}] ${p.name}`);
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
