import { prisma } from "./db";
import { StockLogType, OrderStatus } from "@prisma/client";

/**
 * Helper untuk menghitung stok yang benar-benar bisa dibeli (ketersediaan).
 * Stok riil (stock) dikurangi dengan stok yang sedang dipesan tapi belum dibayar (reservedStock).
 */
export function getAvailable(variant: { stock: number; reservedStock: number }): number {
  return Math.max(0, variant.stock - variant.reservedStock);
}

/**
 * Aturan T3.6: order kedaluwarsa kalau masih PENDING_PAYMENT dan semua reservasi
 * stok-nya sudah dilepas (kosong). Diekspos sebagai pure function biar bisa diuji.
 */
export function shouldCancelExpiredOrder(order: {
  status: OrderStatus;
  reservations: { id: string }[];
}): boolean {
  return order.status === OrderStatus.PENDING_PAYMENT && order.reservations.length === 0;
}

/**
 * Menambah, mengurangi, atau mengkoreksi stok melalui Database Transaction.
 * Setiap perubahan wajib dicatat di StockLog sebagai ledger audit.
 */
export async function adjustStock({
  variantId,
  quantity,
  type,
  notes,
  actorId,
}: {
  variantId: string;
  quantity: number;
  type: StockLogType;
  notes?: string;
  actorId?: string;
}) {
  return await prisma.$transaction(async (tx) => {
    const variant = await tx.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      throw new Error(`Variant dengan ID ${variantId} tidak ditemukan.`);
    }

    let newStock = variant.stock;
    if (type === StockLogType.IN) {
      newStock += quantity;
    } else if (type === StockLogType.OUT) {
      newStock -= quantity;
    } else if (type === StockLogType.ADJUST) {
      newStock = quantity;
    }

    if (newStock < 0) {
      throw new Error(`Koreksi ditolak: Stok tidak boleh minus. Sisa stok: ${variant.stock}`);
    }

    const updatedVariant = await tx.productVariant.update({
      where: { id: variantId },
      data: { stock: newStock },
    });

    await tx.stockLog.create({
      data: {
        variantId,
        type,
        quantity: type === StockLogType.ADJUST ? quantity : Math.abs(quantity),
        notes: notes || null,
        actorId: actorId || null,
      },
    });

    return updatedVariant;
  });
}

/**
 * Lepas semua StockReservation yang sudah kedaluwarsa, dan bila Order terkait masih
 * PENDING_PAYMENT serta sudah tidak punya reservasi aktif, set Order → CANCELLED (T3.6).
 */
export async function releaseExpiredReservations(): Promise<{
  released: number;
  cancelled: number;
}> {
  const now = new Date();

  const expired = await prisma.stockReservation.findMany({
    where: { expiresAt: { lt: now } },
  });

  if (expired.length === 0) return { released: 0, cancelled: 0 };

  const touchedOrderIds = new Set<string>();
  let released = 0;

  for (const r of expired) {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.productVariant.update({
          where: { id: r.variantId },
          data: { reservedStock: { decrement: r.quantity } },
        });
        await tx.stockReservation.delete({ where: { id: r.id } });
      });
      released++;
      if (r.orderId) touchedOrderIds.add(r.orderId);
    } catch (e) {
      console.error(`Gagal release reservasi ${r.id}`, e);
    }
  }

  let cancelled = 0;
  for (const orderId of touchedOrderIds) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { reservations: { select: { id: true } } },
      });
      if (!order) continue;
      if (!shouldCancelExpiredOrder(order)) continue;

      await prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });
      cancelled++;
    } catch (e) {
      console.error(`Gagal cancel order ${orderId}`, e);
    }
  }

  return { released, cancelled };
}
