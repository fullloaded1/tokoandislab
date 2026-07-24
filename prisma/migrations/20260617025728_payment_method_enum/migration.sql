/*
  Warnings:

  - Changed the type of `paymentMethod` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PAYMENT_GATEWAY', 'MANUAL_TRANSFER', 'TERM_OF_PAYMENT');

-- Normalize Legacy Data
-- Map variations of gateway
UPDATE "Order" SET "paymentMethod" = 'PAYMENT_GATEWAY' WHERE "paymentMethod" ILIKE '%midtrans%' OR "paymentMethod" ILIKE '%gateway%' OR "paymentMethod" ILIKE '%online%';
-- Map variations of transfer
UPDATE "Order" SET "paymentMethod" = 'MANUAL_TRANSFER' WHERE "paymentMethod" ILIKE '%transfer%' OR "paymentMethod" ILIKE '%manual%' OR "paymentMethod" ILIKE '%bank%';
-- Map variations of terms
UPDATE "Order" SET "paymentMethod" = 'TERM_OF_PAYMENT' WHERE "paymentMethod" ILIKE '%term%' OR "paymentMethod" ILIKE '%tempo%' OR "paymentMethod" ILIKE '%credit%' OR "paymentMethod" ILIKE '%invoice%';

-- Handle unmapped values explicitly by logging them into AuditLog and defaulting to MANUAL_TRANSFER
INSERT INTO "AuditLog" (id, action, "entityType", "entityId", "actorId", "oldValue", notes, "createdAt")
SELECT
  gen_random_uuid()::text,
  'PAYMENT_METHOD_MIGRATION',
  'Order',
  id,
  'system',                                                    -- actorId non-null (NOT NULL pada titik migrasi ini)
  "paymentMethod",
  'Unmapped legacy payment method migrated to MANUAL_TRANSFER',
  NOW()
FROM "Order"
WHERE "paymentMethod" NOT IN ('PAYMENT_GATEWAY', 'MANUAL_TRANSFER', 'TERM_OF_PAYMENT');

UPDATE "Order" 
SET "paymentMethod" = 'MANUAL_TRANSFER'
WHERE "paymentMethod" NOT IN ('PAYMENT_GATEWAY', 'MANUAL_TRANSFER', 'TERM_OF_PAYMENT');

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "paymentMethod" TYPE "PaymentMethod" USING "paymentMethod"::"text"::"PaymentMethod";
