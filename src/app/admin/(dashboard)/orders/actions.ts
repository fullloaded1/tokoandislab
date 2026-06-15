"use server";

import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { canTransition, requiresTracking } from "@/lib/orderState";
import { sendOrderNotification, type OrderNotificationKind } from "@/lib/orderNotification";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

const NOTIFY_ON: Partial<Record<OrderStatus, OrderNotificationKind>> = {
  PAID: "PAID",
  SHIPPED: "SHIPPED",
  CANCELLED: "CANCELLED",
};

export async function updateOrderStatus(payload: {
  orderId: string;
  toStatus: OrderStatus;
  trackingNumber?: string;
  notes?: string;
}) {
  const session = await verifySession();
  if (!session) return { success: false, error: "Tidak terautentikasi." };

  const order = await prisma.order.findUnique({
    where: { id: payload.orderId },
    select: {
      id: true,
      orderNo: true,
      status: true,
      trackingNumber: true,
    },
  });
  if (!order) return { success: false, error: "Order tidak ditemukan." };

  if (!canTransition(order.status, payload.toStatus)) {
    return {
      success: false,
      error: `Transisi ${order.status} → ${payload.toStatus} tidak diizinkan.`,
    };
  }

  if (requiresTracking(payload.toStatus) && !payload.trackingNumber?.trim()) {
    return { success: false, error: "Nomor resi wajib diisi sebelum kirim." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const updateData: {
        status: OrderStatus;
        trackingNumber?: string;
        shippedAt?: Date;
      } = { status: payload.toStatus };

      if (payload.trackingNumber?.trim()) {
        updateData.trackingNumber = payload.trackingNumber.trim();
      }
      if (payload.toStatus === OrderStatus.SHIPPED) {
        updateData.shippedAt = new Date();
      }

      await tx.order.update({
        where: { id: order.id },
        data: updateData,
      });

      await tx.auditLog.create({
        data: {
          action: "UPDATE_ORDER_STATUS",
          entityType: "Order",
          entityId: order.id,
          actorId: session.username,
          oldValue: JSON.stringify({
            status: order.status,
            trackingNumber: order.trackingNumber,
          }),
          newValue: JSON.stringify({
            status: payload.toStatus,
            trackingNumber: updateData.trackingNumber ?? order.trackingNumber,
          }),
          notes: payload.notes ?? null,
        },
      });
    });

    revalidatePath("/admin/orders");

    const kind = NOTIFY_ON[payload.toStatus];
    if (kind) {
      sendOrderNotification(order.id, kind).catch(() => {});
    }

    return { success: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Gagal update status";
    return { success: false, error: msg };
  }
}
