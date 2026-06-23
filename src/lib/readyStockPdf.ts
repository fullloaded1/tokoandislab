import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { money } from "./money";

export function buildReadyStockPdfBytes(products: any[]): Uint8Array {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;

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
    // calculate total stock from variants
    const totalStock = p.variants ? p.variants.reduce((acc: number, v: any) => acc + Math.max(0, v.stock - v.reservedStock), 0) : 0;
    
    // some products hide prices
    const priceStr = p.isRequestPricing ? "Hubungi Sales" : money.formatIDR(p.price);
    
    const stockStr = totalStock > 0 ? `${totalStock} (Ready)` : "Indent";
    
    return [
      String(i + 1),
      p.name,
      p.model || "-",
      p.brand || "-",
      priceStr,
      stockStr,
    ];
  });

  autoTable(doc, {
    startY: 120,
    margin: { left: margin, right: margin },
    head: [["No", "Nama Alat", "Model", "Brand", "Harga", "Stock/Indent"]],
    body: rows,
    headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: "bold" }, // Emerald 500
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 30 },
      4: { halign: "right" },
      5: { cellWidth: 60, halign: "center" },
    }
  });

  const ab = doc.output("arraybuffer");
  return new Uint8Array(ab);
}
