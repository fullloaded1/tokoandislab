/* Hallmark · page: OrderStatusPage · genre: modern-minimal · macrostructure: High-Density Form · design-system: design.md */
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { money } from "@/lib/money";
import { OrderStatus } from "@prisma/client";
import { Package, CheckCircle2, Clock, Truck, XCircle, FileDown } from "lucide-react";

const INVOICE_AVAILABLE: Set<OrderStatus> = new Set([
  OrderStatus.PAID,
  OrderStatus.PARTIAL_PAID,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
  OrderStatus.COMPLETED,
]);

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Menunggu Pembayaran",
  PARTIAL_PAID: "Pembayaran Sebagian",
  PAID: "Pembayaran Lunas",
  PROCESSING: "Sedang Diproses",
  SHIPPED: "Dalam Pengiriman",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const STATUS_ICON: Record<OrderStatus, React.ComponentType<{ className?: string }>> = {
  PENDING_PAYMENT: Clock,
  PARTIAL_PAID: Clock,
  PAID: CheckCircle2,
  PROCESSING: Package,
  SHIPPED: Truck,
  COMPLETED: CheckCircle2,
  CANCELLED: XCircle,
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "bg-amber-50 text-amber-700 border-amber-200",
  PARTIAL_PAID: "bg-orange-50 text-orange-700 border-orange-200",
  PAID: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-indigo-50 text-indigo-700 border-indigo-200",
  SHIPPED: "bg-cyan-50 text-cyan-700 border-cyan-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export default async function OrderStatusPage(props: { params: Promise<{ token: string }> }) {
  const { token } = await props.params;

  const order = await prisma.order.findUnique({
    where: { guestAccessToken: token },
    include: {
      items: true,
      customer: { select: { name: true, email: true, phone: true } },
    },
  });

  if (!order) notFound();

  if (order.guestAccessTokenExpiresAt && new Date() > order.guestAccessTokenExpiresAt) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 text-center">
        <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Link Kedaluwarsa</h1>
        <p className="text-slate-600 mb-6">
          Token akses untuk pesanan ini telah melewati batas waktu yang diizinkan (30 hari).
        </p>
        <p className="text-sm text-slate-500">
          Silakan hubungi admin atau login (bila telah terdaftar) untuk melihat status pesanan Anda.
        </p>
      </div>
    );
  }

  const Icon = STATUS_ICON[order.status];

  const timelineSteps = [
    { label: "Pesanan Dibuat", done: true },
    { label: "Pembayaran", done: ["PAID", "PARTIAL_PAID", "PROCESSING", "SHIPPED", "COMPLETED"].includes(order.status) },
    { label: "Diproses / SPJ", done: ["PROCESSING", "SHIPPED", "COMPLETED"].includes(order.status) },
    { label: "Dikirim", done: ["SHIPPED", "COMPLETED"].includes(order.status) },
    { label: "Selesai", done: order.status === "COMPLETED" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
        Status & Pelacakan Pesanan Resmi
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-mono">
            {order.orderNo}
          </h1>
          <p className="text-sm text-slate-500">
            Diterbitkan pada {new Date(order.createdAt).toLocaleString("id-ID")}
          </p>
        </div>
        {order.customer && (
          <div className="rounded-xl bg-slate-100/80 px-4 py-2.5 text-xs text-slate-600 sm:text-right border border-slate-200">
            <div className="font-bold text-slate-800">{order.customer.name}</div>
            <div>{order.customer.email}</div>
          </div>
        )}
      </div>

      {/* Progress Timeline Bar */}
      {order.status !== "CANCELLED" && (
        <div className="mb-8 rounded-2xl bg-white p-6 border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">
            Alur Pengadaan & Pengiriman
          </div>
          <div className="relative flex justify-between items-center">
            <div className="absolute top-4 left-0 right-0 h-1 bg-slate-100 -z-0"></div>
            {timelineSteps.map((step, idx) => (
              <div key={step.label} className="relative z-10 flex flex-col items-center text-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    step.done
                      ? "bg-emerald-600 text-white ring-4 ring-emerald-50"
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}
                >
                  {step.done ? "✓" : idx + 1}
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-bold mt-2 max-w-[70px] sm:max-w-none leading-tight ${
                    step.done ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`flex items-center gap-4 rounded-2xl border-2 p-6 mb-8 shadow-xs ${STATUS_COLOR[order.status]}`}>
        <Icon className="h-10 w-10 shrink-0" />
        <div>
          <div className="text-xs font-bold uppercase tracking-wider opacity-70">Status saat ini</div>
          <div className="text-2xl font-black">{STATUS_LABEL[order.status]}</div>
          {order.trackingNumber && (
            <div className="text-sm mt-1">
              Resi Pengiriman: <span className="font-mono font-bold">{order.trackingNumber}</span>
            </div>
          )}
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Item Pesanan</h2>
        <div className="space-y-2">
          {order.items.map((it) => (
            <div key={it.id} className="flex justify-between text-sm">
              <span className="text-slate-700">
                {it.quantity}× {it.name}
              </span>
              <span className="font-semibold text-slate-800">
                {money.formatIDR(money.toDecimal(it.price).mul(it.quantity))}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-slate-100 pt-4 space-y-1 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>{money.formatIDR(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>PPN</span>
            <span>{money.formatIDR(order.taxAmount)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Ongkir</span>
            <span>{money.formatIDR(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-2 mt-2 font-bold text-slate-900">
            <span>Total</span>
            <span>{money.formatIDR(order.totalAmount)}</span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Pengiriman</h2>
        <pre className="whitespace-pre-wrap text-sm text-slate-600 font-sans">
          {order.shippingAddress}
        </pre>
      </section>

      {INVOICE_AVAILABLE.has(order.status) && (
        <div className="mt-6 flex justify-center">
          <a
            href={`/api/orders/${order.id}/invoice?t=${token}`}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all duration-200 ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] active:scale-[0.98] hover:bg-slate-700"
          >
            <FileDown className="h-4 w-4" /> Unduh Invoice Komersial (PDF)
          </a>
        </div>
      )}

      <p className="mt-8 text-xs text-slate-400 text-center">
        Link ini berisi token rahasia. Jangan dibagikan ke pihak lain.
      </p>
    </div>
  );
}
