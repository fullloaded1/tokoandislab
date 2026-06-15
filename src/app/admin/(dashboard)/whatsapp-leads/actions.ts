"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { WhatsAppLogStatus } from "@prisma/client";

export async function updateLeadStatus(id: string, status: WhatsAppLogStatus) {
  try {
    await prisma.whatsAppLog.update({
      where: { id },
      data: { status },
    });
    
    revalidatePath("/admin/whatsapp-leads");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update lead status:", error);
    return { success: false, error: error.message || "Gagal mengupdate status lead" };
  }
}
