"use server";

import { prisma } from "@/lib/db";
import { deleteSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin");
    revalidatePath("/katalog");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Gagal menghapus produk" };
  }
}

export async function createProduct(data: any) {
  try {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.product.create({
      data: {
        name: data.name,
        slug: slug,
        price: parseFloat(data.price),
        category: data.category,
        categoryLabel: data.categoryLabel,
        brand: data.brand || "",
        model: data.model || "",
        subcategory: data.subcategory || "",
        image: data.image || "",
        description: data.description || "",
      },
    });
    revalidatePath("/admin");
    revalidatePath("/katalog");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Gagal menambahkan produk" };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        price: parseFloat(data.price),
        category: data.category,
        categoryLabel: data.categoryLabel,
        brand: data.brand || "",
        model: data.model || "",
        subcategory: data.subcategory || "",
        image: data.image || "",
        description: data.description || "",
      },
    });
    revalidatePath("/admin");
    revalidatePath("/katalog");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Gagal mengupdate produk" };
  }
}

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}
