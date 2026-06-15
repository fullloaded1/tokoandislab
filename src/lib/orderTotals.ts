import { Prisma } from "@prisma/client";
import { money, type DecimalValue } from "./money";

export interface OrderLineInput {
  price: DecimalValue;
  quantity: number;
}

export interface OrderTotals {
  subtotal: Prisma.Decimal;
  taxAmount: Prisma.Decimal;
  shippingFee: Prisma.Decimal;
  totalAmount: Prisma.Decimal;
}

/**
 * Hitung total order dari komponen DPP. Selalu pakai Decimal — tidak ada operator
 * JS biasa di sini. taxAmount dihitung dari DPP (K1).
 *
 * Invariant: subtotal + taxAmount + shippingFee == totalAmount (lossless).
 */
export function calculateOrderTotals(
  items: OrderLineInput[],
  taxRatePercent: DecimalValue,
  shippingFee: DecimalValue
): OrderTotals {
  const subtotal = items.reduce(
    (acc, item) => acc.add(money.toDecimal(item.price).mul(item.quantity)),
    new Prisma.Decimal(0)
  );
  const taxAmount = money.applyTax(subtotal, taxRatePercent);
  const fee = money.toDecimal(shippingFee);
  const totalAmount = subtotal.add(taxAmount).add(fee);
  return { subtotal, taxAmount, shippingFee: fee, totalAmount };
}
