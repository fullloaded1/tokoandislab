/**
 * Seed script — run locally with:
 *   npx tsx scripts/seed.ts
 *
 * Requires DATABASE_URL in .env or environment.
 * This was previously an unauthenticated GET endpoint at /api/seed.
 * Moved to a local script for safety.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  const toDelete = [
    "andislab-chemical-storage",
    "andislab-anti-vibration-table",
  ];

  const deleteResult = await prisma.product.deleteMany({
    where: { slug: { in: toDelete } },
  });
  console.log(`🗑️  Deleted ${deleteResult.count} old products.`);

  const newProducts = [
    {
      name: "Corrosive Storage Cabinet",
      slug: "corrosive-storage-cabinet",
      category: "andislab-custom",
      categoryLabel: "AndisLab Custom",
      brand: "AndisLab",
      model: "CS Series",
      subcategory: "Lemari Penyimpanan",
      description:
        "Lemari penyimpanan bahan korosif terbuat dari Polypropylene (PP) yang tahan korosi jangka panjang. Ideal untuk penyimpanan asam kuat, basa kuat, dan bahan pengoksidasi.",
      isReadyStock: false,
      price: 0,
      image: "/logo.png",
    },
    {
      name: "Meja Laboratorium (Island Bench)",
      slug: "meja-laboratorium-island-bench",
      category: "andislab-custom",
      categoryLabel: "AndisLab Custom",
      brand: "AndisLab",
      model: "Island Bench Custom",
      subcategory: "Furniture",
      description:
        "Meja laboratorium tengah (Island Bench) berbahan Phenolic Resin yang sangat tahan bahan kimia dan goresan. Dilengkapi dengan rak reagen, wastafel PP, dan stop kontak.",
      isReadyStock: false,
      price: 0,
      image: "/logo.png",
    },
  ];

  let added = 0;
  for (const p of newProducts) {
    const exists = await prisma.product.findUnique({
      where: { slug: p.slug },
    });
    if (!exists) {
      await prisma.product.create({ data: p as any });
      added++;
    }
  }

  console.log(`✅ Added ${added} new products.`);
  console.log("🌱 Seed completed.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
