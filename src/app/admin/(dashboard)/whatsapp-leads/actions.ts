"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";

import { WhatsAppLogStatus } from "@prisma/client";

export async function updateLeadStatus(id: string, status: WhatsAppLogStatus) {
  const session = await requireAdmin();
  try {
    const prev = await prisma.whatsAppLog.findUnique({ where: { id } });
    await prisma.whatsAppLog.update({
      where: { id },
      data: { status },
    });
    
    // Audit log (Rule #5)
    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entityType: "WhatsAppLog",
        entityId: id,
        actorId: session.username,
        oldValue: prev?.status || null,
        newValue: status,
        notes: `Update status lead WhatsApp ke ${status}`,
      },
    }).catch((err) => console.warn("Audit log error:", err));

    revalidatePath("/admin/whatsapp-leads");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update lead status:", error);
    return { success: false, error: error.message || "Gagal mengupdate status lead" };
  }
}

export async function convertLeadToInquiry(leadId: string) {
  const session = await requireAdmin();
  try {
    const lead = await prisma.whatsAppLog.findUnique({
      where: { id: leadId },
      include: { product: true },
    });

    if (!lead) {
      return { success: false, error: "Data lead tidak ditemukan" };
    }

    if (lead.inquiryNo) {
      return { success: true, inquiryNo: lead.inquiryNo, message: "Lead sudah memiliki nomor Inquiry" };
    }

    const institutionName = (lead.leadInstitution && lead.leadInstitution.trim()) || "Instansi Klien (Via WA)";
    const contactName = (lead.leadName && lead.leadName.trim()) || "Prospek WhatsApp";
    const phone = (lead.leadPhone && lead.leadPhone.trim()) || "081991575096";

    // 1. Find or create Institution
    let institution = await prisma.institution.findUnique({
      where: { name: institutionName },
    });

    if (!institution) {
      institution = await prisma.institution.create({
        data: {
          name: institutionName,
          type: "COMPANY",
          address: "Alamat belum dilengkapi (Hubungi via WA)",
        },
      });
    }

    // 2. Find or create Contact
    let contact = await prisma.contact.findFirst({
      where: {
        institutionId: institution.id,
        phone,
      },
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          institutionId: institution.id,
          name: contactName,
          phone,
          email: `${phone.replace(/[^0-9]/g, "") || "wa"}@lead.andislab.com`,
        },
      });
    }

    // 3. Generate Inquiry Number
    const count = await prisma.inquiry.count();
    const inquiryNo = `INQ-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

    // 4. Create Inquiry
    const notes = [
      `Konversi dari Lead WhatsApp (${lead.source})`,
      lead.messageText ? `Pesan awal: "${lead.messageText}"` : null,
      lead.productName ? `Produk yang ditanyakan: ${lead.productName}` : null,
    ].filter(Boolean).join("\n");

    const inquiry = await prisma.inquiry.create({
      data: {
        inquiryNo,
        institutionId: institution.id,
        notes,
        status: "NEW",
        items: lead.productId ? {
          create: [
            {
              product: { connect: { id: lead.productId } },
              quantity: 1,
            },
          ],
        } : undefined,
      },
    });

    // 5. Update WhatsAppLog with inquiryNo and status OFFERS
    await prisma.whatsAppLog.update({
      where: { id: leadId },
      data: {
        inquiryNo,
        status: "OFFERS",
      },
    });

    // 6. AuditLog
    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entityType: "Inquiry",
        entityId: inquiry.id,
        actorId: session.username,
        newValue: inquiryNo,
        notes: `Konversi lead WhatsApp ID ${leadId} ke Inquiry resmi ${inquiryNo}`,
      },
    }).catch((err) => console.warn("Audit log error:", err));

    revalidatePath("/admin/whatsapp-leads");
    revalidatePath("/admin/inquiries");
    return { success: true, inquiryNo };
  } catch (error: any) {
    console.error("Failed to convert lead to inquiry:", error);
    return { success: false, error: error.message || "Gagal mengonversi lead ke RFQ" };
  }
}

