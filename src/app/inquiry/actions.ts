"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitInquiry(formData: FormData) {
  try {
    const institutionName = formData.get("institutionName") as string;
    const type = formData.get("type") as string;
    const address = formData.get("address") as string;
    const contactName = formData.get("contactName") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const notes = formData.get("notes") as string;
    
    // items is a JSON string passed from the frontend hidden input
    const itemsJson = formData.get("items") as string;
    const items = JSON.parse(itemsJson) as any[];

    if (!items || items.length === 0) {
      return { success: false, error: "Keranjang penawaran kosong" };
    }

    // 1. Find or Create Institution
    let institution = await prisma.institution.findUnique({
      where: { name: institutionName }
    });

    if (!institution) {
      institution = await prisma.institution.create({
        data: {
          name: institutionName,
          type: type,
          address: address,
        }
      });
    }

    // 2. Create Contact if doesn't exist for this institution
    // We do a simple findFirst by email or phone
    let contact = await prisma.contact.findFirst({
      where: {
        institutionId: institution.id,
        OR: [{ email }, { phone }]
      }
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          institutionId: institution.id,
          name: contactName,
          phone: phone,
          email: email
        }
      });
    }

    // 3. Generate Inquiry Number
    const count = await prisma.inquiry.count();
    const inquiryNo = `INQ-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

    // 4. Create Inquiry and Inquiry Items
    const inquiry = await prisma.inquiry.create({
      data: {
        inquiryNo,
        institutionId: institution.id,
        notes: notes ? `PIC: ${contactName} (${phone} / ${email})\nCatatan: ${notes}` : `PIC: ${contactName} (${phone} / ${email})`,
        items: {
          create: items.map(item => ({
            productId: item.id,
            quantity: item.qty
          }))
        }
      }
    });

    return { success: true, inquiryNo: inquiry.inquiryNo };
  } catch (error: any) {
    console.error("Failed to submit inquiry:", error);
    return { success: false, error: error.message || "Gagal mengirimkan permintaan" };
  }
}
