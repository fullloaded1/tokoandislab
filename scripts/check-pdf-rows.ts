import { prisma } from '../src/lib/db';
import { selectEditionProducts, getProductMinPrice } from '../src/lib/readyStockPdf';
import { money } from '../src/lib/money';

async function checkPdfRows() {
  const readyStockProducts = await prisma.product.findMany({
    where: { isReadyStock: true },
    include: { variants: true },
    orderBy: { price: 'asc' }
  });

  for (const edition of ['M1', 'M3'] as const) {
    console.log(`\n================ EDITION ${edition} ROWS ================`);
    const products = selectEditionProducts(readyStockProducts, edition);
    console.log(`Total selected products: ${products.length}`);
    products.forEach((p, i) => {
      const priceStr = p.isRequestPricing ? "Hubungi Sales" : money.formatIDR(p.price);
      if (['LAC-1031SV', 'BR-23UM', 'BR-43FL', 'DTU-R', 'CC-J2S'].some(m => p.model?.includes(m))) {
        console.log(`  Row ${i + 1}: ${p.name} | Model: ${p.model} | Brand: ${p.brand} | Price: ${priceStr}`);
      }
    });
  }
}

checkPdfRows()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
