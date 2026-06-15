import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const newProducts = [
    {
      name: "Lovibond MD 100 Photometer",
      slug: "lovibond-md-100-photometer",
      category: "lovibond",
      categoryLabel: "Lovibond",
      brand: "Lovibond",
      description: "Photometer portabel untuk pengujian air dengan presisi tinggi.",
      isReadyStock: true,
      price: 15000000,
      image: "/images/lovibond-logo.png",
      model: "MD 100",
      subcategory: "Photometer"
    },
    {
      name: "Lovibond SensoDirect 150",
      slug: "lovibond-sensodirect-150",
      category: "lovibond",
      categoryLabel: "Lovibond",
      brand: "Lovibond",
      description: "Alat pengukur multi-parameter untuk pH, ORP, Konduktivitas, dan Oksigen Terlarut.",
      isReadyStock: true,
      price: 12500000,
      image: "/images/lovibond-logo.png",
      model: "SD 150",
      subcategory: "Meter"
    },
    {
      name: "Pyrex Buret dengan Stopcock",
      slug: "pyrex-buret-stopcock",
      category: "pyrex",
      categoryLabel: "Pyrex",
      brand: "Pyrex",
      description: "Buret kaca Pyrex berkualitas tinggi dengan PTFE stopcock.",
      isReadyStock: true,
      price: 1500000,
      image: "/images/pyrexlogo.PNG",
      model: "50ml Stopcock",
      subcategory: "Glassware"
    },
    {
      name: "Pyrex Cawan Petri Kaca",
      slug: "pyrex-cawan-petri",
      category: "pyrex",
      categoryLabel: "Pyrex",
      brand: "Pyrex",
      description: "Cawan petri kaca Pyrex yang dapat disterilisasi ulang.",
      isReadyStock: true,
      price: 450000,
      image: "/images/pyrexlogo.PNG",
      model: "100mm",
      subcategory: "Glassware"
    },
    {
      name: "AndisLab Custom Lemari Penyimpanan Kimia",
      slug: "andislab-chemical-storage",
      category: "andislab-custom",
      categoryLabel: "AndisLab Custom",
      brand: "AndisLab",
      description: "Lemari penyimpanan bahan kimia dengan sistem ventilasi khusus.",
      isReadyStock: false,
      price: 0,
      image: "/logo.png",
      model: "Chemical Storage",
      subcategory: "Furniture"
    },
    {
      name: "AndisLab Custom Meja Timbang Anti Getar",
      slug: "andislab-anti-vibration-table",
      category: "andislab-custom",
      categoryLabel: "AndisLab Custom",
      brand: "AndisLab",
      description: "Meja khusus untuk timbangan analitik dengan peredam getaran maksimal.",
      isReadyStock: false,
      price: 0,
      image: "/logo.png",
      model: "Anti Vibration Table",
      subcategory: "Furniture"
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

  return NextResponse.json({ success: true, added });
}
