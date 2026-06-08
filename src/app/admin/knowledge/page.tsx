import { prisma } from "@/lib/db";
import KnowledgeClient from "./KnowledgeClient";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" }
  });

  const knowledge = await prisma.$queryRaw`
    SELECT id, "productId", title, content, "createdAt"
    FROM "DocumentKnowledge"
    ORDER BY "createdAt" DESC
  `;

  return (
    <div className="p-8">
      <KnowledgeClient 
        initialData={knowledge as any[]} 
        products={products}
      />
    </div>
  );
}
