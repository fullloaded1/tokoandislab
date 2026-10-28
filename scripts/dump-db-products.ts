import { prisma } from '../src/lib/db';
import * as fs from 'fs';

async function main() {
  const products = await prisma.product.findMany({
    include: {
      variants: true,
      specs: true
    },
    orderBy: { createdAt: 'asc' }
  });

  const serialized = products.map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    categoryLabel: p.categoryLabel,
    brand: p.brand,
    model: p.model,
    subcategory: p.subcategory,
    price: p.price.toString(),
    costPrice: p.costPrice.toString(),
    isReadyStock: p.isReadyStock,
    isRequestPricing: p.isRequestPricing,
    variants: p.variants.map(v => ({
      id: v.id,
      sku: v.sku,
      name: v.name,
      price: v.price.toString(),
      stock: v.stock,
      reservedStock: v.reservedStock
    })),
    specs: p.specs.map(s => ({
      label: s.label,
      value: s.value
    }))
  }));

  const outPath = 'C:/Users/Ancimmm/.gemini/antigravity-ide/brain/e9b32a4f-e2e1-48c6-9ede-9c1790bc7cd7/scratch/db_products_dump.json';
  fs.writeFileSync(outPath, JSON.stringify(serialized, null, 2), 'utf-8');
  console.log(`Dumped ${serialized.length} products to ${outPath}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
