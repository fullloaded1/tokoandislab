-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "taxInvoiceNo" TEXT,
ADD COLUMN     "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 11;
