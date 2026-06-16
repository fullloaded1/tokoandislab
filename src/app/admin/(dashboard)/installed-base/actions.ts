"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createInstalledBase(data: {
  institutionId: string;
  productId: string;
  serialNumber: string;
  installationDate: string;
  warrantyMonths: number;
}) {
  try {
    const installationDate = new Date(data.installationDate);
    const warrantyExpiry = new Date(installationDate);
    warrantyExpiry.setMonth(warrantyExpiry.getMonth() + data.warrantyMonths);

    // Create installed base
    const installedBase = await prisma.installedBase.create({
      data: {
        institutionId: data.institutionId,
        productId: data.productId,
        serialNumber: data.serialNumber || null,
        installationDate,
        warrantyExpiry,
      },
      include: {
        institution: { include: { contacts: true } },
        product: true,
        reminders: true,
      }
    });

    // Create a maintenance reminder (e.g. 6 months after installation)
    const reminderDate = new Date(installationDate);
    reminderDate.setMonth(reminderDate.getMonth() + 6);

    await prisma.reminder.create({
      data: {
        installedBaseId: installedBase.id,
        type: "MAINTENANCE",
        dueDate: reminderDate,
        status: "PENDING",
      }
    });

    // Re-fetch with reminders to return updated object
    const finalBase = await prisma.installedBase.findUnique({
      where: { id: installedBase.id },
      include: {
        institution: { include: { contacts: true } },
        product: true,
        reminders: {
          where: { status: "PENDING" },
          orderBy: { dueDate: "asc" }
        }
      }
    });

    revalidatePath("/admin/installed-base");
    revalidatePath("/admin/institutions"); // Update installed bases count on institutions page
    return { data: finalBase };
  } catch (error) {
    console.error("Failed to create installed base:", error);
    return { error: "Gagal menyimpan alat terpasang" };
  }
}

export async function logMaintenance(installedBaseId: string) {
  try {
    // Update lastMaintenance to now
    await prisma.installedBase.update({
      where: { id: installedBaseId },
      data: {
        lastMaintenance: new Date(),
      },
      include: {
        institution: { include: { contacts: true } },
        product: true,
      }
    });

    // Dismiss any pending maintenance reminders
    await prisma.reminder.updateMany({
      where: { 
        installedBaseId, 
        status: "PENDING",
        type: "MAINTENANCE"
      },
      data: {
        status: "DISMISSED"
      }
    });

    // Create a new reminder for 6 months from now
    const nextReminder = new Date();
    nextReminder.setMonth(nextReminder.getMonth() + 6);

    await prisma.reminder.create({
      data: {
        installedBaseId,
        type: "MAINTENANCE",
        dueDate: nextReminder,
        status: "PENDING",
      }
    });

    // Fetch final to get new reminders
    const finalBase = await prisma.installedBase.findUnique({
      where: { id: installedBaseId },
      include: {
        institution: { include: { contacts: true } },
        product: true,
        reminders: {
          where: { status: "PENDING" },
          orderBy: { dueDate: "asc" }
        }
      }
    });

    revalidatePath("/admin/installed-base");
    return { data: finalBase };
  } catch (error) {
    console.error("Failed to log maintenance:", error);
    return { error: "Gagal mencatat maintenance" };
  }
}
