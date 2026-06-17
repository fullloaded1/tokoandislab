-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "quotationId" TEXT;

-- CreateIndex
CREATE INDEX "Order_quotationId_idx" ON "Order"("quotationId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
