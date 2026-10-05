import { PrismaClient, ContentPillar, FunnelStage } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Article Category Migration...");
  const articles = await prisma.article.findMany();
  let migratedCount = 0;

  for (const article of articles) {
    let pillar: ContentPillar = ContentPillar.SEARCH;
    let funnelStage: FunnelStage = FunnelStage.KNOWLEDGE;

    // Simple mapping logic based on old category (you can adjust this later)
    const category = (article as any).category?.toLowerCase() || "";
    
    if (category.includes("edukasi") || category.includes("teori")) {
      pillar = ContentPillar.SEARCH;
      funnelStage = FunnelStage.KNOWLEDGE;
    } else if (category.includes("solusi") || category.includes("industri")) {
      pillar = ContentPillar.SOLUTION;
      funnelStage = FunnelStage.PROBLEM;
    } else if (category.includes("trend") || category.includes("berita") || category.includes("regulasi")) {
      pillar = ContentPillar.TREND;
      funnelStage = FunnelStage.KNOWLEDGE;
    } else if (category.includes("review") || category.includes("produk") || category.includes("brand")) {
      pillar = ContentPillar.BRAND;
      funnelStage = FunnelStage.TOOL;
    } else if (category.includes("metode") || category.includes("uji")) {
      pillar = ContentPillar.SEARCH;
      funnelStage = FunnelStage.METHOD;
    } else if (category.includes("panduan") || category.includes("memilih")) {
      pillar = ContentPillar.SOLUTION;
      funnelStage = FunnelStage.SELECTION;
    }

    await prisma.article.update({
      where: { id: article.id },
      data: {
        pillar,
        funnelStage
      }
    });

    migratedCount++;
  }

  console.log(`Successfully migrated ${migratedCount} articles.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
