import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";
import { buildInvoicePdfBytes } from "@/lib/commercialInvoice";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = new Set<OrderStatus>([
  OrderStatus.PAID,
  OrderStatus.PARTIAL_PAID,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.COMPLETED,
]);

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const url = new URL(req.url);
  const token = url.searchParams.get("t");

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      customer: { select: { name: true, email: true, phone: true } },
    },
  });
  if (!order) return new NextResponse("Order tidak ditemukan", { status: 404 });

  // Auth: admin session OR guestAccessToken match
  const session = await verifySession();
  const tokenMatches = !!token && order.guestAccessToken === token;
  if (!session && !tokenMatches) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!ALLOWED_STATUSES.has(order.status)) {
    return new NextResponse(
      "Invoice hanya tersedia setelah pembayaran dikonfirmasi.",
      { status: 409 }
    );
  }

  const bytes = buildInvoicePdfBytes({
    orderNo: order.orderNo,
    createdAt: order.createdAt,
    customerName: order.customer?.name ?? "-",
    customerEmail: order.customer?.email ?? "-",
    customerPhone: order.customer?.phone ?? null,
    shippingAddress: order.shippingAddress,
    items: order.items.map((it) => ({
      name: it.name,
      sku: it.sku,
      quantity: it.quantity,
      price: it.price,
    })),
    subtotal: order.subtotal,
    taxAmount: order.taxAmount,
    shippingFee: order.shippingFee,
    totalAmount: order.totalAmount,
    taxInvoiceNo: order.taxInvoiceNo,
  });

  return new NextResponse(bytes as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="INV-${order.orderNo}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
