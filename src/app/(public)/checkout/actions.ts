"use server";

import { prisma } from "@/lib/db";
import { money } from "@/lib/money";
import { getShippingFee, isValidShippingRegion } from "@/lib/shipping";
import { generateOrderNo, generateGuestAccessToken } from "@/lib/orderCodes";
import { calculateOrderTotals } from "@/lib/orderTotals";
import { sendOrderNotification } from "@/lib/orderNotification";
import { Prisma } from "@prisma/client";

const TAX_RATE = 11;
const RESERVATION_WINDOW_MS = 30 * 60 * 1000;
const MAX_SERIALIZE_RETRY = 3;

type CreateOrderPayload = {
  items: { variantId: string; quantity: number }[];
  buyer: {
    name: string;
    email: string;
    phone: string;
    institution: string;
    address: string;
  };
  shippingRegion: string;
  paymentMethod: string;
};

export async function createDirectOrder(payload: CreateOrderPayload) {
  if (!payload.items.length) {
    return { success: false, error: "Keranjang kosong." };
  }
  if (!isValidShippingRegion(payload.shippingRegion)) {
    return { success: false, error: "Wilayah pengiriman tidak valid." };
  }
  if (!payload.buyer.email || !payload.buyer.email.includes("@")) {
    return { success: false, error: "Email tidak valid." };
  }

  // Retry kalau Postgres lempar serialization_failure (40001)
  let lastError: unknown = null;
  for (let attempt = 0; attempt < MAX_SERIALIZE_RETRY; attempt++) {
    try {
      const result = await runOrderTransaction(payload);
      // Fire-and-forget: log notifikasi CREATED. Tidak menggagalkan order kalau gagal log.
      sendOrderNotification(result.orderId, "CREATED").catch(() => {});
      return result;
    } catch (e) {
      lastError = e;
      const code = (e as { code?: string; meta?: { code?: string } }).code ?? "";
      const innerCode = (e as { meta?: { code?: string } }).meta?.code ?? "";
      const isSerializationConflict = code === "P2034" || innerCode === "40001";
      if (!isSerializationConflict) {
        const msg = e instanceof Error ? e.message : "Gagal membuat pesanan";
        return { success: false, error: msg };
      }
      // else: retry
    }
  }
  const msg = lastError instanceof Error ? lastError.message : "Gagal setelah beberapa percobaan";
  return { success: false, error: msg };
}

async function runOrderTransaction(payload: CreateOrderPayload) {
  return await prisma.$transaction(
    async (tx) => {
      // K2: resolve/buat Customer by email. Existing customer keeps status (mis. REGISTERED).
      const customer = await tx.customer.upsert({
        where: { email: payload.buyer.email },
        create: {
          email: payload.buyer.email,
          name: payload.buyer.name,
          phone: payload.buyer.phone,
          status: "GUEST",
        },
        update: {
          name: payload.buyer.name,
          phone: payload.buyer.phone,
        },
      });

      const orderItemsToCreate: Array<{
        variantId: string;
        name: string;
        sku: string;
        price: Prisma.Decimal;
        quantity: number;
      }> = [];
      const reservationsToCreate: Array<{
        variantId: string;
        quantity: number;
        expiresAt: Date;
      }> = [];
      const totalsInput: Array<{ price: Prisma.Decimal; quantity: number }> = [];

      for (const item of payload.items) {
        // Row-level lock: cegah race condition saat 2 user checkout stok terakhir.
        await tx.$queryRaw`SELECT id FROM "ProductVariant" WHERE id = ${item.variantId} FOR UPDATE`;

        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });
        if (!variant) throw new Error(`Varian tidak ditemukan: ${item.variantId}`);

        const available = variant.stock - variant.reservedStock;
        if (available < item.quantity) {
          throw new Error(
            `Stok tidak cukup untuk ${variant.product.name} - ${variant.name}. Sisa stok: ${available}`
          );
        }

        const itemPrice = money.toDecimal(variant.price);
        totalsInput.push({ price: itemPrice, quantity: item.quantity });

        orderItemsToCreate.push({
          variantId: variant.id,
          name: `${variant.product.name} - ${variant.name}`,
          sku: variant.sku,
          price: itemPrice,
          quantity: item.quantity,
        });

        await tx.productVariant.update({
          where: { id: variant.id },
          data: { reservedStock: { increment: item.quantity } },
        });

        reservationsToCreate.push({
          variantId: variant.id,
          quantity: item.quantity,
          expiresAt: new Date(Date.now() + RESERVATION_WINDOW_MS),
        });
      }

      const shippingFee = getShippingFee(payload.shippingRegion);
      const { subtotal, taxAmount, totalAmount } = calculateOrderTotals(
        totalsInput,
        TAX_RATE,
        shippingFee
      );

      const shippingAddress = [
        `Nama: ${payload.buyer.name}`,
        `Email: ${payload.buyer.email}`,
        `Telepon: ${payload.buyer.phone}`,
        `Instansi: ${payload.buyer.institution || "-"}`,
        "",
        "Alamat Pengiriman:",
        payload.buyer.address,
      ].join("\n");

      const orderNo = generateOrderNo();
      const guestAccessToken = generateGuestAccessToken();

      const order = await tx.order.create({
        data: {
          orderNo,
          orderType: "DIRECT",
          status: "PENDING_PAYMENT",
          customerId: customer.id,
          subtotal,
          taxAmount,
          shippingFee,
          totalAmount,
          paymentMethod: payload.paymentMethod,
          shippingAddress,
          shippingRegion: payload.shippingRegion,
          guestAccessToken,
          priceDisplayMode: "EXCLUDE_PPN", // K1: snapshot mode tampil saat order dibuat
          items: { create: orderItemsToCreate },
        },
      });

      for (const res of reservationsToCreate) {
        await tx.stockReservation.create({
          data: { ...res, orderId: order.id },
        });
      }

      return {
        success: true as const,
        orderId: order.id,
        orderNo,
        guestAccessToken,
      };
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      maxWait: 5_000,
      timeout: 15_000,
    }
  );
}
