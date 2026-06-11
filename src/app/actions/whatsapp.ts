"use server";

import { prisma } from "@/lib/db";

export interface TrackWaPayload {
  source: string;
  productName?: string;
  productId?: string;
  inquiryNo?: string;
  messageText?: string;
}

export async function trackWhatsAppClick(data: TrackWaPayload) {
  try {
    await prisma.whatsAppLog.create({
      data: {
        source: data.source,
        productName: data.productName,
        productId: data.productId,
        inquiryNo: data.inquiryNo,
        messageText: data.messageText,
      },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to track WhatsApp click:", error);
    return { success: false, error: error.message || "Failed to log WhatsApp lead" };
  }
}
