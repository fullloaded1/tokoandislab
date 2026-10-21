import * as XLSX from 'xlsx';
import { PrismaClient, Prisma } from '@prisma/client';
import Decimal from 'decimal.js';

const prisma = new PrismaClient();
const excelPath = 'C:\\Users\\Ancimmm\\Downloads\\workspace.tar(1)\\workspace\\Master_Inventory_ASL_Updated.xlsx';

interface ExcelItem {
  name: string;
  brand: string;
  model: string;
  catalogNo: string;
  hargaBeli: Decimal;
  hargaJual: Decimal;
}

async function main() {
  console.log('--- MEMULAI PENYESUAIAN HARGA PRODUK DIBAGI 0,8 ---');

  // 1. Baca data dari Master Inventory Excel
  const wb = XLSX.readFile(excelPath);
  const sheet = wb.Sheets['Master Inventory'];
  const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const excelItems: ExcelItem[] = [];
  for (const r of rows) {
    if (!r || !r[1] || r[1] === 'Item Name' || (typeof r[0] === 'string' && r[0].includes('MASTER INVENTORY'))) {
      continue;
    }
    const name = String(r[1] || '').trim();
    if (!name) continue;

    const rawHb = typeof r[7] === 'number' ? r[7] : parseFloat(String(r[7] || '0').replace(/[^0-9.]/g, '')) || 0;
    const rawHj = typeof r[8] === 'number' ? r[8] : parseFloat(String(r[8] || '0').replace(/[^0-9.]/g, '')) || 0;

    if (rawHb > 0) {
      const hb = new Decimal(rawHb);
      // rumus: harga jual = harga beli / 0.8
      const hj = rawHj > 0 ? new Decimal(rawHj) : hb.div(0.8).round();
      excelItems.push({
        name,
        brand: String(r[2] || '').trim(),
        model: String(r[3] || '').trim(),
        catalogNo: String(r[4] || '').trim(),
        hargaBeli: hb,
        hargaJual: hj,
      });
    }
  }

  console.log(`Memuat ${excelItems.length} item dengan harga beli dari Excel Master Inventory.`);

  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

  const dbProducts = await prisma.product.findMany({
    include: { variants: true }
  });

  let updatedCount = 0;
  let updatedVariantsCount = 0;

  // 2. Loop semua produk di DB
  for (const p of dbProducts) {
    const pModel = norm(p.model || '');
    const pName = norm(p.name || '');

    // Cari kecocokan di Excel
    const match = excelItems.find(e => {
      const eModel = norm(e.model || '');
      const eCat = norm(e.catalogNo || '');
      const eName = norm(e.name || '');
      if (pModel.length > 2 && (eModel === pModel || eCat === pModel || eName.includes(pModel))) return true;
      if (eName === pName || (pName.length > 5 && eName.includes(pName)) || (eName.length > 5 && pName.includes(eName))) return true;
      return false;
    });

    let newCostPrice: Decimal | null = null;
    let newSellPrice: Decimal | null = null;

    if (match) {
      newCostPrice = match.hargaBeli;
      newSellPrice = match.hargaJual;
    } else {
      // Untuk produk yang kemarin diinput harga modal (seperti Kursi Donor, Scrub Station, dll)
      // atau produk yang harga sekarang di bawah rata-rata
      const currentPrice = new Decimal(p.price.toString());
      // Jika produk berasal dari batch insert yang salah (modal dijadikan harga jual)
      // atau jika memiliki variant yang harganya terpotong
      const firstVar = p.variants[0];
      const varPrice = firstVar ? new Decimal(firstVar.price.toString()) : null;

      // Kasus khusus produk kemarin jika tidak ada di excel
      if (p.slug === 'kursi-donor-medis' && currentPrice.lt(6000000)) {
        newCostPrice = new Decimal(4800000);
        newSellPrice = newCostPrice.div(0.8).round();
      } else if (p.slug === 'scrub-station-1-person' && currentPrice.lt(25000000)) {
        newCostPrice = new Decimal(20000000);
        newSellPrice = newCostPrice.div(0.8).round();
      } else if (p.costPrice.gt(0)) {
        // Jika sudah ada costPrice, hitung jual = costPrice / 0.8
        newCostPrice = new Decimal(p.costPrice.toString());
        newSellPrice = newCostPrice.div(0.8).round();
      }
    }

    if (newSellPrice && newCostPrice) {
      await prisma.product.update({
        where: { id: p.id },
        data: {
          costPrice: newCostPrice,
          price: newSellPrice,
        }
      });
      updatedCount++;

      // Update variants agar harganya sinkron dengan harga jual baru
      for (const v of p.variants) {
        await prisma.productVariant.update({
          where: { id: v.id },
          data: {
            price: newSellPrice,
          }
        });
        updatedVariantsCount++;
      }

      console.log(`[UPDATE] ${p.name}: Modal Rp ${newCostPrice.toLocaleString('id-ID')} -> Jual Rp ${newSellPrice.toLocaleString('id-ID')} (dibagi 0,8)`);
    }
  }

  console.log(`\nSELESAI! Berhasil memperbarui ${updatedCount} produk dan ${updatedVariantsCount} varian.`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
