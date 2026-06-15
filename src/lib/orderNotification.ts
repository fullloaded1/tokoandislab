import { prisma } from "./db";
import { money } from "./money";

export type OrderNotificationKind = "CREATED" | "PAID" | "SHIPPED" | "CANCELLED";

/**
 * Resolve base URL utk link guest. Urutan:
 *  1. NEXT_PUBLIC_APP_URL (manual override — set ini kalau punya custom domain)
 *  2. VERCEL_PROJECT_PRODUCTION_URL (URL produksi Vercel yg stabil — tidak berubah tiap deploy)
 *  3. VERCEL_URL (URL per-deployment — bisa berubah, fallback terakhir)
 *  4. localhost (dev)
 */
function resolveAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function buildOrderStatusUrl(token: string): string {
  return `${resolveAppUrl()}/order-status/${token}`;
}

interface MessageCtx {
  customerName: string;
  orderNo: string;
  total: string;
  statusUrl: string;
}

export function buildOrderMessage(kind: OrderNotificationKind, ctx: MessageCtx): string {
  const head = `Halo ${ctx.customerName},`;
  const tail = `Pantau status pesanan Anda: ${ctx.statusUrl}`;
  switch (kind) {
    case "CREATED":
      return `${head} pesanan ${ctx.orderNo} senilai ${ctx.total} telah kami terima dan menunggu pembayaran. ${tail}`;
    case "PAID":
      return `${head} pembayaran pesanan ${ctx.orderNo} sudah kami terima. Pesanan akan segera diproses. ${tail}`;
    case "SHIPPED":
      return `${head} pesanan ${ctx.orderNo} sudah dikirim. ${tail}`;
    case "CANCELLED":
      return `${head} pesanan ${ctx.orderNo} dibatalkan. ${tail}`;
  }
}

/**
 * Log notifikasi ke WhatsAppLog (paper trail). T3.8 belum mengirim ke WA gateway
 * sungguhan — fokus pada audit + page status guest. Hook gateway diisi nanti.
 */
export async function sendOrderNotification(orderId: string, kind: OrderNotificationKind): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { customer: { select: { name: true, phone: true, email: true } } },
  });
  if (!order || !order.guestAccessToken) return;

  const statusUrl = buildOrderStatusUrl(order.guestAccessToken);
  const message = buildOrderMessage(kind, {
    customerName: order.customer?.name ?? "Pelanggan",
    orderNo: order.orderNo,
    total: money.formatIDR(order.totalAmount),
    statusUrl,
  });

  try {
    await prisma.whatsAppLog.create({
      data: {
        source: `order_notif_${kind.toLowerCase()}`,
        inquiryNo: order.orderNo,
        messageText: message,
        leadName: order.customer?.name ?? null,
        leadPhone: order.customer?.phone ?? null,
      },
    });
  } catch (e) {
    console.error(`Gagal log notifikasi order ${order.orderNo} (${kind})`, e);
  }
}
