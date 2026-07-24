import { prisma } from "@/lib/db";
import InquiriesClient from "./InquiriesClient";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    include: {
      institution: {
        include: { contacts: true }
      },
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pipeline CRM (Leads & RFQ)</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola prospek dan permintaan penawaran dengan sistem Kanban Board.</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <InquiriesClient initialInquiries={inquiries as any} />
      </div>
    </div>
  );
}
