import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const toDelete = [
    "andislab-chemical-storage",
    "andislab-anti-vibration-table"
  ];

  await prisma.product.deleteMany({
    where: { slug: { in: toDelete } }
  });

  const newProducts = [
    {
      name: "Corrosive Storage Cabinet",
      slug: "corrosive-storage-cabinet",
      category: "andislab-custom",
      categoryLabel: "AndisLab Custom",
      brand: "AndisLab",
      model: "CS Series",
      subcategory: "Lemari Penyimpanan",
      description: "Lemari penyimpanan bahan korosif terbuat dari Polypropylene (PP) yang tahan korosi jangka panjang. Ideal untuk penyimpanan asam kuat, basa kuat, dan bahan pengoksidasi.",
      isReadyStock: false,
      price: 0,
      image: "/logo.png"
    },
    {
      name: "Meja Laboratorium (Island Bench)",
      slug: "meja-laboratorium-island-bench",
      category: "andislab-custom",
      categoryLabel: "AndisLab Custom",
      brand: "AndisLab",
      model: "Island Bench Custom",
      subcategory: "Furniture",
      description: "Meja laboratorium tengah (Island Bench) berbahan Phenolic Resin yang sangat tahan bahan kimia dan goresan. Dilengkapi dengan rak reagen, wastafel PP, dan stop kontak.",
      isReadyStock: false,
      price: 0,
      image: "/logo.png"
    }
  ];

  let added = 0;
  for (const p of newProducts) {
    const exists = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!exists) {
      await prisma.product.create({ data: p as any });
      added++;
    }
  }

  return NextResponse.json({ success: true, deleted: toDelete.length, added });
}
