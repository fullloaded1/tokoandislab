import { describe, it, expect } from "vitest";
import {
  buildInvoiceData,
  INVOICE_DISCLAIMER,
  INVOICE_TITLE,
  type InvoiceInput,
} from "./commercialInvoice";

const sample: InvoiceInput = {
  orderNo: "ORD-260615-A1B2C3",
  createdAt: new Date("2026-06-15T10:00:00Z"),
  customerName: "Budi Santoso",
  customerEmail: "budi@example.com",
  customerPhone: "0812345678",
  shippingAddress: "Jl. Mawar No. 1, Jakarta",
  items: [
    { name: "Mikroskop X - Standard", sku: "SKU-1", quantity: 2, price: 1_000_000 },
    { name: "Pipet Y - 10ml", sku: null, quantity: 3, price: 50_000 },
  ],
  subtotal: 2_150_000,
  taxAmount: 236_500,
  shippingFee: 50_000,
  totalAmount: 2_436_500,
  taxInvoiceNo: null,
};

describe("commercialInvoice — buildInvoiceData", () => {
  it("invoiceNo format INV-<orderNo>", () => {
    const d = buildInvoiceData(sample);
    expect(d.invoiceNo).toBe("INV-ORD-260615-A1B2C3");
  });

  it("title = INVOICE KOMERSIAL (bukan Faktur Pajak)", () => {
    const d = buildInvoiceData(sample);
    expect(d.title).toBe(INVOICE_TITLE);
    expect(d.title).not.toMatch(/faktur pajak/i);
  });

  it("disclaimer eksplisit menyatakan BUKAN Faktur Pajak", () => {
    const d = buildInvoiceData(sample);
    expect(d.disclaimer).toBe(INVOICE_DISCLAIMER);
    expect(d.disclaimer.toLowerCase()).toContain("bukan faktur pajak");
    expect(d.disclaimer.toLowerCase()).toContain("djp");
  });

  it("rows menampilkan qty + harga satuan + line total per item", () => {
    const d = buildInvoiceData(sample);
    expect(d.rows).toHaveLength(2);
    expect(d.rows[0].qty).toBe(2);
    expect(d.rows[0].unitPrice).toMatch(/1\.000\.000/);
    expect(d.rows[0].lineTotal).toMatch(/2\.000\.000/); // 2 × 1jt
    expect(d.rows[1].lineTotal).toMatch(/150\.000/); // 3 × 50k
  });

  it("totals format Rupiah & cocok dgn input order", () => {
    const d = buildInvoiceData(sample);
    expect(d.totals.subtotal).toMatch(/2\.150\.000/);
    expect(d.totals.tax).toMatch(/236\.500/);
    expect(d.totals.shipping).toMatch(/50\.000/);
    expect(d.totals.grand).toMatch(/2\.436\.500/);
  });

  it("taxInvoiceNo dipertahankan apa adanya (tidak dibuat sendiri)", () => {
    expect(buildInvoiceData(sample).taxInvoiceNo).toBeNull();
    expect(
      buildInvoiceData({ ...sample, taxInvoiceNo: "010.000-26.12345678" }).taxInvoiceNo
    ).toBe("010.000-26.12345678");
  });
});
