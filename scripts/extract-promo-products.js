const fs = require('fs');

const printCatalogSrc = fs.readFileSync('src/data/promo-print-catalog.ts', 'utf8');

// Let's parse tableRows from tierSheets
const rows = [];
const lines = printCatalogSrc.split('\n');
let curCode = '';
let curName = '';
let curModel = '';
let curBrand = '';
let curPrice = '';
let curStock = '';

for (const line of lines) {
  const codeMatch = line.match(/code:\s*"([^"]+)"/);
  if (codeMatch) curCode = codeMatch[1];

  const nameMatch = line.match(/name:\s*"([^"]+)"/);
  if (nameMatch) curName = nameMatch[1];

  const modelMatch = line.match(/model:\s*"([^"]+)"/);
  if (modelMatch) curModel = modelMatch[1];

  const brandMatch = line.match(/brand:\s*"([^"]+)"/);
  if (brandMatch) curBrand = brandMatch[1];

  const priceMatch = line.match(/price:\s*"([^"]+)"/);
  if (priceMatch) curPrice = priceMatch[1];

  const stockMatch = line.match(/stock:\s*"([^"]+)"/);
  if (stockMatch) {
    curStock = stockMatch[1];
    if (curCode && curName) {
      rows.push({
        code: curCode,
        name: curName,
        model: curModel,
        brand: curBrand,
        price: curPrice,
        stock: curStock
      });
      curCode = '';
      curName = '';
      curModel = '';
      curBrand = '';
      curPrice = '';
      curStock = '';
    }
  }
}

console.log('Total items in promo print catalog:', rows.length);
console.log('Sample 3 items:', JSON.stringify(rows.slice(0, 3), null, 2));
