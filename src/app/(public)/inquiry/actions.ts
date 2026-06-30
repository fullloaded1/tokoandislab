"use server";

import { prisma } from "@/lib/db";
import { InstitutionType } from "@prisma/client";
import { z } from "zod";

const inquiryItemSchema = z.object({
  productId: z.string().min(1, "Product ID harus diisi"),
  qty: z.number().int().positive("Quantity harus lebih dari 0"),
});

const inquirySchema = z.object({
  institutionName: z.string().min(3, "Nama institusi minimal 3 karakter"),
  type: z.nativeEnum(InstitutionType),
  address: z.string().min(5, "Alamat minimal 5 karakter"),
  contactName: z.string().min(3, "Nama kontak minimal 3 karakter"),
  phone: z.string().min(8, "Nomor telepon tidak valid").max(20, "Nomor telepon terlalu panjang"),
  email: z.string().email("Format email tidak valid"),
  notes: z.string().optional(),
  items: z.array(inquiryItemSchema).min(1, "Keranjang penawaran kosong"),
});

export async function submitInquiry(formData: FormData) {
  try {
    const itemsJson = formData.get("items") as string;
    let parsedItems = [];
    try {
      parsedItems = JSON.parse(itemsJson);
    } catch {
      return { success: false, error: "Format data keranjang tidak valid" };
    }

    const validationResult = inquirySchema.safeParse({
      institutionName: formData.get("institutionName"),
      type: formData.get("type"),
      address: formData.get("address"),
      contactName: formData.get("contactName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      notes: formData.get("notes") || undefined, // empty string to undefined if needed, or just let string pass
      items: parsedItems,
    });

    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues.map((e: any) => e.message).join(", ");
      return { success: false, error: errorMsg };
    }

    const validData = validationResult.data;
    const { institutionName, type, address, contactName, phone, email, notes, items } = validData;

    // 1. Find or Create Institution
    let institution = await prisma.institution.findUnique({
      where: { name: institutionName }
    });

    if (!institution) {
      institution = await prisma.institution.create({
        data: {
          name: institutionName,
          type: type as InstitutionType,
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
            productId: item.productId,
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
