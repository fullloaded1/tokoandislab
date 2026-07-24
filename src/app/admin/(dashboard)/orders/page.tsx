import { prisma } from "@/lib/db";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    where: { orderType: "DIRECT" },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      items: { select: { name: true, quantity: true } },
    },
  });

  // Serialize Decimal → string buat client
  const serialized = orders.map((o) => ({
    id: o.id,
    orderNo: o.orderNo,
    status: o.status,
    customer: o.customer,
    items: o.items,
    subtotal: o.subtotal.toString(),
    taxAmount: o.taxAmount.toString(),
    shippingFee: o.shippingFee.toString(),
    totalAmount: o.totalAmount.toString(),
    paymentMethod: o.paymentMethod,
    trackingNumber: o.trackingNumber,
    shippedAt: o.shippedAt?.toISOString() ?? null,
    createdAt: o.createdAt.toISOString(),
  }));

  return <OrdersClient orders={serialized} />;
}
