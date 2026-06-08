import { prisma } from "@/lib/db";
import InquiryDetailClient from "./InquiryDetailClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function InquiryDetailPage({ params }: { params: { id: string } }) {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: params.id },
    include: {
      institution: {
        include: { contacts: true }
      },
      items: {
        include: { product: true }
      },
      activityLogs: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!inquiry) return notFound();

  return <InquiryDetailClient initialData={inquiry} />;
}
