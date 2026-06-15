"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { adjustStock } from "@/lib/stock";
import { StockLogType } from "@prisma/client";

export async function getVariants(productId: string) {
  try {
    const variants = await prisma.productVariant.findMany({
      where: { productId },
      orderBy: { name: "asc" },
      include: {
        stockLogs: {
          orderBy: { createdAt: "desc" },
          take: 5
        }
      }
    });
    return { success: true, data: variants };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createVariant(data: { productId: string; sku: string; name: string; price: string | number; stock: number }) {
  try {
    // 1. Buat Varian dengan stok awal 0 terlebih dahulu
    const newVariant = await prisma.productVariant.create({
      data: {
        productId: data.productId,
        sku: data.sku,
        name: data.name,
        price: data.price,
        stock: 0, // Akan diisi via ledger
        reservedStock: 0
      }
    });

    // 2. Jika ada stok awal, masukkan lewat ledger (StockLog IN)
    if (data.stock > 0) {
      await adjustStock({
        variantId: newVariant.id,
        quantity: data.stock,
        type: StockLogType.IN,
        notes: "Initial stock upon variant creation",
        actorId: "Admin" // TODO: get from session
      });
    }

    revalidatePath(`/admin/products/${data.productId}/variants`);
    return { success: true, data: newVariant };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message };
  }
}

export async function updateVariant(id: string, data: { sku: string; name: string; price: string | number }) {
  try {
    const updated = await prisma.productVariant.update({
      where: { id },
      data: {
        sku: data.sku,
        name: data.name,
        price: data.price,
        // Dilarang keras update 'stock' secara langsung dari CRUD form
      }
    });
    revalidatePath(`/admin/products`);
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteVariant(id: string) {
  try {
    await prisma.productVariant.delete({
      where: { id }
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function restockVariant(variantId: string, quantity: number, notes: string) {
  try {
    const updated = await adjustStock({
      variantId,
      quantity,
      type: StockLogType.IN,
      notes: notes || "Restock manual",
      actorId: "Admin"
    });
    revalidatePath(`/admin/products`);
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function adjustStockVariant(variantId: string, quantity: number, type: StockLogType, notes: string) {
  try {
    const updated = await adjustStock({
      variantId,
      quantity,
      type, // OUT atau ADJUST
      notes: notes || "Koreksi manual",
      actorId: "Admin"
    });
    revalidatePath(`/admin/products`);
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
