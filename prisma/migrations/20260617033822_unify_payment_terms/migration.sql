/*
  Warnings:

  - You are about to drop the `PaymentTerm` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_projectId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentTerm" DROP CONSTRAINT "PaymentTerm_orderId_fkey";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "orderId" TEXT,
ALTER COLUMN "projectId" DROP NOT NULL;

-- Migrate Data from PaymentTerm to Invoice BEFORE dropping
INSERT INTO "Invoice" (
  "id", "orderId", "invoiceNo", "amount", "paidAmount",
  "dueDate", "paidAt", "status", "type", "paymentProof", "createdAt", "updatedAt"
)
SELECT
  "id",
  "orderId",
  'INV-MIG-' || "id",
  "amount",
  CASE WHEN "status" = 'PAID' THEN "amount" ELSE 0 END,         -- paidAmount konsisten utk PAID
  "dueDate",
  CASE WHEN "status" = 'PAID' THEN "updatedAt" ELSE NULL END,   -- paidAt utk PAID
  CASE
    WHEN "status" = 'PAID' THEN 'PAID'::"InvoiceStatus"
    ELSE 'UNPAID'::"InvoiceStatus"                              -- UNPAID & WAITING_VERIFICATION -> UNPAID
  END,
  'TERMIN'::"InvoiceType",
  "proofUrl",
  "createdAt",
  "updatedAt"
FROM "PaymentTerm";

-- DropTable
DROP TABLE "PaymentTerm";

-- DropEnum
DROP TYPE "PaymentTermStatus";

-- CreateIndex
CREATE INDEX "Invoice_orderId_idx" ON "Invoice"("orderId");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
