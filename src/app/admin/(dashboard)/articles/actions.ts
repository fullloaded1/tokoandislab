"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";

export async function getArticles() {
  await requireAdmin();
  try {
    const articles = await (prisma as any).article.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        products: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return { success: true, data: articles };
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return { success: false, error: "Gagal mengambil data artikel" };
  }
}

export async function createArticle(data: {
  title: string;
  content: string;
  excerpt?: string;
  image?: string;
  category?: string;
  published: boolean;
  productIds: string[];
}) {
  await requireAdmin();
  try {
    let baseSlug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
      
    if (!baseSlug) {
      baseSlug = "artikel";
    }

    // Check if slug already exists
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await prisma.article.findUnique({
        where: { slug },
      });
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const article = await (prisma as any).article.create({
      data: {
        title: data.title,
        slug: slug,
        content: data.content,
        excerpt: data.excerpt || "",
        image: data.image || "",
        category: data.category || "edukasi-lab",
        published: data.published,
        products: {
          connect: data.productIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/artikel");
    revalidatePath(`/artikel/${slug}`);
    revalidatePath("/admin/articles");

    return { success: true, data: article };
  } catch (error: any) {
    console.error("Failed to create article:", error);
    return { success: false, error: error.message || "Gagal menambahkan artikel" };
  }
}

export async function updateArticle(
  id: string,
  data: {
    title: string;
    content: string;
    excerpt?: string;
    image?: string;
    category?: string;
    published: boolean;
    productIds: string[];
  }
) {
  await requireAdmin();
  try {
    const currentArticle = await prisma.article.findUnique({
      where: { id },
    });

    if (!currentArticle) {
      return { success: false, error: "Artikel tidak ditemukan" };
    }

    // If title has changed, we might want to update the slug as well.
    // Or we keep the old slug to avoid breaking existing SEO links. Let's keep the slug if they don't explicitly require changing it,
    // but generating a new slug if title changed is also fine. Let's keep the slug stable to prevent SEO breakage, or update it if needed.
    // Let's update slug ONLY if title changes.
    let slug = currentArticle.slug;
    if (currentArticle.title !== data.title) {
      let baseSlug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      if (!baseSlug) baseSlug = "artikel";
      
      slug = baseSlug;
      let counter = 1;
      while (true) {
        const existing = await prisma.article.findFirst({
          where: { slug, NOT: { id } },
        });
        if (!existing) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const article = await (prisma as any).article.update({
      where: { id },
      data: {
        title: data.title,
        slug: slug,
        content: data.content,
        excerpt: data.excerpt || "",
        image: data.image || "",
        category: data.category || "edukasi-lab",
        published: data.published,
        products: {
          set: data.productIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/artikel");
    revalidatePath(`/artikel/${slug}`);
    if (currentArticle.slug !== slug) {
      revalidatePath(`/artikel/${currentArticle.slug}`);
    }
    revalidatePath("/admin/articles");

    return { success: true, data: article };
  } catch (error: any) {
    console.error("Failed to update article:", error);
    return { success: false, error: error.message || "Gagal mengupdate artikel" };
  }
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  try {
    const article = await (prisma as any).article.findUnique({
      where: { id },
    });
    
    if (!article) {
      return { success: false, error: "Artikel tidak ditemukan" };
    }

    await (prisma as any).article.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/artikel");
    revalidatePath(`/artikel/${article.slug}`);
    revalidatePath("/admin/articles");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete article:", error);
    return { success: false, error: "Gagal menghapus artikel" };
  }
}
