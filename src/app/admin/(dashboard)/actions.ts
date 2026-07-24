"use server";

import { prisma } from "@/lib/db";
import { money } from "@/lib/money";
import { ActivityAction, InquiryStatus } from "@prisma/client";
import { deleteSession, requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteProduct(id: string) {
  const session = await requireAdmin();
  try {
    await prisma.product.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        action: "DELETE",
        entityType: "Product",
        entityId: id,
        actorId: session.username,
        notes: "Hapus produk",
      },
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
  const session = await requireAdmin();
  try {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: slug,
        price: money.toDecimal(data.price),
        category: data.category,
        categoryLabel: data.categoryLabel,
        brand: data.brand || "",
        model: data.model || "",
        subcategory: data.subcategory || "",
        image: data.image || "",
        description: data.description || "",
        isReadyStock: Boolean(data.isReadyStock),
        costPrice: money.toDecimal(data.costPrice || 0),
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entityType: "Product",
        entityId: product.id,
        actorId: session.username,
        newValue: JSON.stringify(data),
        notes: "Membuat produk baru",
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
  const session = await requireAdmin();
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        price: money.toDecimal(data.price),
        category: data.category,
        categoryLabel: data.categoryLabel,
        brand: data.brand || "",
        model: data.model || "",
        subcategory: data.subcategory || "",
        image: data.image || "",
        description: data.description || "",
        isReadyStock: Boolean(data.isReadyStock),
        costPrice: money.toDecimal(data.costPrice || 0),
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entityType: "Product",
        entityId: id,
        actorId: session.username,
        newValue: JSON.stringify(data),
        notes: "Update produk",
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
  const session = await requireAdmin();
  try {
    const dataToInsert = products.map((p) => {
      // Ensure unique slug, even if there are duplicates we can add a random string or just rely on standard.
      // For a simple implementation, we just slugify the name. If it fails due to unique constraint, we can append a random string.
      const baseSlug = (p.name || "unnamed").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const randomStr = crypto.randomUUID().substring(0, 5);
      
      return {
        name: p.name,
        slug: `${baseSlug}-${randomStr}`, // Prevent duplicate slugs in bulk
        price: money.toDecimal(p.price),
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
    });

    await prisma.auditLog.create({
      data: {
        action: "BULK_CREATE",
        entityType: "Product",
        entityId: "BULK",
        actorId: session.username,
        notes: `Bulk create ${dataToInsert.length} produk`,
      },
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
  revalidatePath("/", "layout");
  redirect("/admin/login");
}

// CRM Activity Logs
export async function createActivityLog(data: { inquiryId?: string; institutionId?: string; action: ActivityAction; description: string }) {
  await requireAdmin();
  try {
    await prisma.activityLog.create({
      data,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to add activity log:", error);
    return { success: false, error: "Gagal menambahkan catatan CRM" };
  }
}

export async function getActivityLogs(params: { inquiryId?: string; institutionId?: string }) {
  await requireAdmin();
  try {
    const logs = await prisma.activityLog.findMany({
      where: params,
      orderBy: { createdAt: 'desc' },
      include: {
        institution: { select: { name: true } },
      }
    });
    return { success: true, data: logs };
  } catch (error) {
    console.error("Failed to fetch activity logs:", error);
    return { success: false, error: "Gagal mengambil data catatan CRM" };
  }
}

export async function updateInquiryStatus(inquiryId: string, status: InquiryStatus) {
  const session = await requireAdmin();
  try {
    const inquiry = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { status },
    });
    
    // Log activity with actorId for audit trail
    await prisma.activityLog.create({
      data: {
        inquiryId: inquiry.id,
        institutionId: inquiry.institutionId,
        action: ActivityAction.OTHER,
        description: `Status diubah menjadi ${status}`,
      }
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_INQUIRY_STATUS",
        entityType: "Inquiry",
        entityId: inquiry.id,
        actorId: session.username,
        newValue: JSON.stringify({ status }),
        notes: `Status inquiry diubah menjadi ${status}`,
      },
    });

    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error) {
    console.error("Failed to update inquiry status:", error);
    return { success: false, error: "Gagal mengupdate status inquiry" };
  }
}

export async function getInquiries() {
  await requireAdmin();
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        institution: {
          include: { contacts: true }
        },
        items: {
          include: { product: true }
        }
      }
    });
    return { success: true, data: inquiries };
  } catch (error) {
    console.error("Failed to fetch inquiries:", error);
    return { success: false, error: "Gagal mengambil data inquiry" };
  }
}
