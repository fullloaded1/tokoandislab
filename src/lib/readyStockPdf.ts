import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { money } from "./money";

// ---------------------------------------------------------------------------
// Tier classification — harus sinkron dengan ready-stock/page.tsx
// A: 1–30 jt | B: 31–70 jt | C: 70–200 jt | D: >200 jt
// ---------------------------------------------------------------------------
interface Tier {
  id: string;
  label: string;
  range: string;
  description: string;
  min: number;
  max: number;
  headerRgb: [number, number, number];
}

const TIERS: Tier[] = [
  {
    id: "A",
    label: "Tier A",
    range: "Rp 1 jt – Rp 30 jt",
    description: "Alat entry-level & mid-range terjangkau",
    min: 1_000_000,
    max: 30_000_000,
    headerRgb: [16, 185, 129], // emerald-500
  },
  {
    id: "B",
    label: "Tier B",
    range: "Rp 31 jt – Rp 70 jt",
    description: "Alat profesional performa tinggi",
    min: 30_000_001,
    max: 70_000_000,
    headerRgb: [59, 130, 246], // blue-500
  },
  {
    id: "C",
    label: "Tier C",
    range: "Rp 71 jt – Rp 200 jt",
    description: "Alat riset & industri grade",
    min: 70_000_001,
    max: 200_000_000,
    headerRgb: [139, 92, 246], // violet-500
  },
  {
    id: "D",
    label: "Tier D — Premium",
    range: "> Rp 200 jt",
    description: "Instrumen analitik & sistem otomasi kelas atas — Konsultasi khusus dengan tim sales",
    min: 200_000_001,
    max: Infinity,
    headerRgb: [245, 158, 11], // amber-500
  },
];

function getProductMinPrice(p: any): number {
  if (p.variants && p.variants.length > 0) {
    const prices = p.variants
      .map((v: any) => money.toDecimal(v.price).toNumber())
      .filter((pr: number) => pr > 0);
    if (prices.length > 0) return Math.min(...prices);
  }
  const base = money.toDecimal(p.price).toNumber();
  return base;
}

function buildRows(products: any[]): string[][] {
  return products.map((p, i) => {
    const totalStock = p.variants
      ? p.variants.reduce((acc: number, v: any) => acc + Math.max(0, v.stock - v.reservedStock), 0)
      : 0;
    const priceStr = p.isRequestPricing ? "Hubungi Sales" : money.formatIDR(p.price);
    const stockStr = totalStock > 0 ? `${totalStock} (Ready)` : "Indent";
    return [String(i + 1), p.name, p.model || "-", p.brand || "-", priceStr, stockStr];
  });
}

export function buildReadyStockPdfBytes(products: any[]): Uint8Array {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  // A4 usable width = 595 - 2*40 = 515pt

  // ---- Cover header ----
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Katalog Ready Stock - AndisLab", margin, 56);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Dicetak pada: ${new Date().toLocaleDateString("id-ID")}`, margin, 72);

  const disclaimer =
    "Harga dan stok dapat berubah sewaktu-waktu. Silakan hubungi tim sales kami untuk konfirmasi ketersediaan.";
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  doc.text(disclaimer, margin, 86);
  doc.setTextColor(0, 0, 0);

  // ---- Tier legend summary ----
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Klasifikasi Harga:", margin, 106);
  const legendItems = [
    "Tier A : Rp 1 jt – 30 jt",
    "Tier B : Rp 31 jt – 70 jt",
    "Tier C : Rp 71 jt – 200 jt",
    "Tier D : > Rp 200 jt (Premium)",
  ];
  const legendColors: [number, number, number][] = [
    [16, 185, 129],
    [59, 130, 246],
    [139, 92, 246],
    [245, 158, 11],
  ];
  legendItems.forEach((item, idx) => {
    const x = margin + idx * 130;
    doc.setFillColor(...legendColors[idx]);
    doc.roundedRect(x, 112, 8, 8, 2, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(8);
    doc.text(item, x + 11, 119);
  });
  doc.setTextColor(0, 0, 0);

  let startY = 130;
  let isFirstTable = true;

  // Sort all products by min price ascending
  const sorted = [...products].sort(
    (a, b) => getProductMinPrice(a) - getProductMinPrice(b)
  );

  // Uncategorized (<1jt or no price)
  const uncategorized = sorted.filter((p) => getProductMinPrice(p) < 1_000_000);

  for (const tier of TIERS) {
    const tierProducts = sorted.filter((p) => {
      const price = getProductMinPrice(p);
      return price >= tier.min && (tier.max === Infinity ? true : price <= tier.max);
    });

    if (tierProducts.length === 0) continue;

    if (!isFirstTable) {
      // Add spacing before each tier section
      startY += 12;
      // If too close to bottom, new page
      if (startY > 700) {
        doc.addPage();
        startY = 50;
      }
    }
    isFirstTable = false;

    // Section header background bar
    doc.setFillColor(...tier.headerRgb);
    doc.roundedRect(margin, startY, 515, 22, 4, 4, "F");

    // Section header text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(
      `${tier.label}  ·  ${tier.range}  ·  ${tier.description}  (${tierProducts.length} produk)`,
      margin + 8,
      startY + 14
    );
    doc.setTextColor(0, 0, 0);

    const rows = buildRows(tierProducts);

    autoTable(doc, {
      startY: startY + 26,
      margin: { left: margin, right: margin },
      tableWidth: 515,
      head: [["No", "Nama Alat", "Model", "Brand", "Harga", "Stok"]],
      body: rows,
      headStyles: {
        fillColor: tier.headerRgb,
        textColor: 255,
        fontStyle: "bold",
        fontSize: 8,
      },
      styles: { fontSize: 8, overflow: "linebreak", cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 25, halign: "center" },
        1: { cellWidth: 170 },
        2: { cellWidth: 90 },
        3: { cellWidth: 75 },
        4: { cellWidth: 95, halign: "right" },
        5: { cellWidth: 60, halign: "center" },
      },
      alternateRowStyles: { fillColor: [245, 250, 247] },
      didDrawPage: (data) => {
        // Footer on each page
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `AndisLab — Katalog Ready Stock  |  Halaman ${pageCount}`,
          margin,
          doc.internal.pageSize.height - 20
        );
        doc.setTextColor(0, 0, 0);
      },
    });

    startY = (doc as any).lastAutoTable.finalY ?? startY + 100;
  }

  // Uncategorized / no price section
  if (uncategorized.length > 0) {
    startY += 12;
    if (startY > 700) {
      doc.addPage();
      startY = 50;
    }

    doc.setFillColor(100, 116, 139); // slate-500
    doc.roundedRect(margin, startY, 515, 22, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(
      `Hubungi Sales  ·  Harga Sesuai Permintaan  (${uncategorized.length} produk)`,
      margin + 8,
      startY + 14
    );
    doc.setTextColor(0, 0, 0);

    autoTable(doc, {
      startY: startY + 26,
      margin: { left: margin, right: margin },
      tableWidth: 515,
      head: [["No", "Nama Alat", "Model", "Brand", "Harga", "Stok"]],
      body: buildRows(uncategorized),
      headStyles: {
        fillColor: [100, 116, 139],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 8,
      },
      styles: { fontSize: 8, overflow: "linebreak", cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 25, halign: "center" },
        1: { cellWidth: 170 },
        2: { cellWidth: 90 },
        3: { cellWidth: 75 },
        4: { cellWidth: 95, halign: "right" },
        5: { cellWidth: 60, halign: "center" },
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
  }

  const ab = doc.output("arraybuffer");
  return new Uint8Array(ab);
}
