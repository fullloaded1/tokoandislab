import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { money } from "./money";

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------

export type PdfEdition = "M1" | "M3";

interface Tier {
  id: string;
  label: string;
  range: string;
  description: string;
  min: number;
  max: number;
  headerRgb: [number, number, number];
  altRowRgb: [number, number, number];
}

// Tier A & B → page 1 | Tier C & D → page 2
const TIERS_PAGE1: Tier[] = [
  {
    id: "A",
    label: "Tier A",
    range: "Rp 1 jt – Rp 30 jt",
    description: "Alat entry-level & mid-range terjangkau",
    min: 1_000_000,
    max: 30_000_000,
    headerRgb: [16, 185, 129],
    altRowRgb: [240, 253, 244],
  },
  {
    id: "B",
    label: "Tier B",
    range: "Rp 31 jt – Rp 70 jt",
    description: "Alat profesional performa tinggi",
    min: 30_000_001,
    max: 70_000_000,
    headerRgb: [59, 130, 246],
    altRowRgb: [239, 246, 255],
  },
];

const TIERS_PAGE2: Tier[] = [
  {
    id: "C",
    label: "Tier C",
    range: "Rp 71 jt – Rp 200 jt",
    description: "Alat riset & industri grade",
    min: 70_000_001,
    max: 200_000_000,
    headerRgb: [139, 92, 246],
    altRowRgb: [245, 243, 255],
  },
  {
    id: "D",
    label: "Tier D — Premium",
    range: "> Rp 200 jt",
    description: "Instrumen analitik & sistem otomasi kelas atas",
    min: 200_000_001,
    max: Infinity,
    headerRgb: [245, 158, 11],
    altRowRgb: [255, 251, 235],
  },
];

const PAGE_W = 595;
const PAGE_H = 841.89;
const MARGIN = 36;
const TABLE_W = PAGE_W - MARGIN * 2;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getProductMinPrice(p: any): number {
  if (p.variants && p.variants.length > 0) {
    const prices: number[] = p.variants
      .map((v: any) => money.toDecimal(v.price).toNumber())
      .filter((pr: number) => pr > 0);
    if (prices.length > 0) return Math.min(...prices);
  }
  return money.toDecimal(p.price).toNumber();
}

function buildTableRows(products: any[], globalOffset: number = 0): string[][] {
  return products.map((p, i) => {
    const totalStock = p.variants
      ? p.variants.reduce(
          (acc: number, v: any) => acc + Math.max(0, v.stock - v.reservedStock),
          0
        )
      : 0;
    const priceStr = p.isRequestPricing
      ? "Hubungi Sales"
      : money.formatIDR(p.price);
    const stockStr = totalStock > 0 ? `${totalStock} (Ready)` : "Indent";
    return [
      String(globalOffset + i + 1),
      p.name,
      p.model || "-",
      p.brand || "-",
      priceStr,
      stockStr,
    ];
  });
}

function drawPageHeader(
  doc: jsPDF,
  edition: PdfEdition,
  yearMonth: string,
  pageTitle: string
): number {
  // Left: logo text + subtitle
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("Katalog Ready Stock – AndisLab", MARGIN, 42);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(pageTitle, MARGIN, 54);
  doc.text(
    `Dicetak: ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}`,
    MARGIN,
    63
  );

  // Right: Edition badge
  const badgeW = 82;
  const badgeH = 28;
  const badgeX = PAGE_W - MARGIN - badgeW;
  const badgeY = 30;

  // Badge background
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 5, 5, "F");

  // Edition label large
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(`Edisi ${edition}`, badgeX + badgeW / 2, badgeY + 13, {
    align: "center",
  });

  // Month below
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(yearMonth, badgeX + badgeW / 2, badgeY + 23, { align: "center" });

  // Divider line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(MARGIN, 72, PAGE_W - MARGIN, 72);

  doc.setTextColor(0, 0, 0);
  return 80; // return Y position after header
}

function drawPageFooter(doc: jsPDF, edition: PdfEdition, yearMonth: string): void {
  const y = PAGE_H - 18;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `AndisLab · Katalog Ready Stock Edisi ${edition} ${yearMonth}  |  Harga & stok dapat berubah sewaktu-waktu  |  www.andislab.com`,
    MARGIN,
    y
  );
  const pageNum = String((doc as any).internal.getCurrentPageInfo().pageNumber);
  doc.text(pageNum, PAGE_W - MARGIN, y, { align: "right" });
  doc.setTextColor(0, 0, 0);
}

function drawTierSection(
  doc: jsPDF,
  tier: Tier,
  products: any[],
  startY: number,
  rowOffset: number
): number {
  if (products.length === 0) return startY;

  // Section header bar
  doc.setFillColor(...tier.headerRgb);
  doc.roundedRect(MARGIN, startY, TABLE_W, 20, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `${tier.label}  ·  ${tier.range}  ·  ${tier.description}  (${products.length} produk)`,
    MARGIN + 7,
    startY + 13
  );
  doc.setTextColor(0, 0, 0);

  const rows = buildTableRows(products, rowOffset);

  autoTable(doc, {
    startY: startY + 24,
    margin: { left: MARGIN, right: MARGIN },
    tableWidth: TABLE_W,
    head: [["No", "Nama Alat", "Model", "Brand", "Harga", "Stok"]],
    body: rows,
    headStyles: {
      fillColor: tier.headerRgb,
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8,
    },
    styles: { fontSize: 7.5, overflow: "linebreak", cellPadding: 3.5 },
    columnStyles: {
      0: { cellWidth: 22, halign: "center" },
      1: { cellWidth: 165 },
      2: { cellWidth: 88 },
      3: { cellWidth: 72 },
      4: { cellWidth: 95, halign: "right" },
      5: { cellWidth: 73, halign: "center" },
    },
    alternateRowStyles: { fillColor: tier.altRowRgb },
  });

  return (doc as any).lastAutoTable.finalY ?? startY + 60;
}

// ---------------------------------------------------------------------------
// Rotation & selection logic
// ---------------------------------------------------------------------------

/**
 * Pilih produk untuk edisi ini:
 * - 30 produk pertama (sorted harga naik) = pool tetap, tampil di semua edisi
 * - 10 produk rotasi: M1 → index 30–39, M3 → index 40–49 (wrap if needed)
 */
export function selectEditionProducts(
  allProducts: any[],
  edition: PdfEdition
): any[] {
  // Filter: min price >= 1 jt
  const pool = allProducts
    .filter((p) => getProductMinPrice(p) >= 1_000_000)
    .sort((a, b) => getProductMinPrice(a) - getProductMinPrice(b));

  const STABLE = 30;
  const ROTATE = 10;

  const stable = pool.slice(0, STABLE);
  const rotationPool = pool.slice(STABLE);

  let rotating: any[];
  if (edition === "M1") {
    rotating = rotationPool.slice(0, ROTATE);
  } else {
    // M3: take next 10, wrap if pool is smaller
    const offset = ROTATE;
    rotating = rotationPool.slice(offset, offset + ROTATE);
    // If not enough, wrap from beginning
    if (rotating.length < ROTATE && rotationPool.length > 0) {
      rotating = [
        ...rotating,
        ...rotationPool.slice(0, ROTATE - rotating.length),
      ];
    }
  }

  const selected = [...stable, ...rotating];
  // Re-sort by price so tiers are contiguous
  return selected.sort((a, b) => getProductMinPrice(a) - getProductMinPrice(b));
}

// ---------------------------------------------------------------------------
// Main PDF builder
// ---------------------------------------------------------------------------

export function buildReadyStockPdfBytes(
  rawProducts: any[],
  edition: PdfEdition = "M1",
  yearMonth?: string
): Uint8Array {
  const locale = new Date().toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
  const ym = yearMonth ?? locale;

  // Select 40-50 products for this edition
  const products = selectEditionProducts(rawProducts, edition);

  // Group by tier
  function getTierProducts(tier: Tier): any[] {
    return products.filter((p) => {
      const price = getProductMinPrice(p);
      return price >= tier.min && (tier.max === Infinity ? true : price <= tier.max);
    });
  }

  const doc = new jsPDF({ unit: "pt", format: "a4" });

  // ============================================================
  // PAGE 1: Tier A + Tier B
  // ============================================================
  let y = drawPageHeader(doc, edition, ym, "Halaman 1 / 2  ·  Tier A & B");

  // Disclaimer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Harga & stok dapat berubah sewaktu-waktu. Hubungi tim sales kami untuk konfirmasi ketersediaan.",
    MARGIN,
    y
  );
  doc.setTextColor(0, 0, 0);
  y += 14;

  // Edition info bar
  doc.setFillColor(241, 245, 249); // slate-100
  doc.roundedRect(MARGIN, y, TABLE_W, 16, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105); // slate-600
  const totalP = products.length;
  const stableCount = Math.min(30, products.filter(p => getProductMinPrice(p) >= 1_000_000).length);
  const rotateCount = totalP - stableCount > 30 ? totalP - 30 : 0;
  doc.text(
    `Edisi ${edition} · ${ym} · ${totalP} produk pilihan  (${stableCount} tetap + ${totalP - stableCount > 0 ? totalP - Math.min(30, totalP) : 0} rotasi)`,
    MARGIN + 7,
    y + 10
  );
  doc.setTextColor(0, 0, 0);
  y += 24;

  let rowCounter = 0;
  for (const tier of TIERS_PAGE1) {
    const tierProducts = getTierProducts(tier);
    if (tierProducts.length === 0) continue;
    y = drawTierSection(doc, tier, tierProducts, y, rowCounter);
    rowCounter += tierProducts.length;
    y += 10; // spacing between tiers
  }

  drawPageFooter(doc, edition, ym);

  // ============================================================
  // PAGE 2: Tier C + Tier D
  // ============================================================
  doc.addPage();
  y = drawPageHeader(doc, edition, ym, "Halaman 2 / 2  ·  Tier C & D (Premium)");

  // Disclaimer again
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Produk tier premium — konsultasi harga & ketersediaan langsung dengan tim sales AndisLab.",
    MARGIN,
    y
  );
  doc.setTextColor(0, 0, 0);
  y += 18;

  rowCounter = 0;
  for (const tier of TIERS_PAGE2) {
    const tierProducts = getTierProducts(tier);
    if (tierProducts.length === 0) continue;
    y = drawTierSection(doc, tier, tierProducts, y, rowCounter);
    rowCounter += tierProducts.length;
    y += 10;
  }

  drawPageFooter(doc, edition, ym);

  const ab = doc.output("arraybuffer");
  return new Uint8Array(ab);
}
