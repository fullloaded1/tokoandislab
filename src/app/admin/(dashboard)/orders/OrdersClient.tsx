"use client";

import { useState, useTransition } from "react";
import { OrderStatus, PaymentMethod } from "@prisma/client";
import { getNextStates, requiresTracking } from "@/lib/orderState";
import { money } from "@/lib/money";
import { updateOrderStatus } from "./actions";
import { Package, ChevronDown, Loader2, Truck, FileDown } from "lucide-react";

const INVOICE_AVAILABLE: Set<OrderStatus> = new Set([
  "PAID",
  "PARTIAL_PAID",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
] as OrderStatus[]);

type OrderRow = {
  id: string;
  orderNo: string;
  status: OrderStatus;
  customer: { name: string; email: string; phone: string | null } | null;
  items: { name: string; quantity: number }[];
  subtotal: string;
  taxAmount: string;
  shippingFee: string;
  totalAmount: string;
  paymentMethod: PaymentMethod;
  trackingNumber: string | null;
  shippedAt: string | null;
  createdAt: string;
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Tunggu Bayar",
  PARTIAL_PAID: "Bayar Sebagian",
  PAID: "Lunas",
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "bg-amber-100 text-amber-700",
  PARTIAL_PAID: "bg-orange-100 text-orange-700",
  PAID: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-cyan-100 text-cyan-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function OrdersClient({ orders }: { orders: OrderRow[] }) {
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  const handleAdvance = (orderId: string, to: OrderStatus, tracking?: string) => {
    setError(null);
    startTransition(async () => {
      const res = await updateOrderStatus({
        orderId,
        toStatus: to,
        trackingNumber: tracking,
      });
      if (!res.success) {
        setError(res.error ?? "Gagal update status");
      } else {
        setEditingId(null);
        setTrackingInput("");
      }
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Package className="h-7 w-7 text-blue-600" />
        <h1 className="text-2xl font-extrabold text-slate-900">Kelola Pesanan</h1>
        <span className="ml-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {orders.length}
        </span>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["ALL", ...Object.keys(STATUS_LABEL)] as Array<OrderStatus | "ALL">).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
              filter === s
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
            }`}
          >
            {s === "ALL" ? "Semua" : STATUS_LABEL[s as OrderStatus]}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">No. Order</th>
              <th className="px-4 py-3">Pelanggan</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Resi</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                  Belum ada pesanan.
                </td>
              </tr>
            ) : (
              filtered.map((o) => {
                const nextStates = getNextStates(o.status);
                const isEditing = editingId === o.id;
                return (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-slate-700">
                      {o.orderNo}
                      <div className="text-[10px] font-normal text-slate-400 mt-0.5">
                        {new Date(o.createdAt).toLocaleString("id-ID")}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{o.customer?.name ?? "-"}</div>
                      <div className="text-xs text-slate-500">{o.customer?.email}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {o.items.map((it, i) => (
                        <div key={i}>
                          {it.quantity}× {it.name}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-800">
                      {money.formatIDR(o.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLOR[o.status]}`}
                      >
                        {STATUS_LABEL[o.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {o.trackingNumber ? (
                        <span className="font-mono font-semibold">{o.trackingNumber}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {nextStates.length === 0 ? (
                        <span className="text-xs text-slate-400">—</span>
                      ) : isEditing ? (
                        <div className="flex flex-col gap-2 min-w-[200px]">
                          <input
                            type="text"
                            placeholder="Nomor resi (utk SHIPPED)"
                            value={trackingInput}
                            onChange={(e) => setTrackingInput(e.target.value)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs"
                          />
                          <div className="flex flex-wrap gap-1">
                            {nextStates.map((to) => (
                              <button
                                key={to}
                                disabled={pending || (requiresTracking(to) && !trackingInput.trim())}
                                onClick={() => handleAdvance(o.id, to, trackingInput.trim() || undefined)}
                                className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                              >
                                {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : STATUS_LABEL[to]}
                              </button>
                            ))}
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setTrackingInput("");
                              }}
                              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => {
                              setEditingId(o.id);
                              setTrackingInput(o.trackingNumber ?? "");
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-700"
                          >
                            <Truck className="h-3 w-3" /> Ubah Status <ChevronDown className="h-3 w-3" />
                          </button>
                          {INVOICE_AVAILABLE.has(o.status) && (
                            <a
                              href={`/api/orders/${o.id}/invoice`}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                            >
                              <FileDown className="h-3 w-3" /> Invoice
                            </a>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
