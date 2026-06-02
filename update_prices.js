const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'lib', 'products.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Add price field to interface
content = content.replace(
  'export interface Product {',
  'export interface Product {\n  price: number;'
);

// Add formatRupiah helper
const formatHelper = `
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
`;
content = content.replace('export const products: Product[] = [', formatHelper + '\nexport const products: Product[] = [');

// Define prices for the 19 products
const prices = [
  35000000, 28000000, 8500000, 21000000, 1500000, // Lovibond
  18000000, 22500000, 4200000, 6500000,           // Daihan
  125000, 150000, 320000, 180000, 250000,         // Pyrex
  45000000, 55000000, 12000000, 65000000, 72000000 // Custom
];

let idx = 0;
content = content.replace(/image:\s*"(.*?)",/g, (match) => {
  const price = prices[idx++] || 0;
  return match + '\n    price: ' + price + ',';
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated products.ts');
