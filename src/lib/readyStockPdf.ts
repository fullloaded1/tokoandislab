import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { money } from "./money";

export function buildReadyStockPdfBytes(products: any[]): Uint8Array {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  // A4 usable width = 595 - 2*40 = 515pt

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Katalog Ready Stock - AndisLab", margin, 60);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Dicetak pada: ${new Date().toLocaleDateString("id-ID")}`, margin, 80);

  const disclaimer = "Harga dan stok dapat berubah sewaktu-waktu. Silakan hubungi tim sales kami untuk konfirmasi ketersediaan.";
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  doc.text(disclaimer, margin, 100);
  doc.setTextColor(0, 0, 0);

  const rows = products.map((p, i) => {
    const totalStock = p.variants
      ? p.variants.reduce((acc: number, v: any) => acc + Math.max(0, v.stock - v.reservedStock), 0)
      : 0;
    const priceStr = p.isRequestPricing ? "Hubungi Sales" : money.formatIDR(p.price);
    const stockStr = totalStock > 0 ? `${totalStock} (Ready)` : "Indent";
    return [String(i + 1), p.name, p.model || "-", p.brand || "-", priceStr, stockStr];
  });

  autoTable(doc, {
    startY: 120,
    margin: { left: margin, right: margin },
    tableWidth: 515,
    head: [["No", "Nama Alat", "Model", "Brand", "Harga", "Stok"]],
    body: rows,
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9,
    },
    styles: { fontSize: 9, overflow: "linebreak", cellPadding: 5 },
    columnStyles: {
      0: { cellWidth: 25, halign: "center" },
      1: { cellWidth: 170 },
      2: { cellWidth: 90 },
      3: { cellWidth: 75 },
      4: { cellWidth: 95, halign: "right" },
      5: { cellWidth: 60, halign: "center" },
    },
    alternateRowStyles: { fillColor: [245, 250, 247] },
  });

  const ab = doc.output("arraybuffer");
  return new Uint8Array(ab);
}
