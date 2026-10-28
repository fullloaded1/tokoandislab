import { prisma } from '../src/lib/db';
import { buildReadyStockPdfBytes } from '../src/lib/readyStockPdf';
import * as fs from 'fs';

async function testPdf() {
  console.log('Testing PDF Generation with updated DB products...');

  const readyStockProducts = await prisma.product.findMany({
    where: { isReadyStock: true },
    include: { variants: true },
    orderBy: { price: 'asc' }
  });

  console.log(`Found ${readyStockProducts.length} ready stock products.`);

  const m1Bytes = buildReadyStockPdfBytes(readyStockProducts, 'M1', 'Oktober 2026');
  console.log(`M1 PDF generated successfully: ${m1Bytes.byteLength} bytes.`);

  const m3Bytes = buildReadyStockPdfBytes(readyStockProducts, 'M3', 'Oktober 2026');
  console.log(`M3 PDF generated successfully: ${m3Bytes.byteLength} bytes.`);

  const testM1Path = 'C:/Users/Ancimmm/.gemini/antigravity-ide/brain/e9b32a4f-e2e1-48c6-9ede-9c1790bc7cd7/scratch/test_catalog_M1.pdf';
  const testM3Path = 'C:/Users/Ancimmm/.gemini/antigravity-ide/brain/e9b32a4f-e2e1-48c6-9ede-9c1790bc7cd7/scratch/test_catalog_M3.pdf';

  fs.writeFileSync(testM1Path, Buffer.from(m1Bytes));
  fs.writeFileSync(testM3Path, Buffer.from(m3Bytes));

  console.log('Saved test PDFs to scratch directory.');
}

testPdf()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
