import { prisma } from "@/lib/db";
import InstalledBaseClient from "./InstalledBaseClient";

export const dynamic = "force-dynamic";

export default async function InstalledBasePage() {
  const installedBases = await prisma.installedBase.findMany({
    include: {
      institution: {
        include: { contacts: true }
      },
      product: true,
      reminders: {
        where: { status: "PENDING" },
        orderBy: { dueDate: "asc" }
      }
    },
    orderBy: { installationDate: "desc" }
  });

  const institutions = await prisma.institution.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" }
  });

  const products = await prisma.product.findMany({
    select: { id: true, name: true, image: true },
    orderBy: { name: "asc" }
  });

  return (
    <InstalledBaseClient 
      initialData={installedBases} 
      institutions={institutions} 
      products={products} 
    />
  );
}
