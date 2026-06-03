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

export async function bulkCreateProducts(products: any[]) {
  try {
    const dataToInsert = products.map((p) => {
      // Ensure unique slug, even if there are duplicates we can add a random string or just rely on standard.
      // For a simple implementation, we just slugify the name. If it fails due to unique constraint, we can append a random string.
      const baseSlug = (p.name || "unnamed").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const randomStr = Math.random().toString(36).substring(2, 7);
      
      return {
        name: p.name,
        slug: `${baseSlug}-${randomStr}`, // Prevent duplicate slugs in bulk
        price: parseFloat(p.price) || 0,
        category: p.category || "other",
        categoryLabel: p.categoryLabel || "Lainnya",
        brand: p.brand || "",
        model: p.model || "",
        subcategory: p.subcategory || "",
        image: p.image || "",
        description: p.description || "",
      };
    });

    await prisma.product.createMany({
      data: dataToInsert,
      skipDuplicates: true, // Prisma feature to skip unique constraint violations
    });

    revalidatePath("/admin");
    revalidatePath("/katalog");
    revalidatePath("/");
    
    return { success: true, count: dataToInsert.length };
  } catch (error: any) {
    console.error("Failed to bulk create products:", error);
    return { success: false, error: error.message || "Gagal mengupload massal" };
  }
}

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}
