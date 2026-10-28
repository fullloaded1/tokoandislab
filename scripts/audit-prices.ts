import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';
import Decimal from 'decimal.js';

const prisma = new PrismaClient();
const excelPath = 'C:\\Users\\Ancimmm\\Downloads\\workspace.tar(1)\\workspace\\Master_Inventory_ASL_Updated.xlsx';
const analisisPath = 'C:\\Users\\Ancimmm\\Downloads\\workspace.tar(1)\\workspace\\Analisis_Harga_Partner_dan_Strategi_Selling_329.xlsx';

interface ExcelItem {
  no: number;
  name: string;
  brand: string;
  model: string;
  catalogNo: string;
  spec: string;
  unit: string;
  hargaBeli: Decimal;
  hargaJual: Decimal;
  status: string;
  supplier?: string;
  isReadyStock: boolean;
}

const norm = (s: string) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

async function run() {
  console.log('=== AUDIT HARGA TOKOANDIS VS WORKSPACE DOWNLOADS ===');

  // 1. Read Master_Inventory_ASL_Updated.xlsx
  const wbMaster = XLSX.readFile(excelPath);
  const sheetMaster = wbMaster.Sheets['Master Inventory'];
  const masterRows: any[][] = XLSX.utils.sheet_to_json(sheetMaster, { header: 1 });

  const excelItems: ExcelItem[] = [];
  for (const r of masterRows) {
    if (!r || typeof r[0] !== 'number' || !r[1] || r[1] === 'Item Name') continue;
    const rawHb = typeof r[7] === 'number' ? r[7] : parseFloat(String(r[7] || '0').replace(/[^0-9.]/g, '')) || 0;
    const rawHj = typeof r[8] === 'number' ? r[8] : parseFloat(String(r[8] || '0').replace(/[^0-9.]/g, '')) || 0;
    const hb = new Decimal(rawHb);
    // Formula: harga jual = harga beli / 0.8 jika hj 0
    const hj = rawHj > 0 ? new Decimal(rawHj) : (rawHb > 0 ? hb.div(0.8).round() : new Decimal(0));
    const status = String(r[9] || '').trim();

    excelItems.push({
      no: r[0],
      name: String(r[1] || '').trim(),
      brand: String(r[2] || '').trim(),
      model: String(r[3] || '').trim(),
      catalogNo: String(r[4] || '').trim(),
      spec: String(r[5] || '').trim(),
      unit: String(r[6] || '').trim(),
      hargaBeli: hb,
      hargaJual: hj,
      status,
      supplier: r[10] ? String(r[10]).trim() : undefined,
      isReadyStock: status.toLowerCase().includes('ready')
    });
  }

  console.log(`Excel Master Inventory loaded: ${excelItems.length} items`);

  // 2. Read DB Products
  const dbProducts = await prisma.product.findMany({
    include: { variants: true }
  });
  console.log(`DB Products loaded: ${dbProducts.length} products`);

  const matched: Array<{
    product: typeof dbProducts[0];
    excel: ExcelItem;
    matchReason: string;
    hasDiff: boolean;
    diffDetails: string[];
  }> = [];

  const unmatchedDb: typeof dbProducts = [];

  for (const p of dbProducts) {
    const pModel = norm(p.model || '');
    const pName = norm(p.name || '');
    const pSlug = norm(p.slug || '');

    // Match strategy:
    // 1. Exact model match (if model is substantial)
    let match: ExcelItem | undefined;
    let reason = '';

    if (pModel.length >= 3 && pModel !== 'unit' && pModel !== 'standard') {
      match = excelItems.find(e => norm(e.model) === pModel || norm(e.catalogNo) === pModel);
      if (match) reason = `Model match (${p.model} == ${match.model || match.catalogNo})`;
    }

    if (!match && pName.length >= 4) {
      match = excelItems.find(e => norm(e.name) === pName);
      if (match) reason = `Exact name match (${p.name})`;
    }

    if (!match && pModel.length >= 3) {
      match = excelItems.find(e => {
        const eName = norm(e.name);
        return eName.includes(pModel);
      });
      if (match) reason = `Name contains model (${p.model} in ${match.name})`;
    }

    if (!match) {
      // Substring name match
      match = excelItems.find(e => {
        const eName = norm(e.name);
        return (pName.length > 8 && eName.includes(pName)) || (eName.length > 8 && pName.includes(eName));
      });
      if (match) reason = `Name fuzzy (${p.name} ~ ${match.name})`;
    }

    if (!match && pSlug.length > 5) {
      match = excelItems.find(e => {
        const eModel = norm(e.model);
        const eName = norm(e.name);
        return (eModel.length > 3 && pSlug.includes(eModel)) || (eName.length > 8 && pSlug.includes(eName));
      });
      if (match) reason = `Slug fuzzy (${p.slug})`;
    }

    if (match) {
      const diffDetails: string[] = [];
      const dbPrice = new Decimal(p.price.toString());
      const dbCost = new Decimal(p.costPrice.toString());
      const exPrice = match.hargaJual;
      const exCost = match.hargaBeli;

      if (!dbPrice.equals(exPrice)) {
        diffDetails.push(`Price: DB=${dbPrice.toString()} vs Excel=${exPrice.toString()}`);
      }
      if (!dbCost.equals(exCost)) {
        diffDetails.push(`CostPrice: DB=${dbCost.toString()} vs Excel=${exCost.toString()}`);
      }

      for (const v of p.variants) {
        const vPrice = new Decimal(v.price.toString());
        if (!vPrice.equals(exPrice) && exPrice.gt(0)) {
          diffDetails.push(`Variant ${v.name} (${v.sku}): DB=${vPrice.toString()} vs Excel=${exPrice.toString()}`);
        }
      }

      matched.push({
        product: p,
        excel: match,
        matchReason: reason,
        hasDiff: diffDetails.length > 0,
        diffDetails
      });
    } else {
      unmatchedDb.push(p);
    }
  }

  console.log(`\nMatched DB products: ${matched.length}/${dbProducts.length}`);
  console.log(`Unmatched DB products: ${unmatchedDb.length}`);

  const diffCount = matched.filter(m => m.hasDiff).length;
  console.log(`Matched products with price difference: ${diffCount}`);

  if (diffCount > 0) {
    console.log('\n--- DAFTAR PERBEDAAN HARGA ---');
    for (const m of matched.filter(m => m.hasDiff)) {
      console.log(`[${m.product.id}] ${m.product.name} (Model: ${m.product.model})`);
      console.log(`  Match: Excel #${m.excel.no} - ${m.excel.name} (Model: ${m.excel.model}) [${m.matchReason}]`);
      for (const d of m.diffDetails) {
        console.log(`    * ${d}`);
      }
    }
  }

  if (unmatchedDb.length > 0) {
    console.log('\n--- DB PRODUCTS YANG BELUM TER-MATCH KE EXCEL ---');
    for (const p of unmatchedDb) {
      console.log(`[${p.id}] "${p.name}" | Brand: "${p.brand}" | Model: "${p.model}" | Price: ${p.price.toString()} | Cost: ${p.costPrice.toString()} | ReadyStock: ${p.isReadyStock}`);
    }
  }
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
