"use server";

import { prisma } from "@/lib/db";
import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";

export async function addKnowledge(data: { title: string; content: string; productId?: string }) {
  await requireAdmin();
  try {
    const { embedding } = await embed({
      model: google.textEmbeddingModel("text-embedding-004"),
      value: data.content,
    });

    const embeddingString = `[${embedding.join(",")}]`;

    await prisma.$executeRaw`
      INSERT INTO "DocumentKnowledge" ("id", "title", "content", "productId", "embedding", "createdAt")
      VALUES (
        gen_random_uuid()::text,
        ${data.title},
        ${data.content},
        ${data.productId || null},
        ${embeddingString}::vector,
        NOW()
      )
    `;

    revalidatePath("/admin/knowledge");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to add knowledge:", error);
    return { success: false, error: error.message || "Gagal memproses embedding dokumen." };
  }
}

export async function deleteKnowledge(id: string) {
  await requireAdmin();
  try {
    await prisma.$executeRaw`DELETE FROM "DocumentKnowledge" WHERE id = ${id}`;
    revalidatePath("/admin/knowledge");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete knowledge:", error);
    return { success: false, error: "Gagal menghapus dokumen" };
  }
}
