import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { money } from "./money";
import { WA_NUMBER_DISPLAY } from "./contact";

export interface PromoMerdekaProductInput {
  id?: string;
  name: string;
  model?: string | null;
  brand?: string | null;
  categoryLabel?: string | null;
  price: any;
  isReadyStock?: boolean;
  isRequestPricing?: boolean;
  variants?: any[];
}

export function calculatePromoMerdekaPrice(rawPrice: any): {
  hargaNormal: number;
  hargaPromo: number | null;
  isBelowThreshold: boolean;
  hemat: number | null;
} {
  const dec = money.toDecimal(rawPrice || 0);
  const hargaNormal = dec.toNumber();
  
  if (hargaNormal <= 0) {
    return { hargaNormal: 0, hargaPromo: null, isBelowThreshold: false, hemat: null };
  }

  const threshold = 20000000;
  const isBelowThreshold = hargaNormal < threshold;

  if (isBelowThreshold) {
    // Diskon 17%
    const promoDec = dec.mul(83).dividedBy(100).toDecimalPlaces(0);
    const hargaPromo = promoDec.toNumber();
    const hemat = dec.minus(promoDec).toNumber();
    return { hargaNormal, hargaPromo, isBelowThreshold, hemat };
  } else {
    // Di atas 20 juta = Bundling Gratis Consumables
    return { hargaNormal, hargaPromo: null, isBelowThreshold, hemat: null };
  }
}

export function buildPromoMerdekaPdfBytes(products: PromoMerdekaProductInput[]): Uint8Array {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;

  // Header Theme Merah Putih (HUT RI ke-81)
  doc.setFillColor(220, 38, 38); // Red 600
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 85, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("KATALOG PROMO MERDEKA ANDISLAB", margin, 40);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(254, 240, 138); // Yellow 200
  doc.text("HUT RI Ke-81 • Diskon 17% & Bundling Gratis Consumables", margin, 60);

  // Subheader & Metadata info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Periode Order: 13 Juli – 14 Agustus 2026 | Pengiriman: 17 – 31 Agustus 2026`, margin, 110);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Dicetak pada: ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })} • Semua produk tercantum adalah READY STOCK.`,
    margin,
    126
  );
  doc.setTextColor(0, 0, 0);

  // Pisahkan produk < 20 juta (Diskon 17%) dan >= 20 juta (Bundling)
  const diskonItems: any[][] = [];
  const bundlingItems: any[][] = [];

  let countDiskon = 1;
  let countBundling = 1;

  for (const p of products) {
    if (p.isRequestPricing) continue;
    const { hargaNormal, hargaPromo, isBelowThreshold, hemat } = calculatePromoMerdekaPrice(p.price);
    if (hargaNormal <= 0) continue;

    const brandCat = [p.brand, p.categoryLabel].filter(Boolean).join(" - ") || "-";

    if (isBelowThreshold && hargaPromo != null && hemat != null) {
      diskonItems.push([
        String(countDiskon++),
        p.name,
        brandCat,
        money.formatIDR(hargaNormal),
        money.formatIDR(hargaPromo),
        `Hemat ${money.formatIDR(hemat)} (-17%)`,
      ]);
    } else {
      bundlingItems.push([
        String(countBundling++),
        p.name,
        brandCat,
        money.formatIDR(hargaNormal),
        "Gratis Consumables Pilihan (Senilai up to Rp 3 Juta)",
      ]);
    }
  }

  let currentY = 145;

  // Bagian 1: Diskon 17%
  if (diskonItems.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(185, 28, 28); // Red 700
    doc.text("1. PRODUK DISKON 17% (< Rp 20 Juta)", margin, currentY);
    currentY += 10;

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["No", "Nama Alat", "Brand / Kategori", "Harga Normal", "Harga Promo (-17%)", "Keuntungan"]],
      body: diskonItems,
      headStyles: { fillColor: [220, 38, 38], textColor: 255, fontStyle: "bold" },
      styles: { fontSize: 8.5, cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: 25, halign: "center" },
        3: { halign: "right", textColor: [120, 120, 120] },
        4: { halign: "right", fontStyle: "bold", textColor: [185, 28, 28] },
        5: { fontStyle: "bold", textColor: [16, 185, 129] },
      },
      didDrawPage: (data) => {
        currentY = (data.cursor?.y || currentY) + 25;
      },
    });

    // Update currentY setelah autoTable
    currentY = (doc as any).lastAutoTable.finalY + 30;
  }

  // Cek apakah muat di halaman yang sama
  if (currentY > doc.internal.pageSize.getHeight() - 150) {
    doc.addPage();
    currentY = 50;
  }

  // Bagian 2: Bundling Gratis Consumables
  if (bundlingItems.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(185, 28, 28);
    doc.text("2. ALAT SPESIAL BUNDLING GRATIS CONSUMABLES (≥ Rp 20 Juta)", margin, currentY);
    currentY += 10;

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["No", "Nama Alat", "Brand / Kategori", "Harga Normal", "Paket Bundling Eksklusif"]],
      body: bundlingItems,
      headStyles: { fillColor: [185, 28, 28], textColor: 255, fontStyle: "bold" },
      styles: { fontSize: 8.5, cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: 25, halign: "center" },
        3: { halign: "right", fontStyle: "bold" },
        4: { fontStyle: "bold", textColor: [16, 185, 129] },
      },
      didDrawPage: (data) => {
        currentY = (data.cursor?.y || currentY) + 25;
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 35;
  }

  // Cek untuk Footer T&C
  if (currentY > doc.internal.pageSize.getHeight() - 130) {
    doc.addPage();
    currentY = 50;
  }

  // Footer / Syarat & Ketentuan
  doc.setFillColor(254, 242, 242); // Red 50
  doc.setDrawColor(254, 202, 202); // Red 200
  doc.roundedRect(margin, currentY, doc.internal.pageSize.getWidth() - margin * 2, 80, 6, 6, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(185, 28, 28);
  doc.text("Syarat & Ketentuan Promo MERDEKA AndisLab:", margin + 15, currentY + 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(70, 70, 70);
  doc.text("1. Harga promo langsung terkunci saat Purchase Order (PO) ditandatangani — bebas dari risiko kenaikan harga.", margin + 15, currentY + 36);
  doc.text("2. Harga yang tercantum belum termasuk PPN 12% dan ongkos kirim (kecuali area tertentu yang bebas ongkir).", margin + 15, currentY + 50);
  doc.text(`3. Order & konsultasi resmi langsung melalui WhatsApp: ${WA_NUMBER_DISPLAY} atau website AndisLab.com`, margin + 15, currentY + 64);

  const ab = doc.output("arraybuffer");
  return new Uint8Array(ab);
}
