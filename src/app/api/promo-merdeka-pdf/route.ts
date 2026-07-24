import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildPromoMerdekaPdfBytes } from "@/lib/promoMerdekaPdf";
import { serializeProductDecimals } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const readyStockProducts = await prisma.product.findMany({
      where: {
        isReadyStock: true,
      },
      include: {
        variants: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    const serialized = readyStockProducts.map(serializeProductDecimals);
    const bytes = buildPromoMerdekaPdfBytes(serialized as any[]);

    return new NextResponse(bytes as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="AndisLab-Katalog-Promo-MERDEKA-${new Date().toISOString().split("T")[0]}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to generate Promo MERDEKA PDF:", error);
    return new NextResponse("Gagal membuat PDF Katalog Promo MERDEKA", { status: 500 });
  }
}
