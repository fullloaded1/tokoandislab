import { OrderStatus } from "@prisma/client";

/**
 * Valid state transitions untuk Order (T3.7). Admin tidak boleh skip atau mundur,
 * kecuali ke CANCELLED dari state pre-shipment.
 */
const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: [OrderStatus.PAID, OrderStatus.PARTIAL_PAID, OrderStatus.CANCELLED],
  PARTIAL_PAID: [OrderStatus.PAID, OrderStatus.CANCELLED],
  PAID: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  PROCESSING: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  SHIPPED: [OrderStatus.COMPLETED],
  COMPLETED: [],
  CANCELLED: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function getNextStates(from: OrderStatus): OrderStatus[] {
  return TRANSITIONS[from] ?? [];
}

/** Status yg butuh trackingNumber wajib diisi sebelum transisi. */
export function requiresTracking(to: OrderStatus): boolean {
  return to === OrderStatus.SHIPPED;
}
