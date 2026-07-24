"use server";

import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { canTransition, requiresTracking } from "@/lib/orderState";
import { generateGuestAccessToken, generateOrderNo } from "@/lib/orderCodes";
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

export async function createRFQOrder(payload: { quotationId: string }) {
  const session = await verifySession();
  if (!session) return { success: false, error: "Tidak terautentikasi." };

  try {
    const quotation = await prisma.quotation.findUnique({
      where: { id: payload.quotationId },
      include: { 
        items: { include: { variant: { include: { product: true } } } }, 
        inquiry: { include: { institution: { include: { contacts: true } } } } 
      }
    });

    if (!quotation) return { success: false, error: "Quotation tidak ditemukan." };

    // Get or create customer based on institution contact
    const contact = quotation.inquiry.institution.contacts[0];
    if (!contact) return { success: false, error: "Institusi tidak memiliki kontak (email wajib)." };

    const customer = await prisma.customer.upsert({
      where: { email: contact.email },
      create: {
        email: contact.email,
        name: contact.name,
        phone: contact.phone,
        institutionId: quotation.inquiry.institutionId,
        status: "REGISTERED",
      },
      update: {
        name: contact.name,
        phone: contact.phone,
        institutionId: quotation.inquiry.institutionId,
      }
    });

    // Check if order already exists
    const existingOrder = await prisma.order.findFirst({
      where: { quotationId: quotation.id }
    });
    if (existingOrder) return { success: false, error: "Order sudah dibuat untuk quotation ini." };

    // Import the functions here or use a simple fallback if not imported at top
    // Since we don't want to mess up imports at the top right now, we can inline or assume it exists if we imported it. 
    // Wait, let's just use `generateOrderNo` properly by adding it to imports or implementing inline.
    const orderNo = `${generateOrderNo()}-RFQ`;
    const guestAccessToken = generateGuestAccessToken();
    const guestAccessTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const order = await prisma.order.create({
      data: {
        orderNo,
        orderType: "RFQ",
        status: "PENDING_PAYMENT",
        customerId: customer.id,
        quotationId: quotation.id,
        subtotal: quotation.subtotal,
        taxAmount: quotation.tax,
        shippingFee: quotation.shippingFee,
        totalAmount: quotation.totalAmount,
        paymentMethod: "TERM_OF_PAYMENT",
        shippingAddress: quotation.inquiry.institution.address,
        shippingRegion: "OTHER", // Default or extract if possible
        guestAccessToken,
        guestAccessTokenExpiresAt,
        priceDisplayMode: "EXCLUDE_PPN",
        items: {
          create: quotation.items.map(item => ({
            variantId: item.variantId,
            name: item.name,
            sku: item.variant?.sku || "-",
            price: item.price,
            quantity: item.quantity
          }))
        }
      }
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entityType: "Order",
        entityId: order.id,
        actorId: session.username,
        newValue: JSON.stringify({ orderNo: order.orderNo, quotationId: quotation.id }),
        notes: "Membuat Order RFQ dari Quotation",
      }
    });

    revalidatePath("/admin/orders");
    return { success: true, orderId: order.id };
  } catch (e) {
    console.error("Failed to create RFQ order:", e);
    const msg = e instanceof Error ? e.message : "Gagal membuat Order dari Quotation";
    return { success: false, error: msg };
  }
}
