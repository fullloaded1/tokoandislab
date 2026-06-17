/*
  Warnings:

  - Changed the type of `paymentMethod` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PAYMENT_GATEWAY', 'MANUAL_TRANSFER', 'TERM_OF_PAYMENT');

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "paymentMethod" TYPE "PaymentMethod" USING "paymentMethod"::"text"::"PaymentMethod";
