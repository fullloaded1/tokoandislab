import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { money, type DecimalValue } from "./money";

export interface InvoiceItem {
  name: string;
  sku: string | null;
  quantity: number;
  price: DecimalValue;
}

export interface InvoiceInput {
  orderNo: string;
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string;
  items: InvoiceItem[];
  subtotal: DecimalValue;
  taxAmount: DecimalValue;
  shippingFee: DecimalValue;
  totalAmount: DecimalValue;
  taxInvoiceNo: string | null;
}

export interface InvoiceData {
  invoiceNo: string;
  title: string;
  disclaimer: string;
  taxInvoiceNo: string | null;
  customer: {
    name: string;
    email: string;
    phone: string | null;
    address: string;
  };
  createdAt: Date;
  rows: Array<{
    name: string;
    sku: string | null;
    qty: number;
    unitPrice: string;
    lineTotal: string;
  }>;
  totals: {
    subtotal: string;
    tax: string;
    shipping: string;
    grand: string;
  };
}

export const INVOICE_TITLE = "INVOICE KOMERSIAL";
export const INVOICE_DISCLAIMER =
  "Dokumen ini adalah Invoice Komersial (tagihan), BUKAN Faktur Pajak. Faktur Pajak resmi diterbitkan terpisah melalui e-Faktur/Coretax DJP.";

export function buildInvoiceData(input: InvoiceInput): InvoiceData {
  return {
    invoiceNo: `INV-${input.orderNo}`,
    title: INVOICE_TITLE,
    disclaimer: INVOICE_DISCLAIMER,
    taxInvoiceNo: input.taxInvoiceNo,
    customer: {
      name: input.customerName,
      email: input.customerEmail,
      phone: input.customerPhone,
      address: input.shippingAddress,
    },
    createdAt: input.createdAt,
    rows: input.items.map((it) => ({
      name: it.name,
      sku: it.sku,
      qty: it.quantity,
      unitPrice: money.formatIDR(it.price),
      lineTotal: money.formatIDR(money.toDecimal(it.price).mul(it.quantity)),
    })),
    totals: {
      subtotal: money.formatIDR(input.subtotal),
      tax: money.formatIDR(input.taxAmount),
      shipping: money.formatIDR(input.shippingFee),
      grand: money.formatIDR(input.totalAmount),
    },
  };
}

export function buildInvoicePdfBytes(input: InvoiceInput): Uint8Array {
  const data = buildInvoiceData(input);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(data.title, margin, 60);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`No: ${data.invoiceNo}`, margin, 80);
  doc.text(`Tanggal: ${data.createdAt.toLocaleDateString("id-ID")}`, margin, 95);

  // Disclaimer prominen
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180, 30, 30);
  const wrapped = doc.splitTextToSize(data.disclaimer, 515);
  doc.text(wrapped, margin, 120);
  doc.setTextColor(0, 0, 0);

  let y = 120 + wrapped.length * 12 + 10;

  // Tagihan ke
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Tagihan kepada:", margin, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(data.customer.name, margin, y);
  y += 12;
  doc.text(data.customer.email, margin, y);
  y += 12;
  if (data.customer.phone) {
    doc.text(data.customer.phone, margin, y);
    y += 12;
  }
  const addrLines = doc.splitTextToSize(data.customer.address, 515);
  doc.text(addrLines, margin, y);
  y += addrLines.length * 12 + 10;

  // Tabel item
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Item", "SKU", "Qty", "Harga Satuan (DPP)", "Subtotal"]],
    body: data.rows.map((r) => [r.name, r.sku ?? "-", String(r.qty), r.unitPrice, r.lineTotal]),
    headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 9 },
  });

  // jspdf-autotable menyimpan posisi akhir tabel di `doc.lastAutoTable.finalY`
  // tetapi tipenya tidak diekspos resmi; cast minimal seperlunya.
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;

  // Totals (rata kanan)
  const totalsX = 380;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal (DPP):", totalsX, finalY);
  doc.text(data.totals.subtotal, 555, finalY, { align: "right" });
  doc.text("PPN:", totalsX, finalY + 14);
  doc.text(data.totals.tax, 555, finalY + 14, { align: "right" });
  doc.text("Ongkir:", totalsX, finalY + 28);
  doc.text(data.totals.shipping, 555, finalY + 28, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL:", totalsX, finalY + 48);
  doc.text(data.totals.grand, 555, finalY + 48, { align: "right" });

  if (data.taxInvoiceNo) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      `No. Faktur Pajak terkait (dari DJP): ${data.taxInvoiceNo}`,
      margin,
      finalY + 80
    );
  }

  // Output bytes
  const ab = doc.output("arraybuffer");
  return new Uint8Array(ab);
}
