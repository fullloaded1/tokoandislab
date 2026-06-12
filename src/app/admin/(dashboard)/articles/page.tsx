import { prisma } from "@/lib/db";
import ArticlesClient from "@/app/admin/(dashboard)/articles/ArticlesClient";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await (prisma as any).article.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      products: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      model: true,
      categoryLabel: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return <ArticlesClient initialArticles={articles} products={products} />;
}
