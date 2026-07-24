import { prisma } from "@/lib/db";
import LeadsClient from "./LeadsClient";

export const dynamic = "force-dynamic";

export default async function WhatsAppLeadsPage() {
  const logs = await prisma.whatsAppLog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
          slug: true,
          category: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LeadsClient initialLogs={logs as any} />
      </div>
    </div>
  );
}
